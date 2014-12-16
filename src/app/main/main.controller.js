'use strict';

angular.module('cardistry.main', ['cardistry.cards','firebase'])
	.constant('CONFIG', {
    Firebase: {
      baseUrl: 'https://cardistry.firebaseio.com/gameDB'
    }
  })

  .controller('MainCtrl', function (Deck, $scope, $firebase, Auth, $filter, Deck2) {
  	var self = this;

    console.log(Deck2.load().then(Deck2.shuffle))

  	Auth.onAuth(function(user){
      self.user = user;
    });

  	this.dealIn = function(){
      Deck2.load().then(Deck2.shuffle).then(function(deck){
        self.user.deck = deck
  		  self.user.hand = Deck2.nextWhite(self.user.deck.white, 10)
  		  self.user.$save()
      })
  	}

    this.getCard = function(num){
      num = 1
      console.log(self.user.hand)
      self.user.hand = self.user.hand.concat(Deck2.nextWhite(this.user.deck.white, num))
      self.user.$save()
    }
})

	.controller('PlayerCtrl', function(Deck, $filter, $scope, Auth){

		var self = this;
  	
  	Auth.onAuth(function(user){
      self.user = user;
    });

})

	.controller('loginPageCtrl', function(Auth, $scope, $firebase, $filter, Deck){
 
    this.logIn = Auth.logIn;
 
    this.logOut = Auth.logOut;
	})

	.factory('FirebaseUrl', function(CONFIG){
    return new Firebase(CONFIG.Firebase.baseUrl);
 	 })

  .factory('Auth', function (FirebaseUrl, $firebaseAuth, $firebase, $filter, Deck){
 
    var auth = $firebaseAuth(FirebaseUrl);
 
    return {
 
      /**
       * Wrapper for '$firebaseAuth.$onAuth()' that filters the
       * 'auth' object through the 'updateUser()' function
       */
      onAuth: function(cb){
        auth.$onAuth(function(data){
          cb(updateUser(data));
        });
      },
 
      /**
       * Wrapper for '$firebaseAuth.$authWithOAuthPopup()' that invokes
       * the correct provider code
       */
       logIn: function(){
         return auth.$authWithOAuthPopup('facebook');
       },
 
 
      // Wrapper for '$firebaseAuth.$unauth()'
      logOut: function(){
        auth.$unauth();
      }
    }; // END service
 
    /**
    * Tranform the `authdUser` object from `$firebaseAuth` into a full User
    * record in the `/users` collection.
    *
    * @param {Object} authdUser from $firebaseAuth.getAuth()
    * @return {Object} from $firebase.$asObject()
    */
     function updateUser(authdUser){
       if ( authdUser === null ){
         return null;
      }
 			
      var user = FirebaseUrl.child('players').child(authdUser.facebook.id);
 
      user.update({
        uid: authdUser.uid,
        facebook: authdUser.facebook,
        fullName: authdUser.facebook.displayName,
        firstName: authdUser.facebook.cachedUserProfile.first_name,
        avatarUrl: authdUser.facebook.cachedUserProfile.picture.data.url,
        dailyScore: 0,
        weeklyScore: 0,
        totalScore: 0
      });
 
      var user = $firebase(FirebaseUrl.child('players').child(authdUser.facebook.id)).$asObject();
 
      return user;
    } // END updateUser
  }); // END factory(Auth)
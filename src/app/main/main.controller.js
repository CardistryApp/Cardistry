'use strict';

angular.module('cardistry.main', ['cardistry.cards','firebase'])
	.constant('CONFIG', {
    Firebase: {
      baseUrl: 'https://cardistry.firebaseio.com/gameDB'
    }
  })

  .controller('MainCtrl', function ($scope, $firebase, Auth, $filter, Deck) {
  	var self = this;

    console.log(Deck.load().then(Deck.shuffle))

  	Auth.onAuth(function(user){
      self.user = user;
    });

  	this.dealIn = function(){
      Deck.load().then(Deck.shuffle).then(function(deck){
        self.user.deck = deck
  		  self.user.hand = Deck.nextWhite(self.user.deck.white, 10)
  		  self.user.$save()
      })
  	}

    this.getCard = function(num){
      console.log(self.user.hand)
      self.user.hand = self.user.hand.concat(Deck.nextWhite(this.user.deck.white, num))
      self.user.$save()
    }
})

	.controller('PlayerCtrl', function($filter, $scope, Auth, Deck, FirebaseUrl, $firebase){
  	var self = this;
    Auth.onAuth(function(user){
      self.user = user;
    });
    var cardCzar = FirebaseUrl.child('cardCzar')
    var sync = $firebase(cardCzar)
    this.hand = self.user.hand
    this.cardIndex = 0;
    this.chosenCard = sync.$asArray();

    this.next = function(){
      if(self.cardIndex >= self.user.hand.length - 1) {
        this.cardIndex = 0;
      } else {
        this.cardIndex++;
      }
    };

    this.prev = function(){
      if(self.cardIndex <= 0) {
        this.cardIndex = 9;
      } else {
        this.cardIndex--;
      }
    };

    this.playCard = function(card, question){
      self.chosenCard.$add({
              question: self.user.deck.black[0].text,
              answer: card.text,
              user: self.user.uid
            })
      var index = self.user.hand.indexOf(card)
      self.user.hand.splice(index, 1)
      self.user.deck.black.splice(0, 1)
      self.user.hand = self.user.hand.concat(Deck.nextWhite(this.user.deck.white, 1))
      self.user.$save()
    }

    this.funny = function(){
      // gives points to user that submits the combo
    }

    this.notFunny = function(){
      //removes this card combo and serves up the next pair
    }
})

	.controller('loginPageCtrl', function(Auth){
 
    this.logIn = Auth.logIn;
 
    this.logOut = Auth.logOut;
	})

	.factory('FirebaseUrl', function(CONFIG){
    return new Firebase(CONFIG.Firebase.baseUrl);
 	 })

  .factory('Auth', function (FirebaseUrl, $firebaseAuth, $firebase, $filter){
 
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
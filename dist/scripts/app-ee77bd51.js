"use strict";angular.module("cardistry",["ui.router","firebase","cardistry.cards","cardistry.main","angular-gestures"]).config(["$stateProvider","$urlRouterProvider",function(a,r){a.state("login",{url:"/",templateUrl:"app/partials/login.html",controller:"loginPageCtrl as login"}).state("home",{url:"/home",templateUrl:"app/partials/home.html",controller:"MainCtrl as app"}).state("player",{url:"/player",templateUrl:"app/partials/player.html",controller:"PlayerCtrl as players"}).state("czar",{url:"/czar",templateUrl:"app/partials/czar.html",controller:"PlayerCtrl as players"}).state("about",{url:"/about",templateUrl:"app/partials/about.html"}),r.otherwise("/")}]),angular.module("cardistry.main",["cardistry.cards","firebase","angular-gestures"]).constant("CONFIG",{Firebase:{baseUrl:"https://cardistry.firebaseio.com/gameDB"}}).controller("MainCtrl",["$firebase","Auth","$filter","Deck",function(a,r,e,t){var i=this;r.onAuth(function(a){i.user=a}),this.scoreSet=function(){i.user.dailyScore=0,i.user.weeklyScore=0,i.user.totalScore=0},this.dealIn=function(){t.load().then(t.shuffle).then(function(a){i.user.deck=a,i.user.hand=t.nextWhite(i.user.deck.white,10),i.scoreSet(),i.user.$save()})},this.getCard=function(a){console.log(i.user.hand),i.user.hand=i.user.hand.concat(t.nextWhite(this.user.deck.white,a)),i.user.$save()}}]).controller("PlayerCtrl",["$filter","Auth","Deck","FirebaseUrl","$firebase",function(a,r,e,t,i){var l=this;r.onAuth(function(a){l.user=a}),console.log(l.user);var s=t.child("players"),n=i(s),o=t.child("cardCzar"),c=i(o);this.hand=l.user.hand,this.cardIndex=0,this.chosenCard=c.$asArray(),this.playersObj=n.$asObject(),console.log(this.playersObj),this.next=function(){l.cardIndex>=l.user.hand.length-1?this.cardIndex=0:this.cardIndex++},this.czarIndex=0,l.chosenCard.$loaded().then(function(){l.czarIndex=l.chosenCard.length-1}),this.prev=function(){l.cardIndex<=0?this.cardIndex=9:this.cardIndex--},this.playCard=function(a){l.chosenCard.$add({question:l.user.deck.black[0].text,answer:a.text,user:l.user.$id,priority:l.chosenCard.length+1});var r=l.user.hand.indexOf(a);l.user.hand.splice(r,1),l.user.deck.black.splice(0,1),l.user.hand=l.user.hand.concat(e.nextWhite(this.user.deck.white,1)),l.user.$save()},this.funny=function(a){this.playersObj[a].dailyScore++,this.playersObj.$save(),l.czarIndex--},this.notFunny=function(){l.czarIndex--}}]).controller("loginPageCtrl",["Auth",function(a){this.logIn=a.logIn,this.logOut=a.logOut}]).factory("FirebaseUrl",["CONFIG",function(a){return new Firebase(a.Firebase.baseUrl)}]).factory("Auth",["FirebaseUrl","$firebaseAuth","$firebase","$filter",function(a,r,e){function t(r){if(null===r)return null;var t=a.child("players").child(r.facebook.id);t.update({uid:r.uid,facebook:r.facebook,fullName:r.facebook.displayName,firstName:r.facebook.cachedUserProfile.first_name,avatarUrl:r.facebook.cachedUserProfile.picture.data.url});var t=e(a.child("players").child(r.facebook.id)).$asObject();return t}var i=r(a);return{onAuth:function(a){i.$onAuth(function(r){a(t(r))})},logIn:function(){return i.$authWithOAuthPopup("facebook")},logOut:function(){i.$unauth()}}}]),angular.module("cardistry.cards",[]).factory("Deck",["$http",function(a){var r={load:function(){return a.get("/assets/data/cards.JSON").then(function(a){r.cards={},r.cards.white=[],r.cards.black=[];for(var e=a.data,t=0;t<e.length;t++)"A"===e[t].cardType?r.cards.white[e[t].id]={text:e[t].text,priority:0,expansion:e[t].expansion}:"Q"===e[t].cardType&&1===e[t].numAnswers&&(r.cards.black[e[t].id]={text:e[t].text,priority:0,expansion:e[t].expansion})})},shuffle:function(){return angular.forEach(r.cards.white,function(a){a.priority=Math.floor(Math.random()*(Object.keys(r.cards.white).length-1)+1)}),angular.forEach(r.cards.black,function(a){a.priority=Math.floor(Math.random()*(Object.keys(r.cards.black).length-1)+1)}),angular.forEach(r.cards,function(a){a.sort(function(a,r){return r.priority-a.priority})}),r.cards},nextWhite:function(a,r){var e=a.splice(0,r);return e},nextBlack:function(){}};return r}]),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/about.html",'<div class="allabout"><div id="explaination"><h2>So... what is<br>Cards Against Singularity, anyway?</h2><br><h3>Well, start reading because we ain\'t doing it for ya!</h3><br><p>Who doesn\'t love Cards Against Humanity? We\'ll tell you who... the Introverts!<br><br></p><p>We just want to unite with other <span id="horrible">HORRIBLE</span> people but separately, in the safety of our own homes. Now we can, with Cards Against Singularity!</p><br></div><h3 class="rules">How To Play</h3><br><ol><li>Sign in via Facebook</li><br><li>Pick your Poison: Player or Czar.</li><br><li>As Player, you will view question cards and submit your best answer card from your hand... just waiting to be judged by others. No pressure though.</li><br><li>As Czar, you will view a collection of question/answer card pairs submitted by your fellow introverts and judge their humor. Funny? That player gets an awesome point. Not funny? Shoot them down and hope they cry</li></ol></div><ul><li class="back"><a ui-sref="home">Back</a></li></ul>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/confirmationModal.html",'<div id="modal" ng-controller="PlayerCtrl as players"><script type="text/ng-template"><div class="modal-header"> <h3 class="modal-title">Play This Card?</h3> </div> <div class="modal-body"> <ul> <li ng-repeat="question in players.user.deck.black"> {{question.text}} </li> <li ng-repeat="card in players.user.hand" ng-show="players.cardIndex == $index"> {{card.text}} </li> </ul> </div> <div class="modal-footer"> <button class="btn btn-primary" ng-click="players.PlayCard()">OK</button> <button class="btn btn-warning" ng-click="cancel()">Cancel</button> </div></script></div>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/czar.html",'<div id="player" ng-repeat="card in players.chosenCard" ng-show="players.czarIndex == $index"><ul id="questions"><li><section id="question" class="top"><h3>{{card.question}}</h3></section></li></ul><div class="controls"><div class="buttons"><p><span class="fa fa-thumbs-up thumbs"></span></p><p><span class="fa fa-thumbs-down thumbs"></span></p></div><div class="prev" hm-tap="players.notFunny()"></div><div class="next" hm-tap="players.funny(card.user)"></div></div><h3 class="answer"><div class="ansWrap"><ul class="bottom img-fulid answerCards" id="czarAnswer"><li id="{{$index}}">{{card.answer}}</li></ul></div><div class="back" id="pBack"><a ui-sref="home">Back</a></div></h3></div>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/home.html",'<div class="account"><section id="accountInfo"><img id="profilePic" src="{{app.user.avatarUrl}}"> <span id="greeting">Yo, Ari</span> <button ng-show="app.user.hand.length !== 10" id="deal" ng-click="app.dealIn()">Deal Me In!</button><ul id="scoreboard"><li>Daily Score: {{app.user.dailyScore}}</li><li>Weekly Score: {{app.user.weeklyScore}}</li><li>Total Score: {{app.user.totalScore}}</li></ul></section><ul id="gameChoices"><li class="bottom-left" id="cardCzar"><a ui-sref="czar">CZAR</a></li><li class="bottom-right" id="playerSelect"><a ui-sref="player">PLAYER</a></li></ul></div>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/lobby.html",'<div id="lobby" class="containr"><h1>Game Lobby</h1><ul class="col-md-4"><li><h1><a ui-sref="lobby.players">Players</a></h1></li><li><h1><a ui-sref="lobby.rules">Game Rules</a></h1></li><li><h1><a ui-sref="lobby.invite">Invite Friends</a></h1></li><li><h1><a ng-click="app.syncUp()">Start!</a></h1></li></ul><div class="col-md-8" ui-view=""></div></div>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/login.html",'<div class="auth"><ul><li class="top"><p>Cards Against Singularity</p></li><li class="about"><a ui-sref="about">About</a></li><li class="bottom"><a ng-click="login.logIn()" ui-sref="home">SIGN IN</a></li></ul></div>')}])}(),function(a){try{a=angular.module("cardistry")}catch(r){a=angular.module("cardistry",[])}a.run(["$templateCache",function(a){a.put("app/partials/player.html",'<div id="player"><ul id="questions"><li><section id="question" class="top" ng-repeat="question in players.user.deck.black"><h3>{{question.text}}</h3></section></li></ul><h3 class="answer"><div class="ansWrap"><ul class="bottom img-fulid answerCards"><div class="controls"><div class="prev" hm-tap="players.prev()"></div><div class="next" hm-tap="players.next()"></div></div><li ng-repeat="card in players.user.hand" ng-show="players.cardIndex == $index">{{card.text}}<div id="playCard" hm-tap="players.playCard(card)"></div></li></ul><div class="back" id="pBack"><a ui-sref="home">Back</a></div></div></h3></div>')}])}();
'use strict';

angular.module('cardistry.players', ['cardistry.cards', 'cardistry.game', 'firebase'])
	
	.factory('Players', function($filter, Deck, $state, $firebase, FIREBASE_URL, Game){
		var service = {};

		service.createPlayer = function(name) {
			var player = new Player(name);
			return player;
			};

		var idCounter = 0;

		var Player = function(name, index){
			this.name = name;
			this.cards = $filter('limitTo')(Deck.whiteCards, 10);
			this.score = 0;
			this.id = Game.players.length + 1
			Deck.whiteCards.splice(index, 10);
		}
		return service;
		})

	.controller('PlayerCtrl', function(Game, $stateParams, $scope){
		var value = {}
		var self = this

		angular.forEach(Game.players, function(value){
				if(value.id == $stateParams.id){
					self.value = value
				}
				return value
			})
	})
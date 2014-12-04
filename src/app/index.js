'use strict';

angular.module('cardistry', ['ngCookies', 'ngTouch', 'ui.router', 'firebase',
	'cardistry.cards','cardistry.main', 'cardistry.players'
	])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('lobby', {
        url: '/lobby',
        templateUrl: "app/partials/lobby.html"
      })
      .state('lobby.players', {
      	url: '/players',
      	templateUrl: "app/partials/lobby-players.html"
      })
      .state('lobby.rules', {
      	url: '/rules',
      	templateUrl: "app/partials/lobby-rules.html"
      })
      .state('lobby.invite', {
      	url: '/invite',
      	templateUrl: "app/partials/lobby-invite.html"
      })
      .state('player', {
      	url: '/player',
      	templateUrl: 'app/partials/player.html'
      })
      .state('id', {
      	url: '/player/:id',
      	templateUrl: 'app/partials/player-cards.html',
        controller: 'MainCtrl'
      })
      .state('board', {
      	url:'/board',
      	templateUrl: 'app/partials/board.html'
      })

    $urlRouterProvider.otherwise('/lobby');
  })
;

'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.alerts = [
            {
                icon: 'glyphicon-user',
                color:'btn-success',
                total: '20,408',
                description: 'TOTAL USERS'
            },
            {
                icon: 'glyphicon-folder-open',
                color: 'btn-primary',
                total: '8,382',
                description: 'TOTAL PROJECTS'
            },
            {
                icon: 'glyphicon-edit',
                color: 'btn-success',
                total: '527',
                description: 'NEW USERS IN 24H'
            },
            {
                icon: 'glyphicon-record',
                color: 'btn-info',
                total: '85,000',
                description: 'EMAILS SENT'
            }
        ];
	}
]);

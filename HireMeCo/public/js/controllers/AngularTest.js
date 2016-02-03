//Create a module called demoApp. ['ngRoute'] means demoApp depends on the routing script

//create a controller for demoApp
angular.module('TestModule', []).controller('TestController', function ($scope) {
    $scope.customers = [
        { name: 'Jarrett Long', city: 'Steger' },
        { name: 'Marco Fierri', city: 'Italy' },
        { name: 'Jack Minogue', city: 'Arlington Heights' }
    ];
});


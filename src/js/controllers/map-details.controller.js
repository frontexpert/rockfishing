rockFishing.controllers.controller('MapDetailsController', function ($scope, $state, fishingSpot) {
    var vm = $scope;
    
    vm.fishingSpot = fishingSpot;
    vm.backToHome = backToHome;
    
    function backToHome() {
		$state.go("home");
	}
});
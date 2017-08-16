rockFishing.controllers.controller('AboutController', function ($scope, $ionicHistory) {
	var vm = $scope;

	vm.backToHome = backToHome;

	function backToHome() {
		$ionicHistory.goBack();
	}
});
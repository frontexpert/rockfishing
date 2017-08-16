rockFishing.controllers.controller('SafetyController', function ($scope, $ionicHistory) {
	var vm = $scope;

	vm.backToHome = backToHome;

	function backToHome() {
		$ionicHistory.goBack();
	}
});
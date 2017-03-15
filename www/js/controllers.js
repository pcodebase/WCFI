angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $state, $q, $ionicActionSheet, $ionicLoading, $ionicModal, $timeout, DBFactory) {
    $scope.loginData = {};
    $scope.registrationData = {};
    console.log(window.localStorage.loggedIn)
    if (window.localStorage.loggedIn != undefined) {
        $rootScope.loggedIn = JSON.parse(window.localStorage.loggedIn);
    }

    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/registration.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.registrationModal = modal;
    });

    $scope.openLogin = function() {
        $scope.loginModal.show();
    };

    $scope.openRegistration = function() {
        $scope.registrationModal.show();
    };

    $scope.closeLogin = function() {
        $scope.loginModal.hide();
    };

    $scope.closeRegistration = function() {
        $scope.registrationModal.hide();
    };

    $scope.doLogin = function() {
        $timeout(function() {
            DBFactory.getUser($scope.loginData.username).then(function(user) {
                if (user != null) {
                    $rootScope.loggedIn = {
                        "username": user.username,
                        "name": user.name,
                        "role": user.role,
                        "phoneNo": user.phoneNo,
                        "specialization": user.specialization
                    };
                    window.localStorage.loggedIn = JSON.stringify($rootScope.loggedIn);
                    console.log(JSON.stringify($rootScope.loggedIn));
                    $scope.closeLogin();
                } else {
                    alert("Your login credentials were incorrect. Please try again.")
                }
            });
        }, 500);
    };

    $scope.doRegister = function() {
        $timeout(function() {
            console.log(JSON.stringify($scope.registrationData));
            DBFactory.addUser($scope.registrationData);
            $scope.closeRegistration();
        }, 500);
    };

    $scope.logout = function() {
        window.localStorage.clear();
        $rootScope.loggedIn = null;
        /*
        var hideSheet = $ionicActionSheet.show({
        	destructiveText: 'Logout',
        	titleText: 'Are you sure you want to logout?',
        	cancelText: 'Cancel',
        	cancel: function() {},
        	buttonClicked: function(index) {
        		return true;
        	},
        	destructiveButtonClicked: function(){

        		$ionicLoading.show({template: 'Logging out...'});

        		//window.localStorage.username = undefined;
        		//window.localStorage.role = undefined;
        		window.localStorage.clear();
        		$ionicLoading.hide();
        		$state.go('tab.dash');
        		//$scope.loading.hide();
        	}
        });*/
        //window.reload();
        //$state.go("tab.account");
        /*
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            window.close();
        }
        */
        //$state.go('tab.dash');
        //$state.go($state.current, {}, { reload: true }); 
    };
})

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true,
        enableAlerts: false,
        enableLocation: true
    };
});
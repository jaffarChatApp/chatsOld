ChatApp.controller('dashboardCtrl', ['$scope', '$rootScope', '$http', '$state', '$sessionStorage', '$stateParams', '$timeout', 'CONFIG', function ($scope, $rootScope, $http, $state, $sessionStorage, $stateParams, $timeout, CONFIG) {
    $scope.getUserData('dashboard');

    $scope.userData = $sessionStorage.userData;

    /*Get All users*/
    $scope.getUserList = function () {
        var getData = {
            userId: $sessionStorage.userData.UserId
        }
        $http({
            method: 'GET',
            url: CONFIG.nodeJsUrl + 'getUserlist',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.data.success == true) {
                if (response.data.userData.length > 0) {
                    $scope.userList = response.data.userData;
                }
            }
        });
    }
    $scope.getUserList();

    /*Navigate to Chat View*/
    $scope.messageView = function (item) {
        $state.go('home.chatView', {
            fromUserId: $scope.userData.UserId,
            toUserId: item.UserId
        });
        /*$state.go('home.chatView', {
            fromUserId: $scope.userData.UserId,
            toUserId: item.UserId,
            fromUserName: $scope.userData.Name,
            toUserName: item.Name
        });*/
    }

    $scope.notifyUser = function () {
        OneSignal.push(function () {
            OneSignal.showHttpPrompt();
        });
    }
    $timeout(function () {
        $scope.notifyUser();
    }, 100);

}]);

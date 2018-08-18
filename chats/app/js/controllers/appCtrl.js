ChatApp.controller('appCtrl', ['$scope', '$rootScope', '$http', '$state', '$sessionStorage', '$filter', '$mdToast', '$mdMenu', '$timeout', '$mdSidenav', 'CONFIG', function ($scope, $rootScope, $http, $state, $sessionStorage, $filter, $mdToast, $mdMenu, $timeout, $mdSidenav, CONFIG) {
    $scope.selected = 'dashboard';
    $scope.showLoginArea = true;
    //$scope.showRegisterArea = true;
    $scope.toggleList = function () {
        $mdSidenav('left').toggle();
    };

    $scope.openMenu = function (ev) {
        $mdMenu.open(ev);
    };

    $scope.register = {
        "name": "",
        "email": "",
        "mobile": "",
        "password": "",
        "profession": "",
        "registeredDate": new Date()
    }

    $scope.lodinData = {
        "password": "",
        "email": "",
        "loginDate": new Date()
    }

    /*Registration*/
    $scope.submitForm = function () {
        var uniqueId = Math.random().toString(36).slice(2);
        var UserId = uniqueId.substring(0, 6);
        var sendData = {
            "Name": $scope.register.name,
            "Email": $scope.register.email,
            "Password": $scope.register.password,
            "Mobile": $scope.register.mobile,
            "Profession": $scope.register.profession,
            "Registered_Date": $scope.register.registeredDate.getTime(),
            "UserId": UserId
        }
        $http({
            method: 'POST',
            url: CONFIG.nodeJsUrl + 'registerUser',
            headers: {
                'Content-Type': 'application/json'
            },
            data: sendData
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success == true) {
                $scope.msgContent = "Registered successfully.";
                $scope.toasterClass = "successClass";
                $scope.showAlertMessage();
                $timeout(function () {
                    $scope.checkUserExist('login');
                }, 500);
            }
        });
    }

    $scope.createTable = function () {
        $http({
            method: 'GET',
            url: CONFIG.nodeJsUrl + 'createTable',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            $scope.loading = false;
        });
    }

    /*$scope.submitForm = function () {
        $scope.loading = true;
        $scope.register.registeredDate = $filter('date')($scope.register.registeredDate, 'yyyy-MM-dd HH:mm:ss');
        $http({
            method: 'POST',
            url: CONFIG.rootUrl + 'registerUser',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.register
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success == true) {
                $sessionStorage.userData = response.data.userData[0];
                $scope.msgContent = "Registeration successfully.";
                $scope.toasterClass = "successClass";
                $scope.showAlertMessage();
                $state.go('home.dashboard');
            } else {
                $scope.msgContent = "Registeration failed.";
                $scope.toasterClass = "warningClass";
                $scope.showAlertMessage();
            }
        });
    }*/

    /*Login*/
    $scope.login = function () {
        if ($scope.register.email != "" && $scope.register.password != "") {
            $scope.checkUserExist('login');
        } else {
            if ($scope.register.email == "" && $scope.register.password == "") {
                $scope.msgContent = "Please enter email Id and Password.";
            } else {
                if ($scope.register.email == "") {
                    $scope.msgContent = "Please enter email Id.";
                }
                if ($scope.register.password == "") {
                    $scope.msgContent = "Please enter Password.";
                }
            }
            $scope.toasterClass = "warningClass";
            $scope.showAlertMessage();
        }
    }

    /*Check User Exist*/
    $scope.checkUserExist = function (event) {
        $scope.loading = true;
        var checkUser = {
            email: $scope.register.email,
            password: $scope.register.password
        };
        $http({
            method: 'POST',
            url: CONFIG.nodeJsUrl + 'checkUserExist',
            //url: CONFIG.rootUrl + 'checkUserExist',
            headers: {
                'Content-Type': 'application/json'
            },
            data: checkUser
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success == true) {
                $sessionStorage.userData = response.data.userData;
                if (event == 'login') {
                    $state.go('home.dashboard');
                    $scope.msgContent = "Login successfully.";
                    $scope.toasterClass = "successClass";
                } else {
                    $scope.msgContent = "Your email id is registered with us, please login to continue.";
                    $scope.toasterClass = "warningClass";
                }
                $scope.showAlertMessage();
            } else {
                $scope.msgContent = response.data.msg;
                /*if (event == 'login') {
                    $scope.msgContent = "Your email is id not registeration with us, please register and continue.";
                }*/
                $scope.toasterClass = "errorClass";
                $scope.showAlertMessage();
            }
        });
    }

    /*View Change*/
    $scope.showView = function (view) {
        if (view == 'register') {
            $scope.showLoginArea = false;
            $scope.showRegisterArea = true;
        } else {
            $scope.showRegisterArea = false;
            $scope.showLoginArea = true;
        }
    }

    /*Alert Message*/
    $scope.showAlertMessage = function () {
        $mdToast.show(
            $mdToast.simple()
            .textContent($scope.msgContent)
            .position('top left')
            .hideDelay(3000)
            .toastClass($scope.toasterClass)
        );
    }

    /*Get Login User Data*/
    $scope.getUserData = function (page) {
        if (page == 'chat') {
            $scope.showMenuIcon = false;
            $scope.showBackIcon = true;

        } else {
            $scope.showBackIcon = false;
            $scope.showMenuIcon = true;
        }
        $scope.userData = $sessionStorage.userData;
    }

    /*Logout*/
    $scope.logout = function () {
        $state.go('login');
        $sessionStorage.$reset();
    }

    /*Back Menu*/
    $scope.goBack = function () {
        $state.go('home.dashboard');
    }

    /*Get Page Title*/
    $rootScope.pageTitle = function () {
        $scope.title = $state.current.title;
        return ($scope.title);
    };


    $scope.getUserList = function () {

        var getData = {
            userId: "jaffar" //$sessionStorage.userData.userId
        }
        var postData = angular.copy(getData);
        //var sendData = JSON.stringify(postData);
        var sendData = 'data=' + JSON.stringify(postData);
        $http({
            method: 'GET',
            url: CONFIG.rootUrl + 'function=getUsers',
            headers: {
                'Content-Type': 'application/json'
            },
            //data: sendData,
        }).then(function (response) {
            if (response.data.success == true) {
                if (response.data.userData.length > 0) {
                    $scope.userList = response.data.userData;
                }
            }
        });
    }
    //$scope.getUserList();

    $scope.createFile = function (event) {
        $http({
            method: 'GET',
            url: CONFIG.rootUrl + 'function=createFile',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

        })
    }

    $scope.updateFile = function (event) {
        $http({
            method: 'GET',
            url: CONFIG.rootUrl + 'function=updateFile',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

        })
    }

    $scope.appendFile = function (event) {
        $http({
            method: 'GET',
            url: CONFIG.rootUrl + 'function=appendFile',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

        })
    }

    /*var db = openDatabase("my.db", '1.0', "My WebSQL Database", 2 * 1024 * 1024);

    $scope.createDb = function () {
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS users (id integer primary key, firstname text, lastname text)");
        });
    }
    $scope.createDb();

    $scope.insert = function (firstname, lastname) {
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO users (firstname, lastname) VALUES (?,?)", ["Jaffar", "Ali"]);
        });
    }
    $timeout(function () {
        $scope.insert()
    }, 1000);


    $scope.getUsers = function () {
        db.transaction(function (tx) {
            tx.executeSql("SELECT firstname, lastname FROM users", [], function (tx, results) {
                if (results.rows.length > 0) {
                    for (var i = 0; i < results.rows.length; i++) {
                        console.log("Result -> " + results.rows.item(i).firstname + " " + results.rows.item(i).lastname);
                    }
                }
            });
        });
    }
    $timeout(function () {
        $scope.getUsers();
    }, 2000);*/
}]);

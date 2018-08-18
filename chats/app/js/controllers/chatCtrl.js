ChatApp.controller('chatCtrl', ['$scope', '$rootScope', '$http', '$state', '$sessionStorage', '$stateParams', '$interval', '$timeout', '$mdToast', '$anchorScroll', 'CONFIG', function ($scope, $rootScope, $http, $state, $sessionStorage, $stateParams, $interval, $timeout, $mdToast, $anchorScroll, CONFIG) {
    /*Get Login UserData*/
    $scope.getUserData('chat');

    /*Variable Declarations*/
    var wsConnected = false;
    $scope.messageData = {
        message: "",
        fromUser: $stateParams.fromUserId,
        toUser: $stateParams.toUserId,
        senderName: "",
        recieverName: "",
        postedDate: new Date().getTime()
    }
    $scope.chatList = [];

    /*Get User Chats*/
    $scope.getChatList = function (event) {
        $scope.loading = true;
        var getChats = {
            fromUser: $stateParams.fromUserId,
            toUser: $stateParams.toUserId
        }

        $http({
            method: 'POST',
            url: CONFIG.nodeJsUrl + 'getChatList',
            headers: {
                'Content-Type': 'application/json'
            },
            data: getChats
        }).then(function (response) {
            $scope.loading = false;
            if (response.data.success == true) {
                $scope.messageData.senderName = response.data.fromUser;
                $scope.messageData.recieverName = response.data.toUser;
                if (response.data.chats.length > 0) {
                    $scope.chatList = response.data.chats;
                    $scope.scrollTo('onLoad');
                }
            } else {
                $scope.msgContent = "You have'nt sent any message to this person yet.";
                $scope.toasterClass = "warningClass";
                $scope.showAlertMessage();
            }
            document.getElementById('chatInput').focus();
        }, function (error) {
            $scope.loading = false;
            $scope.createTable();
        });
    }
    $scope.getChatList();

    /*Send Message*/
    $scope.sendMessage = function (event) {
        var message = $scope.messageData;
        var uniqueId = Math.random().toString(36).slice(2);
        var msgId = uniqueId.substring(0, 6);
        message.msgId = msgId;
        $http({
            method: 'POST',
            url: CONFIG.nodeJsUrl + 'sendMessage',
            headers: {
                'Content-Type': 'application/json'
            },
            data: message
        }).then(function (response) {
            if (response.data.success == true) {
                //$scope.sendNotification(event, message);
                $scope.connectChatWs(message);
                /*$timeout(function () {
                    $scope.getChatList();
                }, 500);*/
                $scope.messageData.message = "";
            }
        });
    }

    $scope.sendNotification = function (event, message) {
        //var url = "https://jaffarchatapp.github.io/jaffarChatApp/#!/home/chat/25sl29juhjxbima/vsncvm18d71z1x6"
        var sendData = {
            "app_id": CONFIG.app_id,
            "contents": {
                "en": message.message
            },
            "included_segments": ["Active Users", "Inactive Users"],
            "url": "https://jaffarchatapp.github.io/jaffarChatApp/#!/home/chat/25sl29juhjxbima/vsncvm18d71z1x6"
            //"included_segments": ["All"]
        }
        $http({
            method: 'POST',
            url: CONFIG.notifyUrl,
            headers: {
                'Authorization': CONFIG.REST_API_KEY,
                'Content-Type': 'application/json'
            },
            data: sendData
        }).then(function (response) {
            //console.log("response", response);
        })
    }

    /*Websocket Connection*/
    $scope.connectChatWs = function (data) {
        if (wsConnected == false) {
            userMessages = new WebSocket(CONFIG.nodeJsChatUrl);
        }
        var message = {
            fromUserId: $stateParams.fromUserId,
            toUserId: $stateParams.toUserId,
            connectWS: wsConnected,
            chat: data
        }
        var sendData = JSON.stringify(message);

        userMessages.onopen = function () {
            userMessages.send(sendData);
            $timeout(function () {
                wsConnected = true;
            }, 200);
        };
        if (message.chat != undefined) {
            userMessages.send(sendData);
        }

        userMessages.onmessage = function (evt) {
            var allMsg = evt.data;
            var response = JSON.parse(allMsg);
            if (response.data.seccess == true && response.type == "message") {
                $scope.chatList.push(response.data.message.chat);
                $scope.scrollTo();
            }
        };

        userMessages.onerror = function (evt) {
            userMessages.onclose();
        };
        userMessages.onclose = function () {
            wsConnected = false;
            //$scope.connectChatWs();
        }
    }

    /*Call to Connect Websocket Function*/
    $timeout(function () {
        $scope.connectChatWs();
    }, 800);

    /*Scroll To Bottom*/
    $scope.scrollTo = function (event) {
        var lastIndex = $scope.chatList.length - 1;
        var scrollTo = 'chat' + $scope.chatList[lastIndex].msgId;
        $timeout(function () {
            var element = document.querySelector("#" + scrollTo);
            if (element) {
                element.scrollIntoView(element);
            }
        }, 300);
        if (event != 'onLoad') {
            $scope.$apply();
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

    /*Stop the Function When Page Changed*/
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        $scope.pageChanged = true;
        userMessages.close();
    });
}])

/*Prod URl Configuration*/
/*ChatApp.constant('CONFIG', {
    'name': 'Chat App',
    'version': '1.0',
    'rootUrl': "https://stg.paycheckalpha.com:1880/chatApp/", // Production Server
    'chatUrl': "wss://stg.paycheckalpha.com:1880/ws/getChats", // Production WS
    'notifyUrl': "https://onesignal.com/api/v1/notifications", // Notification URL
    'REST_API_KEY': "Basic ZWJjOWQxNDEtYTg5ZS00YmY2LWI5YmQtMmZmMmIwNTBlZDM1", // REST API KEY
    'app_id': "fe9010f6-0bb3-464a-9e55-6aab21b2f944", // App Id
});*/

/*Remote URl Configuration*/
/*ChatApp.constant('CONFIG', {
    'name': 'Chat App',
    'version': '1.0',
    'rootUrl': "http://192.168.1.98:1997/chatApp/", // Production Server
    'chatUrl': "ws://192.168.1.98:1997/ws/getChats", // Production WS
});*/

/*Dev URl Configuration*/
/*ChatApp.constant('CONFIG', {
    'name': 'Chat App',
    'version': '1.0',
    //'rootUrl': "http://127.0.0.1:1880/chatApp/", // Local Server
    'rootUrl': "http://localhost:1880/chatApp/", // Local Server
    'chatUrl': "ws://localhost:1880/ws/getChats", // Local WS
    'notifyUrl': "https://onesignal.com/api/v1/notifications", // Notification URL
    'REST_API_KEY': "Basic ZWJjOWQxNDEtYTg5ZS00YmY2LWI5YmQtMmZmMmIwNTBlZDM1", // REST API KEY
    'app_id': "fe9010f6-0bb3-464a-9e55-6aab21b2f944", // App Id
});*/

/*Dev PHP URl Configuration*/
ChatApp.constant('CONFIG', {
    'name': 'Chat App',
    'version': '1.0',
    'nodeJsUrl': 'http://localhost:1995/',
    'nodeJsChatUrl': "ws://localhost:1996",
    'rootUrl': "http://192.168.1.82/serverApi/index.php?", // Local Server
    'chatUrl': "ws://localhost:1880/ws/getChats", // Local WS
    'notifyUrl': "https://onesignal.com/api/v1/notifications", // Notification URL
    'REST_API_KEY': "Basic ZWJjOWQxNDEtYTg5ZS00YmY2LWI5YmQtMmZmMmIwNTBlZDM1", // REST API KEY
    'app_id': "fe9010f6-0bb3-464a-9e55-6aab21b2f944", // App Id
});

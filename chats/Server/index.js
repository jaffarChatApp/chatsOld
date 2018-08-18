var fileSystem = require('fs');
var http = require('http');
var express = require('express');
const bodyParser = require("body-parser");
var app = express();
var excel = require('excel4node');
var XLSX = require('xlsx');
var WebSocketServer = require('websocket').server;
var cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());

/*Server Creation with WebSocket*/
var wsServer = http.createServer(function (request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
});
wsServer.listen(1996, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Web Socket Connected");
});

var server = app.listen(1995, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://localhost:", port)
});

wsServer = new WebSocketServer({
    httpServer: wsServer
});

// WebSocket server
var clients = [];
wsServer.on('request', function (request) {
    var connection = request.accept(null, request.origin);

    console.log('Connection accepted.');


    var sendData = {
        "seccess": true,
        "message": ""
        //"connection": connection
    }

    //var index = clients.push(connection) - 1;

    //clients.push(sendData);
    clients.push(connection);
    var index = clients.length - 1;
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            //console.log("WS Connected", message);
            var messageData = JSON.parse(message.utf8Data);
            //console.log("WS messageData", messageData);

            //console.log("index", index);
            if (messageData.connectWS == false) {
                sendData.message = 'Connected';
                //for (var i = 0; i < clients.length; i++) {

                clients[index].fromUserId = messageData.fromUserId;
                clients[index].toUserId = messageData.toUserId;

                //}
                //console.log("clients", clients);
            } else {
                sendData.message = messageData;
                var jsonData = JSON.stringify({
                    type: 'message',
                    data: sendData
                });
                //console.log("jsonData", jsonData);
                for (var i = 0; i < clients.length; i++) {
                    //if ((clients[i].fromUserId == messageData.fromUserId && clients[i].toUserId == messageData.toUserId) || (clients[i].fromUserId == messageData.toUserId && clients[i].toUserId == messageData.fromUserId)) {
                    if ((clients[i].fromUserId == messageData.fromUserId && clients[i].toUserId == messageData.toUserId) || (clients[i].fromUserId == messageData.toUserId && clients[i].toUserId == messageData.fromUserId)) {
                        //console.log("clients fromUserId", clients[i].fromUserId);
                        //console.log("clients toUserId", clients[i].toUserId);
                        clients[i].sendUTF(jsonData);
                    }
                    /*if (clients[i].fromUserId == messageData.toUserId && clients[i].toUserId == messageData.fromUserId) {
                        clients[i].sendUTF(jsonData);
                    }*/
                    //clients[i].sendUTF(jsonData);
                }
                //console.log("chatList", chatList);
            }
        }
    });

    connection.on('close', function (connection) {});
});

/*Get Users*/
app.post('/checkUserExist', function (req, res) {
    var user = req.body;
    var workbook = XLSX.readFile('users.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var userList = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var sendResponse = {
        "msg": "User exist",
        "success": false,
        "userData": ""
    }
    if (userList.length > 0) {
        for (var u = 0; u < userList.length; u++) {

            if (userList[u].Email == user.email && userList[u].Password == user.password) {
                sendResponse.userData = userList[u];
                sendResponse.success = true;
                break;
            } else {
                if (userList[u].Email == user.email && userList[u].Password != user.password) {
                    sendResponse.msg = "Password don't match";
                    sendResponse.success = false;
                }
                if (userList[u].Email != user.email && userList[u].Password == user.password) {
                    sendResponse.msg = "Email Id doesn't exist";
                    sendResponse.success = false;
                }
                if (userList[u].Email != user.email && userList[u].Password != user.password) {
                    sendResponse.msg = "Your email id is not registered with us, please register and continue.";
                    sendResponse.success = false;
                }
            }
        }
    } else {
        sendResponse.msg = "Your email id is not registered with us, please register and continue.";
        sendResponse.success = false;
    }
    //console.log("sendResponse", sendResponse);
    res.end(JSON.stringify(sendResponse));
});

/*User Register*/
app.post('/registerUser', function (req, res) {
    var workbook = XLSX.readFile('users.xlsx');
    //console.log("workbook", workbook);
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var dataSet = {
        "newData": req.body,
        "oldData": xlData
    }
    updateData(dataSet, res);
});

/*Update Users*/
function updateData(data, res) {
    //console.log("Data", data);
    userData = data.oldData;
    userData.push(data.newData);

    var workbook = new excel.Workbook();
    var style = workbook.createStyle({
        font: {
            color: '#292929',
            size: 16
        }
    });

    var worksheet = workbook.addWorksheet('Users');

    worksheet.cell(1, 1).string('SrNo').style(style);
    worksheet.cell(1, 2).string('Name').style(style);
    worksheet.cell(1, 3).string('Email').style(style);
    worksheet.cell(1, 4).string('Password').style(style);
    worksheet.cell(1, 5).string('Mobile').style(style);
    worksheet.cell(1, 6).string('Profession').style(style);
    worksheet.cell(1, 7).string('Registered_Date').style(style);
    worksheet.cell(1, 8).string('UserId').style(style);

    var srNo = 1;
    for (var u = 0; u < userData.length; u++) {

        var rowData = u + 2;
        if (u > 0) {
            var cellData = u + 1;
            srNo = cellData; //.toString();
        }

        /*var uniqueId = Math.random().toString(36).slice(2);
        var userId = uniqueId.substring(0, 6);*/

        var setData = {
            "SrNo": srNo,
            "Name": userData[u].Name,
            "Email": userData[u].Email,
            "Password": userData[u].Password,
            "Mobile": userData[u].Mobile,
            "Profession": userData[u].Profession,
            "Registered_Date": userData[u].Registered_Date.toString(),
            "UserId": userData[u].UserId
        }
        //console.log("setData", setData);

        worksheet.cell(rowData, 1).number(setData.SrNo).style(style);
        worksheet.cell(rowData, 2).string(setData.Name).style(style);
        worksheet.cell(rowData, 3).string(setData.Email).style(style);
        worksheet.cell(rowData, 4).string(setData.Password).style(style);
        worksheet.cell(rowData, 5).string(setData.Mobile).style(style);
        worksheet.cell(rowData, 6).string(setData.Profession).style(style);
        worksheet.cell(rowData, 7).string(setData.Registered_Date).style(style);
        worksheet.cell(rowData, 8).string(setData.UserId).style(style);

        if (u == userData.length - 1) {
            break;
        }
    }

    var workbookName = "users.xlsx";
    workbook.write(workbookName);

    var sendResponse = {
        "msg": "Updated successfully",
        "success": true
    }
    res.end(JSON.stringify(sendResponse));
}

/*Get User List*/
app.get('/getUserlist', function (req, res) {
    var workbook = XLSX.readFile('users.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var userList = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var sendResponse = {
        "msg": "User list",
        "success": true,
        "userData": userList
    }
    if (userList.length == 0) {
        sendResponse.msg = "Users are not registered with us.";
        sendResponse.success = false;
    }
    res.end(JSON.stringify(sendResponse));
});

/*Get Chat List*/
app.post('/getChatList', function (req, res) {
    var chatData = req.body;
    var workbook = XLSX.readFile('chats.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var chatList = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    var userWorkbook = XLSX.readFile('users.xlsx');
    var userSheetList = userWorkbook.SheetNames;
    var userData = XLSX.utils.sheet_to_json(userWorkbook.Sheets['Users']);

    var sendResponse = {
        "msg": "Chat list",
        "success": true,
        "chats": [],
        "fromUser": "",
        "toUser": ""
    }

    if (chatList.length == 0) {
        sendResponse.msg = "You have'nt sent any message to this person yet.";
        sendResponse.success = false;
    } else {
        for (var c = 0; c < chatList.length; c++) {
            if ((chatList[c].fromUser == chatData.fromUser && chatList[c].toUser == chatData.toUser) || (chatList[c].fromUser == chatData.toUser && chatList[c].toUser == chatData.fromUser)) {
                sendResponse.chats.push(chatList[c]);
            }
        }
    }
    //console.log("userData", userData);

    for (var u = 0; u < userData.length; u++) {
        if (userData[u].UserId == chatData.fromUser) {
            sendResponse.fromUser = userData[u].Name;
        }
        if (userData[u].UserId == chatData.toUser) {
            sendResponse.toUser = userData[u].Name;
        }
    }
    res.end(JSON.stringify(sendResponse));
});

/*Save Chats*/
app.post('/sendMessage', function (req, res) {
    var workbook = XLSX.readFile('chats.xlsx');
    //console.log("workbook", workbook);

    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    //console.log("xlData", xlData);
    var dataSet = {
        "newData": req.body,
        "oldData": xlData
    }
    updateChat(dataSet, res);
});

/*Update Users*/
function updateChat(data, res) {

    var chatData = data.oldData;
    chatData.push(data.newData);
    var workbook = new excel.Workbook();
    var style = workbook.createStyle({
        font: {
            color: '#292929',
            size: 16
        }
    });
    var worksheet = workbook.addWorksheet('Chats');

    worksheet.cell(1, 1).string('id').style(style);
    worksheet.cell(1, 2).string('msgId').style(style);
    worksheet.cell(1, 3).string('message').style(style);
    worksheet.cell(1, 4).string('fromUser').style(style);
    worksheet.cell(1, 5).string('toUser').style(style);
    worksheet.cell(1, 6).string('postedDate').style(style);
    worksheet.cell(1, 7).string('senderName').style(style);
    worksheet.cell(1, 8).string('recieverName').style(style);

    var srNo = 1;
    //console.log("chatData", chatData);
    for (var c = 0; c < chatData.length; c++) {
        var rowData = c + 2;
        if (c > 0) {
            var cellData = c + 1;
            srNo = cellData; //.toString();
        }

        /*var uniqueId = Math.random().toString(36).slice(2);
        var msgId = uniqueId.substring(0, 6);*/

        var setData = {
            "id": srNo,
            "msgId": chatData[c].msgId,
            "message": chatData[c].message,
            "fromUser": chatData[c].fromUser,
            "toUser": chatData[c].toUser,
            "postedDate": chatData[c].postedDate.toString(),
            "senderName": chatData[c].senderName,
            "recieverName": chatData[c].recieverName
        }
        //console.log("setData", setData);

        worksheet.cell(rowData, 1).number(setData.id).style(style);
        worksheet.cell(rowData, 2).string(setData.msgId).style(style);
        worksheet.cell(rowData, 3).string(setData.message).style(style);
        worksheet.cell(rowData, 4).string(setData.fromUser).style(style);
        worksheet.cell(rowData, 5).string(setData.toUser).style(style);
        worksheet.cell(rowData, 6).string(setData.postedDate).style(style);
        worksheet.cell(rowData, 7).string(setData.senderName).style(style);
        worksheet.cell(rowData, 8).string(setData.recieverName).style(style);

        if (c == chatData.length - 1) {
            break;
        }
    }

    var workbookName = "chats.xlsx";
    workbook.write(workbookName);

    var sendResponse = {
        "msg": "Updated successfully",
        "success": true
    }
    res.end(JSON.stringify(sendResponse));
}

/*Table Creation*/
app.get('/createTable', function (req, res) {
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Chats');
    //var worksheet = workbook.addWorksheet('Users');
    var style = workbook.createStyle({
        font: {
            color: '#292929',
            size: 16
        }
    });

    worksheet.cell(1, 1).string('id').style(style);
    worksheet.cell(1, 2).string('msgId').style(style);
    worksheet.cell(1, 3).string('message').style(style);
    worksheet.cell(1, 4).string('fromUser').style(style);
    worksheet.cell(1, 5).string('toUser').style(style);
    worksheet.cell(1, 6).string('postedDate').style(style);
    worksheet.cell(1, 7).string('senderName').style(style);
    worksheet.cell(1, 8).string('recieverName').style(style);

    /*worksheet.cell(1, 1).string('SrNo').style(style);
    worksheet.cell(1, 2).string('Name').style(style);
    worksheet.cell(1, 3).string('Email').style(style);
    worksheet.cell(1, 4).string('Password').style(style);
    worksheet.cell(1, 5).string('Mobile').style(style);
    worksheet.cell(1, 6).string('Profession').style(style);
    worksheet.cell(1, 7).string('Registered_Date').style(style);
    worksheet.cell(1, 8).string('UserId').style(style);*/

    var workbookName = "chats.xlsx";
    //var workbookName = "users.xlsx";
    workbook.write(workbookName);

    var sendResponse = {
        "msg": "Table created successfully",
        "success": true
    }
    res.end(JSON.stringify(sendResponse));
});

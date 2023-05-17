#!/usr/local/bin/node

/* ChatServer */
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port : 8888}, () => {
    console.log('Chat Server Start');
});

var CLIENTS=[];

const mongoose = require('mongoose'); // MongoDB
const chatLog = require('./Env/mongo'); // MonboDB Model

wss.on('connection', (ws) => {
    CLIENTS.push(ws);

    try {
        mongoose.connect('mongodb://accro:accro@localhost:27017/accro?authSource=admin&authMechanism=SCRAM-SHA-1', { useNewUrlParser: true }); // MongoDB 접속
    } catch (error) {
        console.log(error);
    }

    ws.on('message', (msg) => {
        var str = String(msg).split(' ');
        var cmd = str[0];

        if (cmd == '/lobby' || cmd == '/w' || cmd =='/room') {
                if (cmd == '/lobby') {
                        var opt = '';
                        var id = str[1].replace("[", "");
                        id = id.replace("]", "");
                        var content = str[3];
                }
                else if (cmd == '/w') {
                        var opt = str[1];
                        var id = str[2].replace("[", "");
                        id = id.replace("]", "");
                        str = String(msg).split('>');
                        var content = str[str.length - 1];
                } else if (cmd == '/room') {
                        var opt = str[1];
                        var id = str[2].replace("[", "");
                        id = id.replace("]", "");
                        str = String(msg).split(':');
                        var content = str[1];
               }
        
                var chat = new chatLog(); // MongoDB Model 생성
                chat.cmd = cmd;
                chat.opt = opt;
                chat.id = id;
                chat.content = content;
                chat.save().then(() => {}).catch((error) => {}); // 데이터 저장
        }

        sendAll(msg.toString()); // 메시지 브로드캐스팅
    });

    ws.on('disconnect', () => {
        try {
            mongoose.disconnect(); // MongoDB 연결 해제
        } catch (error) {
            console.log(error);
        }
    });
});

function sendAll(msg) {
    for (let i = 0; i < CLIENTS.length; i++) {
        CLIENTS[i].send(msg);
    }
}

wss.on('listening', () => {
    console.log("Listening...");
});
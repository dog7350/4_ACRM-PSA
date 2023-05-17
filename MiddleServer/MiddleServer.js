/* MiddleServer */
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./Env/db');

const app = express();

setInterval(async ()=>{
    try{
        await DB.query('SELECT 1 FROM userinfo;');
    }
    catch(error){
        console.log(error);
    }
}, 1000);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());

app.use(require('./Request/middleServer'));

app.listen(8800, '0.0.0.0', ()=>{
    console.log('Middle Server Start');
});
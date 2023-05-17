// Unity Middle Server 추가 //
const express = require('express');
const { toInteger } = require('lodash');
const router = express.Router();
const DBPool = require('../Env/db');

router.use(function(req, res, next){
    var tempIp = req.headers['x-forwarded-for'] || req.ip;
    
    if(req.url !== '/checkToken' && req.url !== '/info/base' && !/^\/images\/board/.test(req.url))
    console.log(req.protocol, req.headers['x-forwarded-for'] || req.ip, req.method, req.url);

    next();
});

router.post('/loginchack', async (req, res) => {
    let result1, field1, result2, field2, dbresult;

    try {
        [result1, field1] = await DBPool.query("SELECT * FROM userinfo WHERE id=?", req.body.id);
        [result2, field2] = await DBPool.query("SELECT * FROM gameinfo WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    dbresult = [result1, result2]

    res.send(dbresult);
});

/* InfoList */
router.get('/carInfoList', async (req, res) => {
    let dbresult, dbfield;

    try{
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM carinfo");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.get('/gunInfoList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM guninfo");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.get('/trackInfoList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM track");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.get('/enbList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM enb");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});

/* UserItemList */
router.post('/useCarList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM usecar WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/useGunList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM usegun WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});

/* Connected */
router.post('/userConnected', async (req, res) => {
    try {
        await DBPool.query("UPDATE gameinfo SET connect='o' WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }
});
router.post('/userDisconnected', async (req, res) => {
    try {
        await DBPool.query("UPDATE gameinfo SET connect='x' WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }
});
router.post('/userLRChange', async (req, res) => {
    let sqlItem = [req.body.loc, req.body.id];

    try {
        await DBPool.query("UPDATE gameinfo SET room=? WHERE id=?", sqlItem);
    } catch(error) {
        console.log(error);
    }
});

/* UserList */
router.post('/friendList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT g.id, usecar, usegun, connect FROM gameinfo g, friend f WHERE f.id=? AND g.id=f.friend", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.get('/lobbyUserList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM gameinfo WHERE connect='o'");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});

/* Friend */
router.post('/friendAdd', async (req, res) => {
    let sqlItem = [req.body.id, req.body.fid];
    try {
        await DBPool.query("INSERT INTO friend VALUES(?, ?)", sqlItem);
    } catch(error) {
        console.log(error);
    }
});
router.post('/friendSub', async (req, res) => {
    let sqlItem = [req.body.id, req.body.fid];
    try {
        await DBPool.query("DELETE FROM friend WHERE id=? AND friend=?", sqlItem);
    } catch(error) {
        console.log(error);
    }
});

/* Item */
router.post('/itemBuyCar', async (req, res) => {
    let sqlItem = [req.body.id, req.body.item];
    let price = parseInt(req.body.price);
    let sqlUpt = [price, req.body.id];
    let sql;
    let dbresult, dbfield;

    if (req.body.CnM == "cash") sql = "UPDATE userinfo SET cash=? WHERE id=?";
    else sql = "UPDATE userinfo SET money=? WHERE id=?";

    try {
        await DBPool.query(sql, sqlUpt);
        await DBPool.query("INSERT INTO usecar VALUES(?, ?)", sqlItem);
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM userinfo WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/itemBuyGun', async (req, res) => {
    let sqlItem = [req.body.id, req.body.item];
    let price = parseInt(req.body.price);
    let sqlUpt = [price, req.body.id];
    let sql;
    let dbresult, dbfield;

    if (req.body.CnM == "cash") sql = "UPDATE userinfo SET cash=? WHERE id=?";
    else sql = "UPDATE userinfo SET money=? WHERE id=?";

    try {
        await DBPool.query(sql, sqlUpt);
        await DBPool.query("INSERT INTO usegun VALUES(?, ?)", sqlItem);
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM userinfo WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/usingItem', async (req, res) => {
    let sqlItem = [req.body.usecar, req.body.usegun, req.body.id];

    try {
        await DBPool.query("UPDATE gameinfo SET usecar=?, usegun=? WHERE id=?", sqlItem);
    } catch(error) {
        console.log(error);
    }
});

/* History */
router.post('/historyList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT g.id, g.usecar, g.usegun, h.matchDate, h.result, h.resultcar, h.resultgun FROM gameinfo g, matchhistory h WHERE g.id=? AND g.id=h.id", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/resultInsert', async (req, res) => {
    let userSqlItem = [req.body.money, req.body.id];
    let histSqlItem = [req.body.id, req.body.result, req.body.resultCar, req.body.resultGun];

    try {
        await DBPool.query("INSERT INTO matchhistory VALUES(now(), ?, ?, ?, ?)", histSqlItem);
        await DBPool.query("UPDATE userinfo SET money=? WHERE id=?", userSqlItem);
    } catch(error) {
        console.log(error);
    }
});

/* Whispering */
router.post('/whisperingConnect', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT connect FROM gameinfo WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});

/* Invitation */
router.get('/invitationUserList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT id, usecar, usegun FROM gameinfo WHERE invitf='t' AND connect='o' AND room='x'");
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/invitationFriendList', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT g.id, g.usecar, g.usegun FROM gameinfo g, friend f WHERE f.id=? AND g.id=f.friend AND g.room='x' AND g.connect='o'", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/invitationAdd', async (req, res) => {
    let sqlItem = [req.body.id, req.body.inviId, req.body.room];

    try {
        await DBPool.query("INSERT INTO inviinfo VALUES(?, ?, ?, now())", sqlItem);
    } catch(error) {
        console.log(error);
    }
});
router.post('/invitationRefusal', async (req, res) => {
    let sqlItem = [req.body.id, req.body.inviId];
    try {
        [dbresult, dbfield] = await DBPool.query("DELETE FROM inviinfo WHERE id=? AND invitation=?", sqlItem);
    } catch(error) {
        console.log(error);
    }
});
router.post('/invitationReset', async (req, res) => {
    let sqlItem = [req.body.id, req.body.id];
    try {
        [dbresult, dbfield] = await DBPool.query("DELETE FROM inviinfo WHERE id=? OR invitation=?", sqlItem);
    } catch(error) {
        console.log(error);
    }
});
router.post('/invitationSelect', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM inviinfo WHERE id=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});
router.post('/invitationMe', async (req, res) => {
    let dbresult, dbfield;

    try {
        [dbresult, dbfield] = await DBPool.query("SELECT * FROM inviinfo WHERE invitation=?", req.body.id);
    } catch(error) {
        console.log(error);
    }

    res.send(dbresult);
});

module.exports = router;
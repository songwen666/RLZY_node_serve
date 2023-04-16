var express = require('express');
var router = express.Router();

const apiattendence = require('../api_help/att.js')

// get
router.get('/list', apiattendence.getattendence)
// 获取自己的打卡信息
router.get('/list/:id', apiattendence.getAttendenceByid)
// 获取自己今天是否打卡了
router.get('/clocklist', apiattendence.getattendenceByid)

router.post('/clocklist', apiattendence.postattendence)

// 获取自己打卡信息
router.get('/myself/:id', apiattendence.getmyselfattendence)
router.post('/batch', apiattendence.postattendencebatch)
module.exports = router;
const db = require('../../db/sql');
const sd = require('silly-datetime');
const timeset = require('../../middlewares/time')
const { v4: uuidv4 } = require('uuid');
// 获取审批列表
exports.getapprovals = (req, res) => { 
    var total
    db.query('select count(id) as count from approvals_thing', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total = arr[0].count
        return;
    })
    const sql='SELECT * from approvals_thing'
    db.query(sql, function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
          }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            // console.log('sss',val);
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts,
                "total":total
            },
            "message": "获取审批数据成功"
        })
    })
}
exports.getapprovalsHistory = (req, res) => { 
    var total
    db.query('select count(id) as count from approvals_thing_history', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total = arr[0].count
        return;
    })
    const sql='SELECT * from approvals_thing_history'
    db.query(sql, function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
          }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            // console.log('sss',val);
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts,
                "total":total
            },
            "message": "获取审批数据成功"
        })
    }) 
}
// 获取审批列表 by id 
exports.getapprovalsByID = (req, res) => { 
    var total
    db.query('select count(id) as count from approvals_thing where id=?',req.params.id, (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        total = arr[0].count
        return;
    })
    db.query('select  username,mobile,creationTime,reason,type,status from approvals_thing where id=?', req.params.id, function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
        }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts,
                "total":total
            },
            "message": "获取个人审批数据成功"
        })
    })
}
// 获取所有审批列表 by id 
exports.getapprovalsAllPendByID = (req, res) => { 
    var total
    db.query('select count(id) as count from approvals_thing where  status=1 ', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        total = arr[0].count
        return;
    })
    db.query('select  app_id,username,mobile,creationTime,reason,type,status  from approvals_thing where  status=1',  function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
        }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts,
                "total":total
            },
            "message": "获取个人审批数据成功"
        })
    })
}
// 获取审批列表 by id 
exports.getapprovalsPendByID = (req, res) => { 
    var total
    db.query('select count(id) as count from approvals_thing where id=? AND status=2 ',req.params.id, (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        total = arr[0].count
        return;
    })
    db.query('select  username,mobile,creationTime,reason,type,status  from approvals_thing where id=? AND status=2', req.params.id, function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
        }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts,
                "total":total
            },
            "message": "获取个人审批数据成功"
        })
    })
}
// 增加 待审批信息
exports.postapprovals = (req, res) => {
    let approvals = req.body
    db.query('select id,mobile from sys_user where username =?', approvals.username,function(err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
        }
        var arr = JSON.parse(JSON.stringify(data))
        console.log('sda',arr[0]);
        approvals.id = arr[0].id
        approvals.mobile = arr[0].mobile
        approvals.creationTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        if (req.body.beginTime!=="") {
            approvals.beginTime = timeset(req.body.beginTime)
        } else {
            approvals.beginTime =sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        }
        
        approvals.endTime = timeset(req.body.endTime)

    console.log('??????', approvals);
   

    sql = 'insert into approvals_thing set ?'
     db.query(
         sql,
         {
            id:approvals.id,
            username:approvals.username,
            mobile:approvals.mobile,
            creationTime:approvals.creationTime,
            beginTime:approvals.beginTime,
            endTime:approvals.endTime,
            reason:approvals.reason,
            type:approvals.type,
            status:1,
         }, function (err, data) {
         if(err){
             res.json({
                 "success": false,
                 "code": 10000,
                 "data": "null",
                 "message": "数据错误",
               "err":err
             })
             console.log(err);
             return;
         }
         res.json({
             "success": true,
             "code": 10000,
             "data":
             {
                "correctionTime":approvals.correctionTime,
                "username":approvals.username,
                "moblie":approvals.moblie,
                "creationTime":approvals.creationTime,
                "beginTime":approvals.beginTime,
                "endTime":approvals.endTime,
                "reason":approvals.reason,
                "type":approvals.type,
                "status":approvals.status,
             },
             "message": "部门新增成功"
         })
     })
    })

    
}

exports.putapprovals = (req, res) => { 
    sql = 'update approvals_thing set status=? where app_id=?'
    console.log(req.body.status,req.body.app_id);
    db.query(sql,[req.body.status,req.body.app_id],function (err,results){
        if (err) return res.status(400).json(err)
        if (results.affectedRows !== 1) return res.status(400).json('编辑失败')
        res.json({
            "success": true,
            "code": 10000,
            "data":null,
            "message": "修改信息成功"
        })
    })
}
// 删除待审批信息
exports.delapprovals = (req, res) => {
    res.json({
        "8":"8"
    })

}
// exports.

const db = require('../../db/sql');
const sd = require('silly-datetime');
const timeset=require('../../middlewares/time')
const { v4: uuidv4 } = require('uuid');

exports.getattendence = (req, res) => { 
    var total
    db.query('select count(id) as count from atte_attendance', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total=arr[0].count
    })
    const sql = 'select * from atte_attendance LIMIT ?,?'
    db.query(sql, [req.query.size*Math.ceil(req.query.page-1),Number(req.query.size)], (err, data) => {
        if (err) {
            res.json({
                code: '10001',
                msg: '查找失败~~',
                data: err
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
            "data": {
                "rows": depts,
               "total":total
            },
            "message": "获取考勤数据成功"
        })
    })
}

exports.getAttendenceByid = (req, res) => { 
    const sql='SELECT day,adt_statu from atte_attendance where user_id=?'
    db.query(sql,req.params.id ,function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '查找失败~~',
              data: null
            })
            return;
          }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            // console.log('sss',val);
            depts.push(val);
        })
    //    console.log(arr)
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "depts":depts
            },
            "message": "获取考勤数据成功"
        })
    }) 
}
// 打卡机会
exports.getattendenceByid = (req, res) => { 
    console.log('#$%',req.query.id,req.query.day);
    const sql='SELECT count(*) as count from atte_attendance where user_id=? and day=?'
    db.query(sql,[req.query.id,req.query.day] ,function (err, data) {
        if(err){
            res.json({
              code: '1001',
              msg: '查找失败~~',
              data: null
            })
            return;
        }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        console.log(arr[0].count);
        if(arr[0].count){
            res.json({
                "success":true,
                "code": 10001,
                "data":1,
                "message":"已经打卡了"
            })
        } else {
            console.log('???');
            res.json({
                "success":true,
                "code":10000,
                "data":0,
                "message":"还未打卡了"
            })
        }
    })
}
exports.postattendence = (req, res) => {
    
    let user = req.body
    db.query('select username,departmentName,mobile from sys_user where id =?',req.body.id,function(err, data) {
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
        user.id =req.body.id
        user.mobile = arr[0].mobile
        user.username = arr[0].username
        user.departmentName= arr[0].departmentName
        user.adt_statu=req.body.adt_statu
        user.job_statu=req.body.job_statu
        user.adt_in_time=req.body.adt_in_time
        user.day = req.body.day
        
    sql = 'insert into atte_attendance set ?'
     db.query(
         sql,
         {
            user_id:req.body.id,
            username:user.username,
            mobile:user.mobile,
            departmentName:user.departmentName,
            adt_statu:req.body.adt_statu,
            job_statu:req.body.job_statu,
            adt_in_time:req.body.adt_in_time,
            day:req.body.day,
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
                "jkl":"jkl"
             },
             "message": "打卡成功"
         })
     })
    })
}

// 获取所有人打卡信息
exports.getmyselfattendence = (req, res) => {
    const sql='SELECT adt_statu,job_statu,adt_in_time,username,mobile,departmentName,day from atte_attendance where user_id=?'
    db.query(sql, req.params.id ,function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '查找失败~~',
              data: err
            })
            return;
        }
        const depts = [];
        var arr = JSON.parse(JSON.stringify(data))
        arr.forEach(val => {
            console.log('sss',val);
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
				"depts":depts
            },
            "message": "获取考勤数据成功"
        })
    })
}
// 批量上传
exports.postattendencebatch = (req, res) => { 
    const users = req.body
    let data = [];
    for (let i in users) {
        data.push([
            users[i].user_id,
            users[i].mobile,
            users[i].username,
            users[i].departmentName,
            users[i].day,
            users[i].adt_in_time,
            users[i].adt_statu,
            users[i].job_statu,
            ]
        )
    }
    sql='insert into atte_attendance(user_id,mobile,username,departmentName,day,adt_in_time,adt_statu,job_statu) values ?'
    db.query(sql,[data], function (err, data) {
        if (err) {
            console.log(err);
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误",
                "err":err
            })
            return;
        }
        res.json({
            "success": true,
            "code": 10000,
            "data":{},
            "message": "批量上传考勤数据成功"
        })
    })
}
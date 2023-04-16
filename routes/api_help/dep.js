const db = require('../../db/sql');
const sd = require('silly-datetime');
const { v4: uuidv4 } = require('uuid');
exports.getdepartment = (req, res) => {
    const sql='SELECT * from company_department'
    db.query(sql, function (err, data) {
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
        arr.forEach(val => {
            // console.log('sss',val);
            depts.push(val);
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "companyId": "1",
                "companyName": "万一教育",
                "depts":depts,
            },
            "message": "获取组织架构数据成功"
        })
    })
}
exports.getdepartmentByID = (req, res) => {
    const sql = 'select * from company_department  where id = ?'
    db.query(sql, [req.params.id], (err, data) => {
        if(err){
            res.json({
              code: '1001',
              msg: '查找失败~~',
              data: null
            })
            return;
          } 
        var arr = JSON.parse(JSON.stringify(data))
        res.json({
            "success": true,
            "code": 10000,
            "data": {
                "code":arr[0].code,
                "createTime":arr[0].create_time,
                "id":arr[0].id,
                "introduce":arr[0].introduce,
                "manager":arr[0].manager,
                "name":arr[0].name,
                "pid":arr[0].pid
            },
            "message": "查询部门详情成功"
        })
    })
}
// put
exports.updepartment = (req, res) => {
    const fields = {}
    if (req.body.name) fields.name = req.body.name
    if(req.body.code) fields.code = req.body.code
    if(req.body.pid) fields.pid = req.body.pid
    if (req.body.manager) fields.manager = req.body.manager
    if (req.body.create_time) fields.create_time = req.body.create_time
    if(req.body.introduce) fields.introduce = req.body.introduce
   console.log( fields);
    const sql = 'update company_department set  name=?,manager=?,introduce=?,code=? where id = ?'
    db.query(sql, [fields.name, fields.manager,fields.introduce,fields.code, req.params.id], (err, results) => {
        if (err) return res.status(400).json(err)
        if (results.affectedRows !== 1) return res.status(400).json('编辑失败')
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "companyId": "1",
                "companyName": "万一教育",
                "depts":fields,
            },
            "message": "更新部门详情成功"
        })
    })
}

// 删除
exports.deledepartment = (req, res) => {
    console.log(req.params.id);
    const sql = 'delete from company_department where id = ?'
    db.query(sql, req.params.id, (err, data) => {
        if (err) return res.status(400).json(err)
        if (data.affectedRows !== 1) return res.status(400).json({
        "success": false,
        "code": 10002,
        "data":null,
        "message": "删除失败"
        })

        res.json({
        "success": true,
        "code": 10000,
        "data":null,
        "message": "删除成功"})
    })
    
}
// 添加
exports.adddepartment = (req, res) => {
    const dep = req.body 
    const uuid = uuidv4().split('-').join("")
    const id = uuid.split(/[a-zA-z]/).join("").slice(1,6)
    // console.log(id);
    const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    // console.log(time);
    sql='insert into company_department set ?'
    db.query(
        sql,
        {
            code: dep.code,
            create_time: time,
            introduce: dep.introduce,
            manager: dep.manager,
            name: dep.name,
            pid: dep.pid,
            id: id,
            companyName:"万一教育",
            company_id:1
        }, function (err, data) {
        if(err){
            res.json({
                "success": false,
                "code": 10000,
                "data": "null",
                "message": "数据错误"
            //   err:err
            })
            return;
        }
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "code": dep.code,
                "createTime":time,
                "introduce": dep.introduce,
                "manager": dep.manager,
                "name": dep.name,
                "pid": dep.pid,
            },
            "message": "部门新增成功"
        })
    })
}
// 通过公司ID获取公司信息
exports.getcompanyByID = (req, res) => {
    const sql = 'select * from sys_company  where companyID = ?'
    db.query(sql, [req.params.id], (err, data) => {
        if(err){
            res.json({
              code: '1001',
              msg: '查找失败~~',
              data: err
            })
            return;
          }
        var arr = JSON.parse(JSON.stringify(data))
        res.json({
            "success": true,
            "code": 10000,
            "data": {
                "name": arr[0].companyName,
                "companyAddress": arr[0].address,
                "mailbox": arr[0].mailbox,
                "remarks":arr[0].remarks
            },
            "message": "获取基本信息成功"
        })
    })
}

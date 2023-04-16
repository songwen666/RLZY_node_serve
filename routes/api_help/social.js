const db = require('../../db/sql');
const sd = require('silly-datetime');
const { v4: uuidv4 } = require('uuid');
exports.getsocial = (req, res) => {
    var total
    db.query('select count(id) as count from b_securitys_detail', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total=arr[0].count
    })
    const sql='SELECT * from b_securitys_detail'
    db.query(sql, function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '读取失败~~',
              data: err
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
                "depts": depts,
                "total":total
            },
            "message": "获取社保信息成功"
        })
    })
}
exports.getsocialbyid = (req, res) => {
    const sql='SELECT * from b_securitys_detail where id= ?'
    db.query(sql,req.params.id, function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '读取失败~~',
              data: err
            })
            return;
          }
        var arr = JSON.parse(JSON.stringify(data))
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "id": arr[0].id,
				"username": arr[0].username,
				"mobile": arr[0].mobile,
				"id_number": arr[0].id_number,
				"opening_bank": arr[0].opening_bank,
				"bank_card_number":arr[0].bank_card_number,
				"department": arr[0].department,
				"provident_fund_city": arr[0].provident_fund_city,
				"participating_in_the_city": arr[0].participating_in_the_city,
				"social_security_base": arr[0].social_security_base,
				"provident_fund_base": arr[0].provident_fund_base,
				"qe_social_security_base": arr[0].qe_social_security_base,
				"qe_provident_fund_base": arr[0].qe_provident_fund_base,
				"person_salays": arr[0].person_salays,
				"person_fund": arr[0].person_fund
            },
            "message": "获取薪资信息成功"
        })
    })
}

exports.putsocial = (req, res) => { 
    console.log(req.body);
    const salays = {} 
    if (req.body.mobile) salays.mobile =req.body.mobile 
    if (req.body.id_number) salays.id_number =req.body.id_number
    if (req.body.username) salays.username =req.body.username
    if (req.body.social_security_base) salays.social_security_base =Number(req.body.social_security_base) 
    if (req.body.provident_fund_base) salays.provident_fund_base = Number(req.body.provident_fund_base) 
    if (req.body.qe_social_security_base) salays.qe_social_security_base = Number(req.body.qe_social_security_base) 
    if (req.body.qe_provident_fund_base) salays.qe_provident_fund_base = Number(req.body.qe_provident_fund_base) 
    if (req.body.person_salays) salays.person_salays = Number(req.body.person_salays) 
    if(req.body.person_fund) salays.person_fund =Number(req.body.person_fund) 
    const sql = 'update b_securitys_detail  set mobile=?,id_number=?,username=?, social_security_base=?, provident_fund_base=?,qe_social_security_base=?,qe_provident_fund_base=?,person_salays=?,person_fund=? where id = ?'
    db.query(sql,
        [
            salays.mobile,
            salays.id_number,
            salays.username,
            salays.social_security_base,
            salays.provident_fund_base,
            salays.qe_social_security_base,
            salays.qe_provident_fund_base,
            salays.person_salays,
            salays.person_fund,
            req.body.id
        ],
        (err, results) => {
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
// 批量导入社保
exports.postsocialbatch = (req, res) => {

    const users = req.body
let data = [];
for (let i in users) {
    
    data.push([
        users[i].id,
        users[i].mobile,
        users[i].username,
        users[i].department,
        users[i].id_number,
        users[i].opening_bank,
        users[i].bank_card_number,
        users[i].provident_fund_city,
        users[i].participating_in_the_city,
        Number(users[i].social_security_base),
        Number(users[i].provident_fund_base),
        Number(users[i].qe_social_security_base),
        Number(users[i].qe_provident_fund_base),
        Number(users[i].person_salays),
        Number(users[i].person_fund)
    ]
    )
}
// console.log('?MN',data);


sql='insert into b_securitys_detail(id,mobile,username,department,id_number,opening_bank,bank_card_number,provident_fund_city,participating_in_the_city,social_security_base,provident_fund_base,qe_social_security_base,qe_provident_fund_base,person_salays,person_fund) values ?'
db.query(sql,[data], function (err, data) {
    if (err) {
        console.log(err);
        res.json({
            "success": false,
            "code": 10000,
            "data": "null",
            "message": "数据错误aaa",
            "err":err
        })
        return;
    }
    res.json({
        "success": true,
        "code": 10000,
        "data":null,
        "message": "社保数据新增成功"
    })
})
    
}


exports.getsalarys = (req, res) => {
    var total
    db.query('select count(id) as count from sa_salays', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total=arr[0].count
    })
    const sql='SELECT * from sa_salays'
    db.query(sql, function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '读取失败~~',
              data: err
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
                "depts": depts,
                "total":total
            },
            "message": "获取社保信息成功"
        })
    })
}
exports.getsalarysbyid = (req, res) => {
    // 改这里！！！！！
    const sql='SELECT * from sa_salays where id= ?'
    db.query(sql,req.params.id, function (err, data) {
        if(err){
            res.json({
              code: '10001',
              msg: '读取失败~~',
              data: err
            })
            return;
          }
        var arr = JSON.parse(JSON.stringify(data))
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "id": arr[0].id,
                "username": arr[0].username,
                "mobile": arr[0].mobile,
                "workNumber": arr[0].workNumber,
                "departmentName": arr[0].departmentName,
                "id_number": arr[0].id_number,
                "enableState": arr[0].enableState,
                "formOfEmployment": arr[0].formOfEmployment,
                "base_salary": arr[0].base_salary,
                "allowance_scheme": arr[0].allowance_scheme
            },
            "message": "获取薪资信息成功"
        })
    })
}
exports.putsalarys = (req, res) => { 
    const salays = {} 
    if (req.body.base_salary) salays.base_salary =Number(req.body.base_salary) 
    if(req.body.allowance_scheme) salays.allowance_scheme =Number(req.body.allowance_scheme) 
    const sql = 'update sa_salays  set base_salary=?, allowance_scheme=? where id = ?'
    db.query(sql, [salays.base_salary,salays.allowance_scheme,req.body.id], (err, results) => {
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
// 批量导入薪资
exports.postsalarysbatch = (req, res) => {

const users = req.body
let data = [];
for (let i in users) {
    
    data.push([
        users[i].id,
        users[i].mobile,
        users[i].username,
        users[i].workNumber,
        users[i].departmentName,
        users[i].id_number,
        users[i].enableState,
        users[i].formOfEmployment,
        users[i].base_salary,
        users[i].allowance_scheme
    ]
    )
}
// console.log(data);


sql='insert into sa_salays(id,mobile,username,workNumber,departmentName,id_number,enableState,formOfEmployment,base_salary,allowance_scheme) values ?'
db.query(sql,[data], function (err, data) {
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
    res.json({
        "success": true,
        "code": 10000,
        "data":null,
        "message": "薪资新增成功"
    })
})
    
}


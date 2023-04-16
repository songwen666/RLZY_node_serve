const db = require('../../db/sql');
const timeset=require('../../middlewares/time')
const jwt = require('jsonwebtoken')
const sd = require('silly-datetime');
const { v4: uuidv4 } = require('uuid');
// var password = 123456;
// var mobile = 13800000002;

// 登录
exports.syslogin = (req, res) => {
    const userinfo = req.body
    if (res.err) {
        return res.status(500).json({
            "success": false,
            "code": 10000,
            "data": err,
            "message": "用户名或密码错误"
        })
    }
    const sql = 'select * from sys_user where mobile =? and password=?'
    db.query(sql, [userinfo.mobile, userinfo.password], function (err, data,) {
    // console.log('data.length',data.length); 
    const user={
        mobile: data[0].mobile,
        password: data[0].password,
    }
    const tokenStr = jwt.sign(user,'songwen',{ expiresIn: 70*60*12 })
        
        res.json({
        "success": true,
        "code": 10000,
        "data": `${tokenStr }`,
        "message": "登录成功",
        })
    });

}
// 查询用户基本信息
exports.sysprofile = (req, res) => {
// 解析token 中携带的 电话号码
    const token = req.get('Authorization').slice(7);
    
    var user_token_info
    jwt.verify(token, 'songwen', (err, data) => {
        if (err) {
            console.log(err);
            return res.json({
              code: '2004',
              msg: 'token 校验失败~~',
              data: null
            })
        }
        user_token_info=data
    })
    // 通过电话号码查询 id name
    const iphone = user_token_info.mobile;
    const sql='SELECT id,username from sys_user where mobile=?'
    db.query(sql, [iphone], function (err, data) {
        if (err) return res.status(400).json(err)
    // 获取id name
        const id = data[0].id
        const username=data[0].username
    const sql1 = 'SELECT sys_permission.code FROM (((sys_permission JOIN sys_seting_permission on sys_permission.id =sys_seting_permission.permission_id) JOIN sys_setting on sys_seting_permission.role_id=sys_setting.id ) JOIN sys_seting_user_role on sys_setting.id =sys_seting_user_role.role_id ) JOIN sys_user on sys_seting_user_role.user_id = sys_user.id WHERE  sys_user.id=? and sys_permission.type=1'
    // 嵌套查找 权限
    db.query(sql1, [id], function (err, data) { 
        if (err) return res.status(400).json(err)
        var arr = JSON.parse(JSON.stringify(data))

        const menus = [];
        const points = [];

        for (let i = 0; i < arr.length; i++){
            // console.log('?1',arr[i].code);
            menus.push(arr[i].code);
        }
        const menus_s=Array.from(new Set(menus))
        console.log('menus_s',menus_s);
        // 获取按钮的权限;
        const sql2 = 'SELECT sys_permission.code FROM (((sys_permission JOIN sys_seting_permission on sys_permission.id =sys_seting_permission.permission_id) JOIN sys_setting on sys_seting_permission.role_id=sys_setting.id ) JOIN sys_seting_user_role on sys_setting.id =sys_seting_user_role.role_id ) JOIN sys_user on sys_seting_user_role.user_id = sys_user.id WHERE  sys_user.id=? and sys_permission.type=2'    
        db.query(sql2, [id], function (err, data) { 
            if (err) return res.status(400).json(err)
            var arr = JSON.parse(JSON.stringify(data)) 
            for (let i = 0; i < arr.length; i++){
                // console.log('?2',arr[i].code);
                points.push(arr[i].code);
            }
            res.json({
                "success": true,
                "code": 10000,
                "data": {
                    "userId":id,
                    "mobile":  iphone,
                    "username":username,
                    "roles": {
                        "menus": menus_s,
                        "points":points ,
                    },
                    "companyId": "1",
                    "company": "传智播客"
                },
                "message": "获取资料成功"
            })
        })
        
    })
    })
    
            
        
}
// 获取头像
exports.sysuser = (req, res) => {
    // res.send('getArtcateById')
    console.log(req.params.id);
    var roleIds = [];
    const sql = 'SELECT * from sys_user where id=?'
    const sql1 = 'select role_id from sys_seting_user_role where user_id=?'
    db.query(sql1, [req.params.id], function (err, data) {
        if (err) {
            res.json({
                code: '1001',
                msg: '查找失败~~',
                data: err
            })
            return;
        }
        var arr = JSON.parse(JSON.stringify(data))
       
        arr.forEach(val => {
            roleIds.push(val.role_id)
        })
        // console.log('获取头像@@2',roleIds );
    })
    db.query(sql, [req.params.id], function (err, data) { 
        // console.log(data);
        var arr = JSON.parse(JSON.stringify(data))
        // console.log('获取头像', arr[0]);
        
        res.json({
            "success": true,
            "code": 10000,
            "data":
            {
                "companyId": "1",
                "company":"万一教育",
                "creationTime": arr[0].creationTime,
                "departmentName":arr[0].departmentName,
                "enableState": arr[0].enableState,
                "formOfEmployment":arr[0].formOfEmployment,
                "id": arr[0].id,
                "mobile": arr[0].mobile,
                "password": arr[0].password,
                "staffPhoto": arr[0].staffPhoto,
                "workNumber": arr[0].workNumber,
                "timeOfEntry": arr[0].timeofEntry,
                "username": arr[0].username,
                "roleIds":roleIds
            },
            "message": "获取基本信息成功"
        })
    })
    
}

// 获取负责人信息
exports.sysgetleader = (req, res) => {
    const sql='SELECT id,manager from company_department'
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
            depts.push({id:val.id,username:val.manager});
        })
        res.json({
            "success": true,
            "code": 10000,
            "data":depts,
            "message": "获取组织架构数据成功"
        })
    })
}

// 获取员工列表
exports.sysuserss = (req, res) => {
    var total
    db.query('select count(id) as count from sys_user', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total=arr[0].count
    })
 
    const sql = 'select * from sys_user LIMIT ?,?'

    db.query(sql, [req.query.size*Math.ceil(req.query.page-1),Number(req.query.size)], (err, data) => {
        if (err) {
            res.json({
                code: '1001',
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
            "message": "获取员工信息成功"
        })
    })
}
// 添加员工
exports.sysuseradd = (req, res) => {
    //  需要去重- 然后转换成字符串
    const uuid = uuidv4().split('-').join("")
    // console.log(uuid);
    const password = uuid.split(/\d+/).reverse().join("")
    // console.log(password);
    const user = req.body 
    const correctionTime=timeset(req.body.correctionTime)
    const timeOfEntry=timeset(req.body.timeOfEntry)
    const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    // console.log(time);
    sql='insert into sys_user set ?'
    db.query(
        sql,
        {
            correctionTime:correctionTime,
            departmentName:user.departmentName,
            enableState:1,
            formOfEmployment:user.formOfEmployment,
            id:uuid,
            mobile:user.mobile,
            password:password,
            timeOfEntry:timeOfEntry,
            username:user.username,
            workNumber:user.workNumber,
        }, function (err, data) {
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
            "data":
            {
                "correctionTime":user.correctionTime,
                "departmentName":user.correctionTime,
                "enableState":1,
                "formOfEmployment":user.formOfEmployment,
                "id":uuid,
                "mobile":user.mobile,
                "password":password,
                "timeOfEntry":user.timeOfEntry,
                "username":user.username,
                "workNumber":user.workNumber,
            },
            "message": "部门新增成功"
        })
    })
}
// 删除员工
exports.sysuserdel = (req, res) => {
    // console.log(req.params.id);
    const sql = 'delete from sys_user where id = ?'
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
// 保存员工信息
exports.sysuserput = (req, res) => { 
    const user = {}
    if (req.body.password) user.password=req.body.password
    if (req.body.username) user.username = req.body.username
    if (req.body.workNumber) user.workNumber = req.body.workNumber
    if (req.body.mobile) user.mobile = req.body.mobile
    if (req.body.timeOfEntry) user.timeOfEntry = timeset(req.body.timeOfEntry)
    if (req.body.staffPhoto) user.staffPhoto  =req.body.staffPhoto  
    if (req.body.departmentName) user.departmentName = req.body.departmentName
    //    
    const sql = 'update sys_user  set password=?,username=?, departmentName=?,workNumber=?,mobile=?,timeOfEntry=?,staffPhoto =? where id = ?'
    db.query(sql, [
        user.password,user.username, user.departmentName, user.workNumber,
        user.mobile, user.timeOfEntry,user.staffPhoto ,req.params.id
    ],
        (err, results) => {
        if (err) return res.status(400).json(err)
        if (results.affectedRows !== 1) return res.status(400).json('编辑失败')
        res.json({
            "success": true,
            "code": 10000,
            "data":null,
            "message": "修改员工信息成功"
        })
    })
}
// 给员工分角色 有bug 响应了3次
exports.syssRoles = (req, res) => { 
    console.log(req.body.roleIds);
    var user_role = []
    var arr_roleIds=[]
    arr_roleIds=req.body.roleIds
    
    for (let i = 0; i <arr_roleIds.length; i++){
        user_role.push([arr_roleIds[i],req.body.id])
    }
    console.log('zhe' ,user_role);
    
    // // 1 是否有  有的话 做对比 
    const sql1 = 'select count(*) as count from sys_seting_user_role where user_id=?'
    const sql2 = 'insert into sys_seting_user_role(role_id, user_id) values ? on duplicate key update role_id = values(role_id)'
    const sql3 = 'delete from sys_seting_user_role where user_id =?'
    // 如果角色给的是空的直接全部删除
    if (user_role.length === 0) {
        db.query(sql3, req.body.id, (err, data) => {
            if (err) return res.status(400).json(err)
            res.json({
                "success": true,
                "code": 10000,
                "data":null,
                "message": "给员工分配角色成功"
            }
            )
        })
        return;
    }
    db.query(sql1, req.body.id, (err, data) => {
        var arr = JSON.parse(JSON.stringify(data))
        console.log(arr[0].count);
        if (!arr[0].count) {
            // 如果数据库没有 就批量增加
            console.log("从零开始批量加");
            db.query(sql2, [user_role], (err, data) => {
                console.log('zj');
                if (err) return res.status(400).json(err)
                res.json({
                "success": true,
                "code": 10000,
                "data":null,
                "message": "给员工分配角色成功"
                }
                )
            })
            return;
        }
        // 先把原来的删除再 进行添加
        db.query(sql3, req.body.id, (err, data) => { 
            console.log('开始删除');
            db.query(sql2, [user_role], (err, data) => {
                console.log('开始增加');
                if (err) return res.status(400).json(err)
                res.json({
                    "success": true,
                    "code": 10000,
                    "data":null,
                    "message": "给员工分配角色成功"
                }
                )
            })
        })
    }) 
}


// 批量增加 可以
    // const sql3 = 'insert into sys_seting_user_role(role_id,user_id) values ?'
    //     db.query(sql3, [user_role], (err, data) => {
    //         console.log('zj');
    //         if (err) return res.status(400).json(err)
    //         res.json("成功!")
    //     })
// 批量导入员工信息
exports.sysbatch = (req, res) => {

    const uuid = uuidv4().split('-').join("")
    const pass = uuid.split(/\d+/).reverse().join("")
    const users = req.body
   
    
    let data = [];
    for (let i in users) {
        console.log('&&&', users[i]);
        let num= Math.ceil(Math.random()*100)
        let id = uuid.substring(0, 9) + num.toString().substring(0, 6)
        let password = pass+ num.toString().substring(0, 6)
        console.log('id',id);
        data.push([id,password,users[i].mobile,users[i].username,users[i].timeOfEntry,users[i].correctionTime,users[i].workNumber,users[i].departmentName])
    }
    console.log(data);
   
    
    sql='insert into sys_user(id,password,mobile,username,timeOfEntry,correctionTime,workNumber,departmentName) values ?'
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
            "message": "部门新增成功"
        })
    })
}




// 角色

// get获取角色
exports.sysroleget = (req, res) => {
    // 获取所有数据的总数
    var total
    db.query('select count(id) as count from sys_setting', (err, data) => {
        let arr = JSON.parse(JSON.stringify(data))
        console.log('qwer', arr[0].count);
        total=arr[0].count
    })

    const sql = 'select * from sys_setting LIMIT ?,?'
    console.log(req.query.pageSize*Math.ceil(req.query.page-1));
    db.query(sql, [req.query.pageSize*Math.ceil(req.query.page-1),Number(req.query.pageSize)], (err, data) => {
        if (err) {
            res.json({
                code: '1001',
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
               "total": total
            },
            "message": "获取基本信息成功"
        })
    })
}
// get by id
exports.sysrolegetByID = (req, res) => {
    const permIds=[]
    db.query('select * from sys_seting_permission where role_id=?', req.params.id, (err, data) => { 
        
        var arr_permIds = JSON.parse(JSON.stringify(data))
        arr_permIds.forEach(val => {
            permIds.push(val. permission_id)
        })
        console.log(permIds);
    })
    const sql = 'select id,name, description from sys_setting where id=?'
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
            "data":{
                "companyId": "1",
                "description": arr[0].description,
                "id":arr[0].id,
                "name":arr[0].name,
               "permIds":permIds
            },
            "message": "获取基本信息成功"
        })
    })
}
// 更新id
exports.sysroleputByID = (req, res) => { 
    const role = {}
    if (req.body.name) role.name = req.body.name
    if(req.body.description) role.description = req.body.description
    
    const sql = 'update sys_setting  set name=?, description=? where id = ?'
    db.query(sql, [role.name,role.description,req.params.id], (err, results) => {
        if (err) return res.status(400).json(err)
        if (results.affectedRows !== 1) return res.status(400).json('编辑失败')
        res.json({
            "success": true,
            "code": 10000,
            "data":null,
            "message": "修改角色信息成功"
        })
    })
}
// 新增角色
exports.sysroleadd = (req, res) => {
    const role = req.body
    const uuid = uuidv4().split('-').join("")
    console.log(role);
    sql='insert into sys_setting set ?'
    db.query(
        sql,
        {   
            id:uuid,
            description: role.description,
            name: role.name,
            company_id:1
        }, function (err, data) {
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
            "data":
            {
                "name": role.name,
                "description": role.description,  
            },
            "message": "部门新增成功"
        })
    })
}
// 删除角色
exports.sysroledel = (req, res) => { 
    const sql = 'delete from sys_setting where id = ?'
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
// 给角色分配权限
exports.sysroleass = (req, res) => {
    console.log(req.body.permIds);
    var user_perm = []
    var arr_permIds=[]
    arr_permIds=req.body.permIds
    
    for (let i = 0; i <arr_permIds.length; i++){
        user_perm.push([arr_permIds[i],req.body.id])
    }
    console.log('改的权限', user_perm);
    
    // 数据库处理
    const sql1 = 'select count(*) as count from sys_seting_permission where role_id=?'
    const sql2 = 'insert into sys_seting_permission(permission_id,role_id) values ? on duplicate key update permission_id = values(permission_id)'
    const sql3 = 'delete from sys_seting_permission where role_id =?'
    // 如果权限给的是空的直接全部删除
    if (user_perm.length === 0) {
        db.query(sql3, req.body.id, (err, data) => {
            if (err) return res.status(400).json(err)
            res.json({
                "success": true,
                "code": 10000,
                "data":null,
                "message": "给角色分配权限成功"
            }
            )
        })
        return;
    }
    db.query(sql1, req.body.id, (err, data) => {
        var arr = JSON.parse(JSON.stringify(data))
        console.log(arr[0].count);//3
        if (!arr[0].count) {
            // 如果数据库没有 就批量增加
            console.log("从零开始批量加权限");
            db.query(sql2, [user_perm], (err, data) => {
                console.log('zj');
                if (err) return res.status(400).json(err)
                res.json({
                "success": true,
                "code": 10000,
                "data":null,
                "message": "给角色分配权限成功"
                }
                )
            })
            return;
        }
        // 如果发来空数组？
        // 先把原来的删除再 进行添加
        db.query(sql3, req.body.id, (err, data) => { 
            console.log('开始删除权限');
            db.query(sql2, [user_perm], (err, data) => {
                console.log('开始增加权限');
                if (err) return res.status(400).json(err)
                res.json({
                    "success": true,
                    "code": 10000,
                    "data":null,
                    "message": "给角色分配权限成功"
                }
                )
            })
        })
    })
}

// 权限
// 获取权限列表
exports.sysperget = (req, res) => {
    const sql = 'select * from sys_permission '
    db.query(sql, (err, data) => {
        if (err) {
            res.json({
                code: '1001',
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
            "data": depts,
            "message": "获取基本信息成功"
        })
    })
}
// 新增权限
exports.sysperadd = (req, res) => {
    const per = req.body
    const uuid = uuidv4().split('-').join("")
    sql='insert into sys_permission set ?'
    db.query(
        sql,
        {   
            enVisible: per.enVisible,
            name:per.name,
            code: per.code,
            description: per.description,
            type: per.type,
            pid: per.pid,
            id:uuid
        }, function (err, data) {
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
            "data":
            {
                "enVisible": 1,
                "name":per.name,
                "code": per.code,
                "description": per.description,
                "type": 1,
                "pid":0 
            },
            "message": "权限新增成功"
        })
    })
}

// 更新权限by id
exports.sysperputByID = (req, res) => { 
    const per = {}
    if (req.body.enVisible) per.enVisible=req.body.enVisible
    if (req.body.name) per.name = req.body.name
    if (req.body.code) per.code = req.body.code
    if(req.body.description) per.description = req.body.description
    
    const sql = 'update sys_permission  set name=?,code=?, description=? ,enVisible=? where id = ?'
    db.query(sql, [per.name,per.code,per.description,per.enVisible,req.params.id], (err, results) => {
        if (err) return res.status(400).json(err)
        if (results.affectedRows !== 1) return res.status(400).json('编辑失败')
        res.json({
            "success": true,
            "code": 10000,
            "data":null,
            "message": "修改权限信息成功"
        })
    })
}
// 删除权限
exports.sysperdel = (req, res) => { 
    const sql = 'delete from sys_permission where id = ?'
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
// 获取by id
exports.syspergetByID = (req, res) => { 
    const sql = 'select  *  from sys_permission as a where id=?'
    db.query(sql, [req.params.id], (err, data) => {
        if(err){
            res.json({
              code: '1001',
              msg: '查找失败~~',
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
            "data":{
                "name": arr[0].name,
                "description": arr[0].description,
                "code": arr[0].code,
                "id": arr[0].id,
                "pid": arr[0].pid,
                "type": arr[0].type,
                "enVisible":arr[0].enVisible
            },
            "message": "获取基本信息成功"
        })
    })
}
// exports.sysuser = (req, res) => {
//     res.send('!!!!!');
    
// }
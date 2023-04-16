var express = require('express');
var router = express.Router();

const apisys = require('../api_help/login')
// 登录接口
router.post('/login', apisys.syslogin)
// 获取用户资料
router.post('/profile', apisys.sysprofile)


// `/sys/user/${id}`
router.get('/user/:id', apisys.sysuser)

// '/sys/user/simple' get
router.get('/simple',apisys.sysgetleader)

// 获取员工列表
// '/sys/user',
router.get('/user', apisys.sysuserss)
// 添加员工
// '/sys/user'
router.post('/user', apisys.sysuseradd)

// 删除员工
// `/sys/user/${id}`
router.delete('/user/:id', apisys.sysuserdel)


// 批量导入员工 [{},{},{}]
// '/sys/batch'
router.post('/batch', apisys.sysbatch)

// 保存员工信息
// `/sys/user/${data.id}`
router.put('/user/:id', apisys.sysuserput)

// 为员工分配角色 put
// '/sys/assignRoles'
router.put('/assignRoles',apisys.syssRoles)


// 获取角色
// /sys/role
router.get('/role', apisys.sysroleget)
// 获取某一个角色
router.get('/role/:id', apisys.sysrolegetByID)
// 根据id更新
router.put('/role/:id', apisys.sysroleputByID)
// 新增角色
router.post('/role', apisys.sysroleadd)
// 删除角色
router.delete('/role/:id', apisys.sysroledel)
// 给角色分配权限
// router.put('/role/assignPrem', apisys.sysroleass)
router.put('/assignPrem', apisys.sysroleass)

// 权限
router.get('/permission', apisys.sysperget)

// 新增角色
router.post('/permission', apisys.sysperadd)

// 根据id更新
router.put('/permission/:id', apisys.sysperputByID)
  
// 删除角色
router.delete('/permission/:id', apisys.sysperdel)
// 获取某一个角色权限
router.get('/permission/:id', apisys.syspergetByID)
module.exports = router;
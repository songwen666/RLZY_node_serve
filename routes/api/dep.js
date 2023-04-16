var express = require('express');
var router = express.Router();

const apicompany = require('../api_help/dep.js')
// 部门接口 qu api
// get
router.get('/department', apicompany.getdepartment)
// put
router.put('/department/:id', apicompany.updepartment)

router.delete('/department/:id', apicompany.deledepartment)
// // post
router.post('/department', apicompany.adddepartment)

// get 根据id获得部门信息 实现数据回显
router.get('/department/:id', apicompany.getdepartmentByID)
 
// get 根据id获得公司信息 
router.get('/ss/:id', apicompany.getcompanyByID)

module.exports = router;
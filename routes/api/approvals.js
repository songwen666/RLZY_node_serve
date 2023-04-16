var express = require('express');
var router = express.Router();

const apiapprovals = require('../api_help/approvals.js')

// get
router.get('/list', apiapprovals.getapprovals)
router.get('/history', apiapprovals.getapprovalsHistory)
// get
router.get('/list/:id', apiapprovals.getapprovalsByID)
// 添加待审批信息
router.get('/listAllPend', apiapprovals.getapprovalsAllPendByID)
router.get('/listPend/:id', apiapprovals.getapprovalsPendByID)
// '/sys/user'
router.post('/list', apiapprovals.postapprovals)

// 根据id更新审批信息
router.put('/list', apiapprovals.putapprovals)

// 删除待审批信息
// `/sys/user/${id}`
router.delete('/list/:id', apiapprovals.delapprovals)

module.exports = router;
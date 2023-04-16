var express = require('express');
var router = express.Router();

const apisoc = require('../api_help/social.js')
// 社保
// get
router.get('/security', apisoc.getsocial)
router.get('/security/:id',apisoc.getsocialbyid)
// put
router.put('/security',apisoc.putsocial)
router.post('/security/batch', apisoc.postsocialbatch)
/
// 薪资
router.get('/salarys', apisoc.getsalarys)
router.get('/salarys/:id',apisoc.getsalarysbyid)
router.put('/salarys', apisoc.putsalarys)
// 批量上传员工信息
router.post('/salarys/batch', apisoc.postsalarysbatch)
module.exports = router;
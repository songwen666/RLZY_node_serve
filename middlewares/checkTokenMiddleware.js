//导入 jwt
const jwt = require('jsonwebtoken');

const db = require('../db/sql');
//声明中间件
module.exports = (req, res, next) => {
  //获取 token
  let token = req.get('token');
  //判断
  if (!token) {
    return res.json({
    "message": "您还未登录",
	"success": false,
	"code": 10002,
	"data": null
    })
  }
  //校验 token
  jwt.verify(token, secret, (err, data) => {
    //检测 token 是否正确
    if (err) {
      return res.json({
        "message": "token超时",
        "success": false,
        "code": 10002,
        "data": null
      })
    }
    next();
  });
}
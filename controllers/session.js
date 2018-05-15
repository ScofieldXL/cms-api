const db = require('../models/db.js');
const md5 = require('blueimp-md5');

exports.get = (req,res,next) => {
   //获取当前会话信息;
    const {user} = req.session;//相当于user=req.session.user；
    if (!req.session.user) {
       return res.status(401).json({
           error: 'Unauthorized'
       })
    }
    res.status(200).json(user);
}

exports.create = (req,res,next) => {
   //接受表单数据;
    //操作数据库处理请求;
    //发送响应;
    try {
        const body = req.body;
        body.password = md5(md5(body.password));
        const sqlStr = `SELECT * FROM users WHERE email='${body.email}' and password='${body.password}'`;
        db.query(sqlStr).then(function (result) {
            if(!result[0]) {
                return res.status(404).json({
                    error: 'Invalid email or password!'
                })
            }else {

                //没有问题登录成功;记录session
                req.session.user = result[0];
                //发送响应;
                res.status(201).json(result[0]);
            }
        })
    }catch (err) {
         next(err);
    }
}

//删除登录状态;
exports.delete = (req,res,next) => {
   delete req.session.user;
   res.status(201).json({});
}
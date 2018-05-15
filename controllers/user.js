
const md5 = require('blueimp-md5');
const moment = require('moment');
const db = require('../models/db.js');
// const sqlHelper = require('../utilites/sqlhelper');


exports.list = async (req,res,next) => {
    try {
       const body = req.query;
       const sqlStr = `
       SELECT * FROM users WHERE email='${body.email}' or nickname='${body.nickname}'
       `;
       const ret = await db.query(sqlStr);
       res.status(201).json(ret[0]);
    }catch (err) {
        next(err);
    }
   /* try {
        const andConditionStr = sqlHelper.andCondition(req.query);
        const sqlStr = `SELECT * FROM users WHERE ${andConditionStr}`;
        const ret = await db.query(sqlStr);
        res.status(201).json(ret);

    }catch (err) {
        next(err);
    }*/
}

exports.create = (req,res,next) => {
    //INSERT INTO 'users'(username,password,)
    const body = req.body;
    const sqlStr = `INSERT INTO users(username,password,email,nickname,avatar,gender,create_time,modify_time)
    VALUES(
    '${body.email}',
    '${md5(md5(body.password))}',
    '${body.email}',
    '${body.nickname}',
    'default-avatar.png',
    0,
    '${moment().format('YYYY-MM-DD hh:mm:ss')}',
    '${moment().format('YYYY-MM-DD hh:mm:ss')}'
    )
    `;
  try {
      //向数据库插入数据;
    db.query(sqlStr).then(function(result1){

        //插入完数据，返回刚才的数据;
        db.query(`SELECT * FROM users WHERE id='${result1.insertId}'`).then(function(result2){
            res.status(201).json(result2[0]);
        })

    });
  }catch (err) {
      next(err);
  }

}


exports.update = (req,res,next) => {

}
exports.destroy = (req,res,next) => {

}
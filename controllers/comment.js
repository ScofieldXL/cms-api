const db = require('../models/db.js');

//根据topic_id请求当前文章评论列表;
exports.list = async (req,res,next) => {
    try{
        const {topic_id} = req.query;
        const sqlStr = `SELECT * FROM comments WHERE topic_id=${topic_id}`;
        const comments = await db.query(sqlStr);
        res.status(200).json(comments);
    }catch (err) {
        next(err);
    }
}

exports.create = async (req,res,next) => {
    try {
          const {
              content = '',
              topic_id
          } = req.body;//用户提交的信息;

          //编写sql语句;
          const sqlStr = `
          INSERT INTO comments(content,create_time,modify_time,topic_id,user_id)
          VALUES('${content}',
          '${Date.now()}',
          '${Date.now()}',
           '${topic_id}',
           '${req.session.user.id}')
          `;//细节括号等不要遗漏;
          //插入评论数据;
          const {insertId} = await db.query(sqlStr);//结构赋值,查询完返回的结果是个对象,其中有insertId属性，结构赋值得到其值
          // console.log(insertId);
          //返回刚插入的数据;执行查询的时候返回的是数组;
          const [comment] = await db.query(`SELECT * FROM comments WHERE id=${insertId}`);
          res.status(201).json(comment);
    } catch (err) {
        next(err);
    }

}
exports.update = (req,res,next) => {

}
exports.destroy = (req,res,next) => {

}
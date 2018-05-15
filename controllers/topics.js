
const moment = require('moment');
const db = require('../models/db.js');

//单个话题信息;
exports.single = async (req,res,next) => {
    try {
        const {id} = req.params;//注意和query的区别,这里是传递了参数
        const sqlStr = `
        SELECT * FROM topics WHERE id=${id}
        `;
        const ret = await db.query(sqlStr);
        res.status(200).json(ret[0]);
    }catch (err) {
        next(err);
    }
}

//话题列表;
exports.list = async (req,res,next) => {

    //分页查询;
    let {_page = 1,_limit = 20} = req.query;
    if (_page < 1) {
       _page = 1;
    }
    if (_limit <1 ) {
        _limit = 1;
    }
    if (_limit > 20) {
        _limit = 20;
    }

    //分页开始页码;
    const start = (_page - 1) * _limit;

    //查询所有topics;
    try {
        const sqlStr = `
    SELECT * FROM topics LIMIT ${start},${_limit}
   `;
         const [{count}] = await db.query(`SELECT COUNT(*) as count FROM topics`);
         const topics = await db.query(sqlStr);
         res.status(200).json({
             topics,
             count
         });//这里是查询所有,所以不用result[0]

    }catch(err) {
        next(err);
    }
}

//创建话题;
exports.create = (req,res,next) => {

    try {
        const {user} = req.session;//相当于user=req.session.user；

        //创建话题;
        const body = req.body;//不是nodejs默认的处理方法，需要引入body-parser中间件;
        body.create_time = moment().format('YYYY-MM-DD hh:mm:ss');
        body.modify_time = moment().format('YYYY-MM-DD hh:mm:ss');
        body.user_id = user.id;
        const sqlStr = `
    INSERT INTO topics(title,content,user_id,create_time,modify_time)
    VALUES('${body.title}','${body.content}','${body.user_id}','${body.create_time}','${body.modify_time}')
    `;

        //插入topics;
        db.query(sqlStr).then(function(result1) {

            //插入成功返回刚才插入的数据;
            db.query(`SELECT * FROM topics WHERE id='${result1.insertId}'`).then(function(result2){
                res.status(201).json(result2[0]);
            })
        })

    }catch(err) {
        next(err);
    }


}

//更新话题;
exports.update = async (req,res,next) => {
    //拿到topic的id
    //sql语句更新数据;
    try {
        const {id} = req.params;
        const body = req.body;
        const sqlStr = `
        UPDATE topics SET title = '${body.title}',content='${body.content}',modify_time='${moment().format('YYYY-MM-DD hh:mm:ss')}' WHERE id=${id}
        `;
        //执行更新操作;
        await db.query(sqlStr);

        //返回刚才插入的数据（更新的数据）
        const [updateTopic] = await db.query(`SELECT * FROM topics WHERE id=${id}`);
        res.status(201).json(updateTopic);
    }catch (err){
        next(err);
    }

}

//删除
exports.destroy = async (req,res,next) => {
    //根据话题id查询得到话题中的存储的作者id即(user_id);
    //如果话题中的 user_id === 当前登录用户的id，则可以删除;
    const {id} = req.params;
    //url中的:id叫做动态路由参数;
    //可以通过req.params来获取动态路由参数;
    //查询字符串:req.query;
    //POST请求体: req.body;
    //动态路径参数：req.params;



      //执行删除操作;
    const sqlStr = `DELETE FROM topics WHERE id=${id}`;
    await db.query(sqlStr);
    //响应成功;
    res.status(201).json({});


}
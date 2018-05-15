const express = require('express');
const router = express.Router();
const userController = require('./controllers/user.js');
const topicController = require('./controllers/topics.js');
const commentController = require('./controllers/comment.js');
const sessionController = require('./controllers/session.js');
const db = require('./models/db.js');


//校验是否登录中间件;
function checkLogin(req,res,next) {
        if(!req.session.user) {
            return res.status(401).json({
                error: 'Unauthorized'
            })
        }
        next();
}

//校验资源所有者中间件;
 async function checkTopic  (req,res,next) {
    try {
        const {id} = req.params;
        const [topic] = await db.query(`SELECT * FROM topics WHERE id=${id}`);

        //如果话题资源不存在;
         if (!topic) {
            return res.status(404).json({
               error: 'Topic not Found.'
          })

          }
         //如果话题不属于作者自己;
         if (topic.user_id !== req.session.user.id) {
             res.status(400).json({
                 error: 'Action Invalid!'
             })

         }

         //上面验证没问题进入下一个;
         next();

    }catch (err) {
        next(err);
    }
}


/*用户资源*/
router.get('/api/users',userController.list)
      .post('/api/users',userController.create)
      .patch('/api/users/:id',userController.update)
      .delete('/api/users/:id',userController.destroy)

/*话题资源*/
router.get('/api/topics',topicController.list)
      .get('/api/topics/:id',topicController.single)
      .post('/api/topics',checkLogin,topicController.create)
      .patch('/api/topics/:id',checkLogin,checkTopic,topicController.update)
      .delete('/api/topics/:id',checkLogin,checkTopic,topicController.destroy)

/*评论资源*/
router.get('/api/comment',commentController.list)
      .post('/api/comment',checkLogin,commentController.create)
      .patch('/api/comment/:id',checkLogin,commentController.update)
      .delete('/api/comment/:id',checkLogin,commentController.destroy)


/*会话管理*/
router.get('/api/session',sessionController.get)
    .post('/api/session',sessionController.create)
    .delete('/api/session',sessionController.delete)

module.exports = router
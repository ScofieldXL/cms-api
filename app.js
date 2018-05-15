
const express = require('express');
const  router =require('./router.js');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

//配置解析表单解析体;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//session中间件;必须在router之前
app.use(session({
    secret: 'scofield',
    resave: false,
    saveUninitialized: false
}));
//把路由应用到app中;
app.use(router);
app.use((err,req,res,next) => {
    res.status(500).json({
        error: err.message
    })
});


app.listen(3000,() => {
    console.log('App');
});
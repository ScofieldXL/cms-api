const mysql = require('mysql');


//query方法添加
//创建有个连接池,效率更高，不需要每次操作数据库都创建连接;
const pool = mysql.createPool({
    /*host     : 'localhost',
    user     : 'root',
    password : '66238sgf',
    database : 'cms'*/
    host     : 'hdm419702586.my3w.com',
    user     : 'hdm419702586',
    password : '178075sgf',
    database: 'hdm419702586_db',
    insecureAuth: true
});





exports.query = function(sqlStr){
    // 从连接池中拿一个连接
    return new Promise((resolve,reject) => {
        pool.getConnection(function(err,connection){
            if(err) {
                return  reject(err)
            }
            connection.query(sqlStr,(error,...args) => {
                //操作结束尽早释放连接;
                connection.release();
                if(error) {
                    return reject(error);
                }
                resolve(...args);
            })
        });
    })

}







const mysql = require('mysql')
const {mysql_config} = require('../config/db')

// 创建连接对象
const connection = mysql.createConnection(mysql_config)
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'wkq022020',
//     port: 3306,
//     database: 'myblog'
// })

// 开始连接
connection.connect()

// 执行sql语句
// const sql = `select * from blogs`
// connection.query(sql, (error, result) => {
//     if(error) {
//         console.error('error', error)
//         return
//     }
//     console.log('result', result)
// })

// 封装sql语句
function execSQL(sql) {
    const promise = new Promise((resolve,reject) => {
        // 执行sql语句
        connection.query(sql,(err,result) => {
            if(err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}
// 执行sql语句
// function execSQL(sql, callback) {
//     connection.query(sql, callback)
// }

module.exports = {
    execSQL
}

// 关闭连接
// connection.end()
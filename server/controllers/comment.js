const { execSQL } = require("../db/mysql.js")

const commit = function(data) {
    let sql = []
    // 对数据库插入格式的调整
    for(let i in data) {
        if(i=='comment_like_count') {
            sql.push(0)
            continue
        }
        sql.push(data[i]?`'${data[i]}'`:"''")
    }
    execSQL(`insert into comments values(${sql})`)
}

module.exports = {
    commit
}
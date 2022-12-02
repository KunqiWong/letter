const jwt = require('jsonwebtoken')
const { execSQL } = require("../db/mysql.js")
// 验证token -- 返回token验证的结果 -- 返回一个promise
const verifyToken = function(req){
    return new Promise((resolve, reject)=>{
        let token = req.headers.token;
        if(token){
            let tokenArr = token.split("");
            tokenArr.pop();
            tokenArr.shift();
            token = tokenArr.join("");
            // console.log(token)
            // 验证：只有当token可解，同时isvalid的值有效的时候，才能通过验证。
            //isvalid用来区分是否在登录状态(感觉没必要？？？因为退出登录的话就删除token了)
            jwt.verify(token, 'Fizz', (err, decode)=>{
                if(err){
                    resolve(false);
                }else {
                    const username = decode.username;
                    execSQL(`select user_name from users where user_name='${username}'`).then(data=>{
                        if(data.length>0){
                            resolve(username);
                        }else{
                            resolve(false);
                        }
                    })
                }
            })
        }else {
            return false
        }
    })
}

module.exports = {
    verifyToken
}
const { execSQL } = require("../db/mysql.js")
const nodemailer = require("nodemailer")
let verificationCode;
const getEmail = (email)=> {
    let sql = `select * from users where user_email='${email}'`
    return execSQL(sql).then( rows => {
        return rows
    })
}
const getCode = (email)=>{
    let code = Math.floor(Math.random()*900000) + 100000
    verificationCode = code
    // 建立一个smtp连接
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '2958959348@qq.com',
            pass: 'iinrxczwnyymdgch',
        }
    })
    // 配置相关参数
    let options = {
        from: '2958959348@qq.com',
        to: `${email}`,
        subject: '欢迎你', //标题
        html: `<div style="width:600px;margin:30px auto">
        <h1 style="text-align:center;">欢迎注册信鸽账户</h1>
        <p style="font-size:24px">此次的验证码如下：</p>
        <strong style="font-size:20px;display:block;text-align:center;color:skyblue">${code}</strong>
        <p>验证码15分钟有效，请及时输入</p> 
        <i style="color:#00bfff">此邮件为系统自动发送，请勿回复！若您未注册请忽略。</i>
        <p style="text-align:right">--信鸽</p></div>
        `
    }
    // //数据库查找
    // let sql = `select * from userlist where email='${email}'`
    transporter.sendMail(options,function(err,msg){
        if(err) console.log(err)
        else {
            // res.send(msg)
            transporter.close()
        }
    })
}
const verify = function(code) {
    if(code==verificationCode) return true
}
const registData = function(data) {
    let sql = `INSERT INTO users (user_id, user_name, user_nickname, user_password, user_email) VALUES ('${new Date().getTime()+data.username}','${data.username}','${data.username}','${data.password}', '${data.email}');`
    execSQL(sql)
}
const login = function(data) {
    let sql = `select * from users where user_name='${data.username}' and user_password='${data.password}'`
    return execSQL(sql).then( rows => {
        return rows
    })
}
const getBack = async function(email) {
    let pwd = await execSQL(`select user_password from users where user_email='${email}'`)
    pwd = pwd[0].user_password
    // 建立一个smtp连接
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        secureConnection: true,
        port: 465,
        auth: {
            user: '2958959348@qq.com',
            pass: 'iinrxczwnyymdgch',
        }
    })
    // 配置相关参数
    let options = {
        from: '2958959348@qq.com',
        to: `${email}`,
        subject: '欢迎你', //标题
        html: `<div style="width:600px;margin:30px auto">
        <h1 style="text-align:center;">您的信鸽账户</h1>
        <p style="font-size:24px">您的账户密码为：</p>
        <strong style="font-size:20px;display:block;text-align:center;color:skyblue">${pwd}</strong>
        <i style="color:#00bfff">此邮件为系统自动发送，请勿回复！若您未注册请忽略。</i>
        <p style="text-align:right">--信鸽</p></div>
        `
    }
    transporter.sendMail(options,function(err,msg){
        if(err) console.log(err)
        else {
            // res.send(msg)
            transporter.close()
        }
    })
}
module.exports = {
    getEmail,
    getCode,
    verify,
    registData,
    login,
    getBack
}
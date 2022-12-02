const express = require('express');
const app = express();
// const getCode = require('./router/index.js')
const cookieParase = require('cookie-parser'); //处理post请求
const { getEmail, getCode, verify, registData, login,getBack } = require('./controllers/login.js')
const { verifyToken } = require('./controllers/token.js')
const { getBox,saveLetter,getLetter } = require('./controllers/letter')
const { getData, getLetters,getUser } = require('./controllers/data')
const { updateAvatar,updateBoolean,deleteLetter,deleteRequest,getGreat,addGreat,removeGreat,deleteFriend} = require('./controllers/update')
const { commit } = require('./controllers/comment')

//加密数据
const jwt = require('jsonwebtoken')

app.use(express.urlencoded({ extended: true }))
app.use(cookieParase());
// app.use(express.json())
app.use(require('cors')())
// 设置最大传值2M,用于传头像的base64
app.use(express.json({ limit: "50mb" }));

app.all('*', function (req, res, next) {
    //处理跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    //res.header("Content-Type","*");  /**/
    next();
})
app.post('/', (req, res) => {
    console.log('/')
})
//检测邮箱是否注册过
app.post('/isreg', (req, res) => {
    getEmail(req.body.email).then(x => {
        console.log(x)
        //找到已注册邮箱
        if (x.length > 0) res.send(JSON.stringify({ code: 1 }))
        else res.send(JSON.stringify({ code: 2 }))
    })
    // console.log(req.body)
})
// 获取验证码
app.post('/getcode', (req, res) => {
    getCode(req.body.email)
})
// 找回密码
app.post('/back', (req, res) => {
    getBack(req.body.email).then(()=>{
        res.send('')
    })
})
// 注册
app.post('/register', (req, res) => {
    if (verify(req.body.code)) {
        registData(req.body)
        res.send(JSON.stringify({ code: 200 }))
    } else {
        res.send(JSON.stringify({ code: 400 }))
    }
})
// 登录
app.post('/login', (req, res) => {
    login(req.body).then(x => {
        if (x.length > 0) {
            let data = { username: req.body.username, password: req.body.password }
            let token = jwt.sign(data, 'Fizz', { expiresIn: 60 * 60 * 24 }) //身份令牌
            //在其他页面请求数据时解密获取身份
            // jwt.verify(token, 'Fizz', function (err, data) {
            //     if (err) console.log(err)
            //     console.log('解析的数据', data)
            //   })
            res.send(JSON.stringify({ code: 200, token }))
        } else {
            res.send(JSON.stringify({ code: 404 }))
        }
    })
})
// 收信人判断
app.post('/sendmsg', (req, res) => {
    // console.log(req.headers['token'])
    verifyToken(req).then(username => {
        // console.log(username, req.body)
        if (username == req.body.to_name) {
            res.send(JSON.stringify({ code: 200 }))
        } else {
            res.send(JSON.stringify({ code: 404 }))
        }
    })
})
// 送信（已用Websocket替代）
app.post('/sendbox', (req, res) => {
    // console.log(req.headers['token'])
    verifyToken(req).then(username => {
        if(username) {
            // console.log(req.body)
            saveLetter(req.body).then(()=>{
                res.send(JSON.stringify({ code: 200 }))
            })
        }
    })
})
//获取用户数据
app.get('/getdata', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            const user = JSON.parse(req.query.user)
            if (!user.name) {
                getData(username).then(data => {
                    res.send(data)
                })
            } else {
                getData(user.name).then(data => {
                    res.send(data)
                })
            }
        } else {
            res.send(false)
        }
    })
})
//搜索用户
app.get('/getuser', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            getUser(JSON.parse(req.query.data)).then(data=>{
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//获取信件区
app.get('/showlist', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            // console.log(req.query.sort)
            getLetters(JSON.parse(req.query.sort)).then(data => {
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//获取信件
app.get('/getletter', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            getLetter(JSON.parse(req.query.data)).then(data => {
                res.send(data)
            }).catch(err=>{
                res.send(err)
            })
        } else {
            res.send(false)
        }
    })
})
//获取点赞
app.post('/great', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            getGreat({user_name:username,...req.body}).then(data => {
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//添加点赞
app.post('/addgreat', (req, res) => {
    // console.log(req.body)
    verifyToken(req).then(username => {
        if (username) {
            addGreat({user_name:username,...req.body}).then(data => {
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//删除点赞
app.post('/removegreat', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            removeGreat({user_name:username,...req.body}).then(data => {
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//获取信箱
app.get('/getbox', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            getBox(username).then(data => {
                res.send(data)
            })
        } else {
            res.send(false)
        }
    })
})
//更改头像
app.post('/update', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            updateAvatar(req.body).then(() => {
                res.send('')
            })
        } else {
            res.send(false)
        }
    })
})
//公开、隐藏/已读、未读
app.post('/boolean', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
            updateBoolean(req.body).then(() => {
                res.send('')
            })
        } else {
            res.send(false)
        }
    })
})
//删除信件
app.delete('/deletter', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
           deleteLetter(JSON.parse(req.query.letter)).then(() => {
                res.send('')
            })
        } else {
            res.send(false)
        }
    })
})
//删除请求
app.delete('/derequest', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
           deleteRequest(JSON.parse(req.query.request)).then(() => {
                res.send('')
            })
        } else {
            res.send(false)
        }
    })
})
//删除好友
app.delete('/delfriend', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
           deleteFriend(JSON.parse(req.query.user)).then(() => {
                res.send('')
            })
        } else {
            res.send(false)
        }
    })
})
//提交评论
app.post('/commit', (req, res) => {
    verifyToken(req).then(username => {
        if (username) {
           commit(req.body)
        } else {
            res.send(false)
        }
    })
})
app.listen('3333', () => {
    console.log('服务器启动于3333')
})

//用websocket从服务端主动向客户端发送信息
const ws = require('nodejs-websocket');
const { addFriends,friendsRequest } = require('./controllers/update');
const { json } = require('express');

// // 存放用户id对应的连接
// let cs = {}

//处理用户发送的数据
const serve = ws.createServer(connect => {

    // 接收用户数据时触发
    connect.on('text', data => {
        // console.log(data)
        // data = JSON.parse(data)
        // // 将所有id对应的连接connect存在一个对象里
        // cs[data.id] = connect
        broadcast(data)
    })

    //连接断开
    connect.on('close', () => {

    })

    //注册一个error 处理用户错误信息
    connect.on('error', () => {

    })
})

// 广播，给所有用户发送消息
function broadcast(obj) {
    // // 根据用户名在数据库找到对应的用户
    // const toId = await getId(obj.to_name)
    // cs[toId].send(JSON.stringify(obj))
    //用bridge参数表示一对一关系,里面存两个用户id
    // obj.bridge.forEach(item=>{
    //     cs[item].send(JSON.stringify(obj))
    // })
    obj = JSON.parse(obj)
    // serve.connections表示所有用户
    //信件指定时间发送
    if(obj.time) {
        let t = obj.time-new Date().getTime()>0?obj.time-new Date().getTime():0
        // console.log(123,obj.time,new Date().getTime(),t)
        setTimeout(()=>{
            serve.connections.forEach(item => {
                item.send(JSON.stringify(obj))
            })
            // 到达指定时间存到数据库
            saveLetter(obj)
        },t)
    } else if(obj.approve) {
        // 同意请求
        addFriends(obj)
    } else {
        //评论或者好友申请直接发
        serve.connections.forEach(item => {
            item.send(JSON.stringify(obj))
        })
        //存到好友请求中
        friendsRequest(obj)
    }
}

serve.listen('3000', () => {
    console.log('websocket服务器启动于3000')
})
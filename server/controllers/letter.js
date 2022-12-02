const { execSQL } = require("../db/mysql.js")

function addChildren(dad, son) {
    for (let i of dad) {
        if (i.comment_id == son.parent_comment_id) {
            i.reply.push(son)
        } else {
            //递归构造子节点(评论只有两级不用递归)
            // addChildren(i.reply, son)
        }
    }
}

function getMenuList(menuList) {
    let stack = []
    let menus = []
    // 分离父子节点
    for (let x of menuList) {
        x.reply = []
        if (!x.parent_comment_id) menus.push(x)
        else stack.push(x)
    }
    for (let son of stack) {
        addChildren(menus, son)
    }
    return menus;
};

const getBox = async function(username) {
    let request = await execSQL(`select * from friends_request where to_user_name='${username}'`)
    let box = await execSQL(`select * from letters where to_name='${username}'`)
    let comments = await execSQL(`select * from comments where to_user_name='${username}'`)
    // console.log(request,box)
    let obj = {
        'box':box,
        'request':request,
        'comments':comments
    }
    return new Promise(function (resolve,reject) {
        resolve(obj)
    })
    // let comments = await execSQL(`select * from comments where letter_id='${letters[i].letter_id}'`)
}

const getLetter = async function(letter) {
    let res
    if(letter.letter_title) res = await execSQL(`select * from letters where letter_title like '%${letter.letter_title}%'`)
    else res = await execSQL(`select * from letters where letter_id='${letter.letter_id}'`)
    
    let comments = new Array(res.length)
    for (let i = 0; i < res.length; i++) {
        comments[i] = await execSQL(`select * from comments where letter_id='${res[i].letter_id}'`)
        comments[i] = getMenuList(comments[i])
        res[i].comments = comments[i]
    }
    return new Promise(function (resolve, reject) {
        resolve(res);
    });
}

const saveLetter = async function(data) {
    let sql = []
    // 对数据库插入格式的调整
    for(let i in data) {
        if(i=='letter_likeNum'||i=='isRead') {
            sql.push(data[i])
            continue
        } else if(i=='isHidden'||i=='offline') {
            sql.push(data[i]?1:0)
            continue
        }
        sql.push(data[i]?`'${data[i]}'`:"''")
    }
    execSQL(`insert into letters values(${sql})`)
    //缺少to_nickname，补全
    let to_nickname = await execSQL(`select user_nickname from users where user_name='${data.to_name}'`)
    to_nickname = to_nickname[0].user_nickname
    return execSQL(`update letters set to_nickname='${to_nickname}' where letter_id='${data.letter_id}'`)
}


module.exports = {
    getBox,
    saveLetter,
    getLetter
}
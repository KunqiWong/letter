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
const getData = async function (name) {
    let user = await execSQL(`select user_id,user_name,user_avatar,user_nickname,user_tag from users where user_name='${name}'`)
    let letters = await execSQL(`select * from letters where from_name='${name}'`)
    let friends = await execSQL(`select * from user_friends  where user_name='${name}'`)
    // console.log(friends)
    //通过好友id查询数据
    let friendsData = new Array(friends.length)
    for (let i = 0; i < friends.length; i++) {
        friendsData[i] = await execSQL(`select user_id,user_name,user_avatar,user_nickname from users where user_id='${friends[i].user_friends_id}'`)
        friendsData[i] = friendsData[i][0]
    }
    // console.log(friendsData)
    user[0].friends = friendsData
    user[0].letters = letters
    const result = { ...user[0] }
    // console.log(result)
    return new Promise(function (resolve, reject) {
        resolve(result);
    });
}
const getLetters = async function(sort) {
    let letters
    if(sort.way=='hot'&&sort.sort) {
        // 热度降序
        letters = await execSQL(`select * from letters where isHidden=0 order by letter_likeNum desc limit ${sort.page*10},${sort.page*10+10}`)
    } else if(sort.way=='hot'&&!sort.sort) {
        // 热度升序
        letters = await execSQL(`select * from letters where isHidden=0 order by letter_likeNum limit ${sort.page*10},${sort.page*10+10}`)
    } else if(sort.way=='time'&&!sort.sort) {
        // 时间升序
        letters = await execSQL(`select * from letters where isHidden=0 order by time limit ${sort.page*10},${sort.page*10+10}`)
    } else {
        // 时间降序
        letters = await execSQL(`select * from letters where isHidden=0 order by time desc limit ${sort.page*10},${sort.page*10+10}`)
    }
    let comments = new Array(letters.length)
    for (let i = 0; i < letters.length; i++) {
        comments[i] = await execSQL(`select * from comments where letter_id='${letters[i].letter_id}'`)
        comments[i] = getMenuList(comments[i])
        letters[i].comments = comments[i]
    }
    return new Promise(function (resolve, reject) {
        resolve(letters);
    });
}
const getUser = function(data) {
    console.log(data.user_nickname)
    return execSQL(`select user_id,user_name,user_avatar,user_nickname,user_tag from users where user_nickname like '%${data.user_nickname}%'`).then(res=>{
        return res
    })
}
module.exports = {
    getData,
    getLetters,
    getUser
}
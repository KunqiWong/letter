const { execSQL } = require("../db/mysql.js")

const updateAvatar = function(data) {
    execSQL(`update users set user_nickname='${data.user_nickname}' where user_id='${data.user_id}'`)
    // console.log(data)
    if(data.user_avatar!="") {
        execSQL(`update users set user_avatar='${data.user_avatar}' where user_id='${data.user_id}'`)
        execSQL(`update letters set user_avatar='${data.user_avatar}' where user_id='${data.user_id}'`)
        execSQL(`update comments set user_avatar='${data.user_avatar}' where user_id='${data.user_id}'`)
    }
    return execSQL(`update users set user_tag='${data.user_tag}' where user_id='${data.user_id}'`)
}

const updateBoolean = function(data) {
    // console.log(data)
    if(data.isRead===0) return execSQL(`update letters set isRead=1 where letter_id='${data.letter_id}'`)
    if(data.isHidden) return execSQL(`update letters set isHidden=0 where letter_id='${data.letter_id}'`)
    else  return execSQL(`update letters set isHidden=1 where letter_id='${data.letter_id}'`)
}

const deleteLetter = function(data) {
    // console.log(data)
    return execSQL(`delete from letters where letter_id='${data.letter_id}'`)
}

const deleteRequest = function(data) {
    // console.log(data)
    return execSQL(`delete from friends_request where user_id='${data.user_id}'`)
}

const addFriends = function(data) {
    console.log(data)
    execSQL(`insert into user_friends values('${data.user_id}','${data.to_user_id}','${data.user_name}','${new Date().getTime()-'1'}')`)
    return execSQL(`insert into user_friends values('${data.to_user_id}','${data.user_id}','${data.to_user_name}','${new Date().getTime()}')`)
}

const deleteFriend = function(data) {
    // console.log(data)
    execSQL(`delete from user_friends where user_id='${data.user_id}' and user_friends_id='${data.user_friends_id}'`)
    return execSQL(`delete from user_friends where user_id='${data.user_friends_id}' and user_friends_id='${data.user_id}'`)
}

const friendsRequest = async function(data) {
    // console.log(data)
    let info = await execSQL(`select * from friends_request where user_name='${data.user_name}' and to_user_name='${data.to_name}'`)
    console.log(info.length)
    if(info.length) return
    return execSQL(`insert into friends_request values('${data.user_id}','${data.user_name}','${data.user_avatar}','${data.to_name}','${data.user_nickname}','${data.user_friends_id}')`)
}

const getGreat = function(data) {
    console.log(data)
    if(data.letter) return execSQL(`select * from great where user_name='${data.user_name}' and letter_id!=''`)
    else return execSQL(`select * from great where user_name='${data.user_name}' and comment_id!=''`)
}

const removeGreat = function(data) {
    console.log(data)
    if(data.letter_id) {
        execSQL(`update letters set letter_likeNum=letter_likeNum-1 where letter_id='${data.letter_id}'`)
        return execSQL(`delete from great where user_name='${data.user_name}' and letter_id='${data.letter_id}'`)
    } else {
        execSQL(`update comments set comment_like_count=comment_like_count-1 where comment_id='${data.comment_id}'`)
        return execSQL(`delete from great where user_name='${data.user_name}' and comment_id='${data.comment_id}'`)
    }
    
}

const addGreat = function(data) {
    if(data.letter_id) {
        execSQL(`update letters set letter_likeNum=letter_likeNum+1 where letter_id='${data.letter_id}'`)
        return execSQL(`insert into great values('${data.user_name}','${data.letter_id}','')`)
    } else {
        execSQL(`update comments set comment_like_count=comment_like_count+1 where comment_id='${data.comment_id}'`)
        return execSQL(`insert into great values('${data.user_name}','','${data.comment_id}')`)
    }
}

module.exports = {
    updateAvatar,
    updateBoolean,
    deleteLetter,
    addFriends,
    deleteFriend,
    friendsRequest,
    deleteRequest,
    getGreat,
    removeGreat,
    addGreat
}
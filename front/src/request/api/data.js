import request from "..";
export function getData(data) {
    return request({
        method:'get',
        url:"/getdata",
        params:{
            user:data
        }
    })
}
export function getList(data) {
    return request({
        method:'get',
        url:"/showlist",
        params:{
            sort:data
        }
    })
}
export function getLetter(data) {
    return request({
        method:'get',
        url:"/getletter",
        params:{
            // {letter_id,letter_title}
            data:data
        }
    })
}
export function getUser(data) {
    return request({
        method:'get',
        url:"/getuser",
        params:{
            data:data
        }
    })
}
export function updateAvatar(data) {
    return request({
        method:'post',
        url:"/update",
        data:data
    })
}
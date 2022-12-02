import request from "..";
export function updateAvatar(data) {
    return request({
        method:'post',
        url:"/update",
        data:data
    })
}
export function updateBoolean(data) {
    return request({
        method:'post',
        url:"/boolean",
        data:data
    })
}
export function deleteLetter(data) {
    return request({
        method:'delete',
        url:"/deletter",
        params:{
            letter:data
        }
    })
}
export function deleteRequest(data) {
    return request({
        method:'delete',
        url:"/derequest",
        params:{
            request:data
        }
    })
}
export function getGreat(data) {
    return request({
        method:'post',
        url:"/great",
        data:data
    })
}
export function addGreat(data) {
    return request({
        method:'post',
        url:"/addgreat",
        data:data
    })
}
export function removeGreat(data) {
    return request({
        method:'post',
        url:"/removegreat",
        data:data
    })
}
export function deleteFriend(data) {
    return request({
        method:'delete',
        url:"/delfriend",
        params:{
            user:data
        }
    })
}
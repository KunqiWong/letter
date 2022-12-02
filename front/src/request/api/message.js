import request from "..";
export function sendMessage(data) {
    return request({
        method:'post',
        url:"/sendmsg",
        data:data
    })
}
export function getBox() {
    return request({
        method:'get',
        url:"/getbox",
    })
}
export function sendBox(data) {
    return request({
        method:'post',
        url:"/sendbox",
        data:data
    })
}

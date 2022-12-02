import request from "..";
export function logIn(data) {
    return request({
        method:'post',
        url:"/login",
        data:data
    })
}
export function isReg(data) {
    return request({
        method:'post',
        url:"/isreg",
        data:data
    })
}
export function getCode(data) {
    return request({
        method:'post',
        url:"/getcode",
        data:data
    })
}
export function register(data) {
    return request({
        method:'post',
        url:"/register",
        data:data
    })
}
export function lookBack(data) {
    return request({
        method:'post',
        url:"/back",
        data:data
    })
}

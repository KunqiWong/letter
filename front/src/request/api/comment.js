import request from "..";
export function commit(data) {
    return request({
        method:'post',
        url:"/commit",
        data:data
    })
}
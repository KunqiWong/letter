// global.js
export default {
    ws: {},//websocket对象
    delay:1500,//重连延迟，单位：毫秒
    //设置websocket对象方法
    setWs: function(newWs) {
        this.ws = newWs
    },
    //设置延迟方法
    setDelay:function(newDelay){
    	 this.delay = newDelay
    },
    //发送websocket信息方法
    sendMsg:function(message){
    	this.ws.send(JSON.stringify(message))
    },
    creatSocket() {
         if ("WebSocket" in window) {
            console.log("您的浏览器支持 WebSocket!");	
            //实例化websocket	 
            const ws = new WebSocket('ws://localhost:3000');
                   //保存设置全局websocket对象
                   this.setWs(ws);
                   //监听websocket连接打开方法
                   this.ws.onopen = function() {
                       console.log("打开websocket")
                       //调用keepalive方法（不一定都需要调用此方法，可注释）
                       //this.keepAlive()
                   }
                   //监听websocket错误方法
                   this.ws.onerror = function(ev) {
                        console.log("连接已出错...");
                           //延迟执行重连
                         setTimeout(() => {
                           this.creatSocket();
                         }, this.delay);
                   };
                   //监听websocket关闭方法
                   this.ws.onclose = function(ev) {
                         // 关闭 websocket
                         console.log("连接已关闭...");
                           //延迟执行重连
                         setTimeout(() => {
                           this.creatSocket();
                         }, this.delay);
                   };
                   
                   //监听websocket接收消息事件（接收来自服务器的实时消息）
                //    this.ws.onmessage = function(res) {
                //        console.log("App.vue收到服务器内容", res.data);
                //      };
                   
                 } else {
                   // 浏览器不支持 WebSocket
                   console.log("您的浏览器不支持 WebSocket!");
                 }
   },
   
}

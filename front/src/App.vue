<template>
  <router-view />
</template>

<script>
// import { sendBox, sendLetter } from "./request/api/message";
export default {
  name: "App",
  data() {
    return {};
  },
  // created(){
  // 	this.$router.push({
  // 		name:'login'
  // 	})
  // }
  mounted() {
    // console.log(this._userData)
    window.addEventListener('beforeunload',()=>{
      if(this._userData) sessionStorage.setItem('_userData',JSON.stringify(this._userData))
      console.log(JSON.parse(sessionStorage.getItem('_userData')))
    })
      // console.log(JSON.parse(sessionStorage.getItem('_userData')))
    // this.$global.creatSocket();
    // this.$global.ws.onmessage = function (res) {
    //   // console.log(JSON.parse(res.data));
    //   const data = JSON.parse(res.data);
    //   // console.log(data)
    //   // 判断是否为收信人
    //   // sendLetter(data).then((res) => {
    //   //   // console.log(res);
    //   //   if (res.code == 200) {
    //   //     sendBox(data).then(re=>{
    //   //       if(re.code==200) this.$message.success("信件已在规定条件下发送成功");
    //   //     })
    //   //   } else {
    //   //     console.log("error");
    //   //   }
    //   // });
    // };
  },
  
};
</script>

<style>
body {
  padding-right: 0 !important;
}
</style>

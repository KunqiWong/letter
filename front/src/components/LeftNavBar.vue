<template>
  <div class="app-sidebar">
    <el-tooltip v-for="(data,idx) in config" :key="idx" class="item" effect="dark" :content="data.content" placement="right">
      <router-link
        style="font-size: 25px"
        :to="{ name: data.name }"
        :class="{active2: isActive == idx}"
        @click.native="changeClass(idx)"
      >
        <svg class="iconpark-icon"><use :href="data.icon"></use></svg>
      </router-link>
    </el-tooltip>
    <div class="red-dot" v-if="count"></div>
  </div>
</template>

<script>
import { sendMessage,sendBox,getBox } from "../request/api/message";
export default {
  name: "LeftNavBar",
  data() {
    return {
      isActive:0,
      count:0,
      config:[
        {
          content:'个人主页',
          icon:'#home',
          name:'Home'
        },
        {
          content:'写信',
          icon:'#editor',
          name:'Edit'
        },
        {
          content:'信件展览',
          icon:'#book-open',
          name:'Show'
        },
        {
          content:'信箱',
          icon:'#envelope-one',
          name:'Box'
        },
      ]
    };
  },
  methods: {
    changeClass(idx) {
      this.isActive = idx
      sessionStorage.setItem('index',idx)
    },
  },
  computed: {
    
  },
  created() {
    this.$bus.$on('toHome',res=>{
      this.isActive = res
    })
    getBox().then(res=>{
      console.log(res)
        if(res.box.some(item=>item.isRead==0)||res.request.length) this.count=1
      })
    //防止刷新丢失,用sessionStorage在浏览器退出时去除
    this.isActive = sessionStorage.getItem('index')?sessionStorage.getItem('index'):0
  },
  mounted() {
    this.$bus.$on('num',res=>{
      this.count=res
    })
    let that = this
    this.$global.creatSocket();
    this.$global.ws.onmessage = function (res) {
      // console.log(JSON.parse(res.data));
      const data = JSON.parse(res.data);
      // 判断是否为收信息的人
      sendMessage(data).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          console.log(data);

          //this指向websocket，得用that记录原先的this
          that.count = 1

          //在后端直接存，不用再发信息存储
          // sendBox(data).then(re=>{
          // })
        } else {
          // console.log("error");
        }
      });
    };
  },
};
</script>

<style scoped>
.red-dot {
  position: absolute;
  left: 42px;
  bottom: 63px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: red;
  /* border: 2px solid #79abdc; */
  z-index: 2;
}
.app-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  height: 500px;
}
a {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  color: black;
  border-radius: 50%;
}
a:hover {
  background-color: #79abdc;
  color: var(--link-color-active);
}

.active2 {
  background-color: #79abdc;
  color: var(--link-color-active);
}
</style>
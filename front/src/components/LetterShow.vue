<template>
  <div class="containerLetter" :style="{ 'background-image': `url(${url})` }">
    <p class="headLetter">&nbsp;{{ head[0] }}</p>
    <p class="contentLetter">&nbsp;&nbsp;&nbsp;&nbsp;{{ firstRow }}</p>
    <div ref="content">
      <p class="contentLetter" v-for="(x, i) in number" :key="i">{{ x }}</p>
    </div>
    <p>&nbsp;&nbsp;{{ endRow }}</p>
    <p></p>
    <p class="lastLetter">{{ last[0] }}</p>
    <p class="lastLetter">{{ time }}</p>
  </div>
</template>

<script>
import { getLetter } from "@/request/api/data.js";
export default {
  data() {
    return {
      title: "",
      head: "",
      last: "",
      number: [],
      firstRow: "",
      endRow: "",
      time: "",
      url: "",
      current: {},
    };
  },
  props: ["id", "operateForm"],
  methods: {
    parse(text) {
      // 匹配开头
      this.head = text.match(/^.{1,10}:|^.{1,10}：/);
      // 除去开头和空格
      const string = text.replace(/^.{1,10}:\s*|^.{1,10}：\s*/, "");
      //匹配末尾(去掉空格后再匹配)
      this.last = string.match(/\s{1}.{1,20}$/);
      // 去掉末尾
      let s = string.replace(/\s{1}.{1,20}$/, "");
      // 除去尾行空格
      s = s.replace(/\s*$/, "");
      const n = s.length;
      //获取首行
      this.firstRow = s.slice(0, 48);
      // 获取中间
      const str = s.slice(48, n);
      this.number = [];
      for (let i = 0; i <= n / 50; i++) {
        if (str.slice(i * 50, i * 50 + 50).length < 50) {
          // 获取尾行
          this.endRow = str.slice(i * 50, i * 50 + 50);
          break;
        }
        this.number[i] = str.slice(i * 50, i * 50 + 50);
      }
      // this.time = this.data[this.id - 1].time;
      this.time = this.current.letter_date1;
      //require里一定要是（路径+名称）
      // const json1 = require(url); //错误用法
      // const json2 = require(`${url}`); //正确用法
      // const json3 = require(url + ""); //正确用法
      this.url = require("../assets/images/" + this.current.background_img);
      // console.log(this.url);
    },
  },
  created() {
    console.log(this.id)
    if(this.id) {
      getLetter({ 'letter_id': this.id, 'letter_title': "" }).then((res) => {
        this.current = res[0]
        this.parse(this.current.letter_content);
    });
    } else {
      this.current = this.operateForm
      // console.log(this.current.letter_content)
      if(this.operateForm) this.parse(this.current.letter_content);
      else this.url = require("../assets/images/letter3.jpeg");
    }
    // axios.get("/letter.json").then((res) => {
    //   // this.data = res.data;
    //   // console.log(this.operateForm,1,res.data)
    //   this.current = this.operateForm?this.operateForm:res.data[0]
    //   this.parse(this.current.letter_content);
    // });
  },
  watch: {
    id: {
      handler(newval, oldval) {
        getLetter({ 'letter_id': newval, 'letter_title': "" }).then((res) => {
          console.log(res)
          this.current = res[0];
          this.parse(this.current.letter_content);
        });
      },
      // immediate:true
    },
  },
};
</script>

<style lang="less">
.containerLetter {
  font-family: "楷体";
  font-weight: 600;
  width: 100%;
  height: 630px;
  //   background: url("../assets/images/letter4.jpeg");
  background-size: cover;
  background-position: center;
  padding: 30px;
  border-radius: 20px;
  box-shadow: -5px 10px 5px 5px #ccc;
  overflow-x: hidden;
  overflow-y: scroll;
  transform: translateX(15px);
  // &::-webkit-scrollbar {
  //   display: none;
  // }
  p {
    border-bottom: 2px solid black;
    height: 30px;
    line-height: 42px;
    letter-spacing: 1px;
  }
  .contentLetter {
    text-align: center;
  }
  .lastLetter {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
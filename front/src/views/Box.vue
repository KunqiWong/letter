<template>
  <div class="mainBody">
    <div class="header">
      <div class="constrain">
        <div class="left">
          <span class="one" :class="{act:number==1}" @click="toLetter"
            >你的信件<span class="read"
              >(<span>{{ getLetterNum }}</span
              >)</span
            ></span
          >|
          <span class="two" :class="{act:number==2}" @click="toComment"
            >你的回复<span class="read"
              >(<span>{{ getCommentNum }}</span
              >)</span
            ></span
          >
          <div class="slider" ref="underline1"></div>
        </div>
        <div class="right">
          <span class="three" :class="{act:number==3}" @click="unRead">
            未读<span class="read"
              >(<span>{{ getNum }}</span
              >)</span
            ></span
          >
          <div class="slide" ref="underline2"></div>
        </div>
      </div>
    </div>
    <div class="container" v-for="item in current" :key="item.comment_id">
      <div v-if="comment" class="message">
        <div class="info">
          <img class="avatar" :src="item.user_avatar" width="36" height="36" />
          <div class="name">{{ item.user_nickname }}</div>
          <div class="right">
            <div class="date">{{ item.comment_date }}</div>
          </div>
        </div>
        <div class="letter">{{item.comment_content}}</div>
        <el-button
          id="msg"
          type="info"
          round
          @click.stop="reply('',item)"
          style="background-color: skyblue; border: 1px solid #ffffff"
          >回复</el-button
        >
      </div>
      <div v-if="item.letter_title&&!comment" class="message" @click="change(item)">
        <div class="info">
          <img class="avatar" :src="item.user_avatar" width="36" height="36" />
          <div class="name">{{ item.from_nickname }}</div>
          <div class="right">
            <div class="date">{{ item.letter_date1 }}</div>
          </div>
        </div>
        <div class="letter">《{{ item.letter_title }}》</div>
        <el-button
          id="msg2"
          type="info"
          round
          @click.stop="reply(item,'')"
          style="background-color: skyblue; border: 1px solid #ffffff"
          >回信</el-button
        >
        <el-button
          v-if="!item.isRead&&!comment"
          id="msg"
          type="danger"
          round
          style="border: 1px solid #ffffff"
          >未读</el-button
        >
        <el-button
          v-if="item.isRead&&!comment"
          id="msg"
          type="info"
          round
          style="background-color: #ccc; border: 1px solid #ffffff"
          >已读</el-button
        >
      </div>
      <div v-if="!item.letter_title&&!comment" class="message">
        <div class="info">
          <img class="avatar" :src="item.user_avatar" width="36" height="36" />
          <div class="name">{{ item.user_nickname }}</div>
          <div class="text">请求添加您为笔友</div>
        </div>
        <el-button
          id="msg2"
          type="info"
          round
          @click="approve(item)"
          style="background-color: skyblue; border: 1px solid #ffffff"
          >同意</el-button
        >
        <el-button
          id="msg"
          type="info"
          round
          @click="cancel(item)"
          style="background-color: skyblue; border: 1px solid #ffffff"
          >取消</el-button
        >
      </div>
      <div class="x" @click="delMsg(item)">
        <svg class="iconpark-icon"><use href="#close"></use></svg>
      </div>
    </div>
    <div class="modia" v-show="hidden" @click="close($event)">
      <!-- <div class="content" @click="open" ref="content">
        <div class="title" :class="{ active: active }">{{ title }}</div>
        <div class="close" v-show="show" ref="envelop"></div>
        <LetterShow
          v-show="!show"
          style="height: 95vh; transform: translateX(18px);box-shadow:none"
          :id="id"
        ></LetterShow>
      </div> -->
      <LetterShow
        :class="{ opacity: show }"
        class="letterShow"
        :id="letter.id"
      ></LetterShow>
      <div class="message2" ref="shell">
        <div ref="main" class="message-envelope opacity">
          <div ref="bg" class="message-bg"></div>
          <div ref="shadow" class="message-shadow"></div>
          <div ref="top" class="message-top"></div>
          <div ref="content" class="message-content">
            <p>{{ letter.title }}</p>
          </div>
          <div ref="pack" class="message-pack"></div>
          <img class="pigeon" src="../assets/images/small.png" />
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="response" title="评论回复">
      <div class="input-wrapper">
            <el-input
              class="gray-bg-input"
              v-model="inputComment"
              type="textarea"
              :rows="3"
              autofocus
              placeholder="写下你的评论"
              maxlength="30"
              show-word-limit
            >
            </el-input>
            <div class="btn-control">
              <el-button
                round
                class="btn"
                type="primary"
                @click="()=>this.response=false"
                style="background-color: skyblue; border: 1px solid #fff"
                >取消</el-button
              >
              <el-button
                class="btn"
                type="primary"
                round
                @click="commitComment(target)"
                style="background-color: skyblue; border: 1px solid #fff"
                >确定</el-button
              >
            </div>
          </div>
    </el-dialog>
  </div>
</template>

<script>
// import "animate.css";
import LetterShow from "../components/LetterShow.vue";
import { getBox } from "../request/api/message";
import { updateBoolean,deleteRequest } from "../request/api/update";
import { commit } from "../request/api/comment";
export default {
  name: "Box",
  components: { LetterShow },
  data() {
    return {
      user:{},
      show: true,
      active: false,
      hidden: false,
      number:1,
      id: 1,
      msg: [],
      current: [],
      request:[],
      comments:[],
      letter: {
        id: "",
        title: "",
      },
      comment:false,
      response:false,
      inputComment:'',
      target:{}
      // avatar: require("../assets/images/letter1.jpeg"),:style="{ 'background-image': `url(${avatar})` }"
      // socket: "",
    };
  },
  async created() {
    await this._userData;
    this.user = this._userData?this._userData:JSON.parse(sessionStorage.getItem('_userData'))
    getBox().then((res) => {
      console.log(res);
      this.request = res.request
      this.msg = res.box.sort((a,b)=>b.time-a.time)
      this.current = this.msg
      this.comments = res.comments.sort((a,b)=>b.comment_time-a.comment_time)
    });
    // // const res = require("../../public/comment");
    // // this.msg = res.comment.data;
    // this.msg.forEach((item) => {
    //   console.log(item)
    //   this.current.push(item);
    // });
    // console.log(this.current)
    // // console.log(this.msg)
  },
  computed: {
    getNum() {
      let sum = 0;
      this.msg.forEach((item) => {
        if (!item.isRead) sum++;
      });
      sum+=this.request.length
      this.$bus.$emit('num',sum)
      return sum;
    },
    getLetterNum() {
      return this.msg.length;
    },
    getCommentNum() {
      return this.comments.length;
    },
  },
  methods: {
    change(item) {
      this.letter.id = item.letter_id;
      this.letter.title = item.letter_title;
      this.hidden = true;
      // this.$nextTick(()=>{
      //   this.$refs.main.classList.remove("opacity");
      //   this.$refs.shell.classList.remove("opacity");
      // })
      setTimeout(()=>{
        this.$refs.main.classList.remove("opacity");
        this.$refs.shell.classList.remove("opacity");
      },100)
      //将isRead传后端
      updateBoolean({
        isHidden: '',
        letter_id: item.letter_id,
        isRead: 0
        }).then(()=>{
          item.isRead = 1
        })
    },
    reply(letter,comment) {
      if(letter) this.$router.push({path:'/manage/edit',query:{ name: letter.from_name, nickname: letter.from_nickname}})
      else {
        this.response = true
        this.target = comment
        this.inputComment = "";
      }
    },
    commitComment(comment) {
        let temp = {};
        temp.comment_id = new Date().getTime() + this.user.user_name;
        temp.user_id = this.user.user_id;
        temp.letter_id = comment.letter_id;
        temp.comment_like_count = 0;
        temp.comment_date = new Date().toLocaleString().replace(/\//g, "-");
        temp.comment_content = this.inputComment;
        temp.parent_comment_id = comment.comment_id;
        temp.comment_time = new Date().getTime();
        temp.to_user_nickname = comment.user_nickname
        temp.user_avatar = this.user.user_avatar;
        temp.user_name = this.user.user_name;
        temp.user_nickname = this.user.user_nickname;
        temp.to_user_name = comment.user_name;
        console.log(temp)
        commit(temp);
        this.inputComment = "";
        this.response = false
        this.$message.success('回复成功')
      },
    delMsg(item) {
      this.$confirm(`是否删除此${item.letter_title?'信件':'消息'}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        for (let i in this.msg) {
          if (this.msg[i] == item) this.msg.splice(i, 1);
          if (item == this.current[i]) this.current.splice(i, 1);
        }
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // open() {
    //   this.show = false;
    //   this.active = false;
    // },
    close(event) {
      this.$refs.main.classList.add("opacity");
      this.$refs.shell.classList.add("opacity");
      const x =
        event.pageX -
        this.$refs.shell.offsetLeft +
        this.$refs.shell.offsetWidth / 2;
      const y =
        event.pageY -
        this.$refs.shell.offsetTop +
        this.$refs.shell.offsetHeight / 2;
      if (
        x < 0 ||
        x > this.$refs.shell.offsetWidth ||
        y < 0 ||
        y > this.$refs.shell.offsetHeight
      ) {
        this.hidden = false;
        this.show = true;
      }
    },
    toLetter() {
      this.$refs.underline1.style.left = "5px";
      this.$refs.underline1.style.opacity = "1";
      this.$refs.underline2.style.opacity = "0";
      this.current = this.msg;
      this.number=1
      this.comment = false
    },
    toComment() {
      this.$refs.underline1.style.left = "112px";
      this.$refs.underline2.style.opacity = "0";
      this.$refs.underline1.style.opacity = "1";
      this.number=2
      this.current = this.comments
      this.comment = true
    },
    unRead() {
      this.$refs.underline1.style.opacity = "0";
      this.$refs.underline2.style.right = "6px";
      this.$refs.underline2.style.opacity = "1";
      this.number=3
      this.comment = false
      this.current = [];
      this.msg.forEach((item) => {
        if (!item.isRead) this.current.push(item);
      });
      this.current.unshift(...this.request)
    },
    approve(item) {
      this.$global.sendMsg({...item,'approve':true})
      this.cancel(item)
      this.$message.success(`您成功添加${item.user_nickname}为笔友`)
      this._userData.friends.push({
        user_id:item.user_id,
        user_name:item.user_name,
        user_avatar:item.user_avatar,
        user_nickname:item.user_nickname
      })
    },
    cancel(item) {
      deleteRequest({user_id:item.user_id}).then(()=>{
        this.current=this.current.filter(x=>x!=item)
        this.request=this.request.filter(x=>x!=item)
      })
    }
  },

  // beforeDestroy() {
  //   this.$bus.$off('letters')
  // },
  mounted() {
      let timer;
      let timerOpenning;
      let timerStatus;
      let time = 300;
      let status = "close";
      this.$refs.main.addEventListener("mouseenter", () => {
        timer && clearTimeout(timer);
        timerOpenning && clearTimeout(timerOpenning);
        timerStatus && clearTimeout(timerStatus);
        this.$refs.top.classList.add("open");
        status = "opening";

        timerOpenning = setTimeout(() => {
          this.$refs.shadow.classList.add("opening");
          this.$refs.content.classList.add("opening");
          this.$refs.pack.classList.add("opening");
        }, time);

        timer = setTimeout(() => {
          this.$refs.content.classList.add("open");
          this.$refs.pack.classList.add("open");
          status = "open";
        }, time * 2);

        timerStatus = setTimeout(() => {
          status = "openFinished";
        }, time * 3);
      });

      this.$refs.main.addEventListener("mouseleave", () => {
        timer && clearTimeout(timer);
        if (status === "openFinished") {
          timerOpenning && clearTimeout(timerOpenning);
        }
        this.$refs.content.classList.remove("open");

        timerOpenning = setTimeout(() => {
          this.$refs.shadow.classList.remove("opening");
          this.$refs.content.classList.remove("opening");
          this.$refs.pack.classList.remove("opening");
          status = "close";
        }, time * 2.5);

        timer = setTimeout(() => {
          this.$refs.top.classList.remove("open");
          this.$refs.pack.classList.remove("open");
        }, time * 1.5);
      });

      this.$refs.main.addEventListener("click", () => {
        this.$refs.main.classList.add("opacity");
        this.$refs.shell.classList.add("opacity");
        this.show = false;
      });

  },
  // watch: {
  //   current:{
  //     handler(newval,oldval) {
  //       console.log(123)
  //     }
  //   }
  // },
};
</script>

<style lang="less" scoped>
.hidden {
  visibility: hidden;
}
.opacity {
  // opacity: 0;
  visibility: hidden;
  transform: translateY(800px);
}
.active {
  opacity: 1 !important;
}

.act {
  color: yellow!important;
}

.letterShow {
  width: 950px;
  height: 95vh;
  &::-webkit-scrollbar {
    display: none;
  }
  box-shadow: none;
  transition: 0.5s ease;
}

.mainBody {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 615px;
  border-radius: 20px;
  background-image: url("../assets/images/sky.jpeg");
  background-size: cover;
  background-position: center;
  overflow-y: scroll;
  .header {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 40px;
    font-weight: 600;
    font-size: 15px;
    background-color: skyblue;
    z-index: 1;
    color: white;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    .constrain {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 95%;
      transition: all 0.2s linear;
      .slider {
        position: absolute;
        bottom: -8px;
        left: 5px;
        width: 80px;
        height: 5px;
        border-radius: 2px;
        background-color: yellow;
        z-index: -999;
        transition: 0.5s;
      }
      .slide {
        position: absolute;
        bottom: -8px;
        right: 6px;
        width: 60px;
        height: 5px;
        border-radius: 2px;
        background-color: yellow;
        z-index: -999;
        transition: 0.5s;
        opacity: 0;
      }
      span {
        cursor: pointer;
      }
      // .one:hover~.slider{
      //   left: 5px;
      //   opacity: 1;
      // }
      // .two:hover~.slider{
      //   left: 112px;
      //   opacity: 1;
      // }
      // .three:hover~.slide{
      //   opacity: 1;
      // }
      .read {
        font-size: 10px;
        margin-left: 5px;
        span {
          color: yellow;
        }
      }
      .left {
        display: flex;
        justify-content: space-around;
        width: 15%;
      }
      .right {
        margin-right: 10px;
        .read span {
          color: yellow;
        }
      }
    }
  }
  .container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 120px;
    .x {
      position: absolute;
      top: 15px;
      right: 43px;
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: #f78989;
      }
    }
    &:nth-child(1) {
      padding-top: 10px;
    }
    .message {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 95%;
      padding: 10px;
      border: 1px solid var(--border-fourth);
      margin: 10px;
      border-radius: 10px;
      background-color: white;
      cursor: pointer;
      #msg {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translate(-50%, -50%);
      }
      #msg2 {
        position: absolute;
        top: 50%;
        right: 75px;
        transform: translate(-50%, -50%);
      }
      .info {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 16px;
        .avatar {
          border-radius: 50%;
          margin-right: 20px;
        }
        // .name {
        //     font-size: 16px;
        //     color: var(--text-main);
        //     margin-bottom: 5px;
        //     font-weight: 500;
        //   }
        .text {
          padding-left: 50px;
          font-weight: normal;
          color: skyblue;
        }
        .right {
          margin-left: 20px;
          margin-bottom: -5px;
          .date {
            font-size: 12px;
            color: var(--text-minor);
          }
        }
      }
    }
  }
  .letter {
    font-size: 16px;
    font-family: "楷体";
    font-weight: 600;
    color: var(--text-main);
    line-height: 20px;
    padding: 10px 0;
  }
  .modia {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .title {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    font-family: "楷体";
    font-size: 50px;
    font-weight: 600;
    z-index: 2;
    opacity: 0;
    // transition: all 2s linear;
  }
  // .content {
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  //   width: 950px;
  //   height: 95vh;
  //   border-radius: 20px;
  //   // background: white;
  //   overflow-y: scroll;
  //   &::-webkit-scrollbar {
  //     display: none;
  //   }
  //   .close {
  //     position: absolute;
  //     left: 50%;
  //     top: 50%;
  //     transform: translate(-50%, -50%);
  //     width: 610px;
  //     height: 405px;
  //     border-radius: 10px;
  //     // border: 1px solid black;
  //     background: url("../assets/images/close.png");
  //     background-size: contain;
  //     transition: all 0.3s linear;
  //     cursor: pointer;
  //     &:hover {
  //       width: 605px;
  //       height: 638px;
  //       background: url("../assets/images/open.png");
  //       background-size: contain;
  //     }
  //   }
  // }
}
img {
  max-width: 100%;
}

@width: 500px;
@height: 300px;
@primary-color: skyblue;
@primary-color-darken: darken(@primary-color, 10%);
@out-size: 600px;

.message2 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: @width;
  height: @height;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.message-envelope {
  width: 100%;
  height: 100%;
  position: relative;
  transition: 0.5s ease;
  border-radius: 20px;
  .pigeon {
    position: absolute;
    left: 50%;
    bottom: 20%;
    transform: translate(-50%, -20%);
    z-index: 99;
    width: 100px;
  }
}

.message-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 2px 4px 5px rgba(0, 0, 0, 0.3);
  background-color: @primary-color-darken;
  z-index: 0;
  transition: 300ms;
}

.message-shadow {
  position: absolute;
  content: "";
  top: 1px;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: @primary-color-darken;

  &.opening {
    transition: 300ms;
    z-index: 2;
  }
}

.message-content {
  top: 10%;
  width: 90%;
  height: 80%;
  line-height: 2em;
  margin-left: 5%;
  padding: 20px;
  color: @primary-color-darken;
  background-color: #fff;
  position: relative;
  transition: 300ms;
  overflow: hidden;
  p {
    text-align: center;
    font-family: "楷体";
    font-size: 40px;
    font-weight: 600;
  }
  &.opening {
    z-index: 10;
  }

  &.open {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    transform: translateY(-150px);
  }
}

.message-pack {
  top: 0;
  left: 0;
  width: @width;
  height: @height;
  position: absolute;
  filter: drop-shadow(0 -5px 5px rgba(0, 0, 0, 0.3));
  overflow: hidden;
  clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 0);

  &::before {
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #328e9b;
    clip-path: polygon(
      0 20px,
      10% 50px,
      90% 50px,
      100% 20px,
      100% 100%,
      0 100%
    );
    position: absolute;
  }

  &.open,
  &.opening {
    z-index: 11;
    transition: 300ms;
  }
}

.message-top {
  width: @width;
  height: @height;
  filter: drop-shadow(5px 10px 5px rgba(0, 0, 0, 0.3));
  z-index: 1;
  position: absolute;
  transition: 300ms;
  transform-origin: top center;

  &::before {
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: @primary-color;
    z-index: 1;
    transform-origin: top center;
    clip-path: polygon(0 0, 100% 0, 100% 50px, 50% 100px, 0 50px);
    transform: rotateX(20deg);
    transition: 300ms;
    transition-delay: 200ms;
    position: absolute;
  }

  &.open {
    &::before {
      transform: rotateX(180deg);
      transition-delay: 0;
      background-color: @primary-color-darken;
    }
    filter: drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.3));
  }
}
.input-wrapper {
        padding: 10px;
        .btn-control {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-top: 10px;
          .confirm {
            font-size: 16px;
          }
        }
      }
</style>
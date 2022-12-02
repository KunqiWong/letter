<template>
  <div class="mainBody">
    <div class="back" @click="()=>this.$router.go(-1)" v-if="sendUser.name">
      <svg class="iconpark-icon"><use href="#back"></use></svg>
      返回上一页
    </div>
    <div class="left">
      <input
        type="radio"
        v-model="operateForm.background_img"
        value="letter1.jpeg"
        name="music"
        id="item-1"
        checked
      />
      <input
        type="radio"
        v-model="operateForm.background_img"
        value="letter4.jpeg"
        name="music"
        id="item-2"
      />
      <input
        type="radio"
        v-model="operateForm.background_img"
        value="letter9.jpeg"
        name="music"
        id="item-3"
      />
      <div class="cards">
        <label class="card" for="item-1" id="song-1">
          <img src="../assets/images/letter1.jpeg" />
        </label>
        <label class="card" for="item-2" id="song-2">
          <img src="../assets/images/letter4.jpeg" />
        </label>
        <label class="card" for="item-3" id="song-3">
          <img src="../assets/images/letter9.jpeg" />
        </label>
      </div>
    </div>
    <div class="table">
      <div class="tip">
        <img src="../assets/images/pigeon.png" alt="" /><span
          >记得选左边的信纸哦</span
        >
      </div>
      <LetterForm :formLabel="operateFormLabel" :form="operateForm" :nickname="sendUser.nickname" ref="form">
        <template v-slot:nickname>{{_userData.user_nickname==sendUser.nickname?'自己':sendUser.nickname}}</template>
      </LetterForm>
      <el-button
        type="primary"
        round
        size="big"
        style="
          background-color: skyblue;
          border: 1px solid #ffffff;
          margin-top: 10px;
        "
        @click="editLetter"
        >开始写信</el-button
      >
    </div>
    <div class="modia" v-show="edit">
      <div class="container">
        <div class="content">
          <div class="option"></div>
          <el-input
            class="input"
            v-model="operateForm.letter_content"
            type="textarea"
            :rows="31"
            placeholder="写下你想说的话，不少于50字呦"
            style="background: black"
          />
          <div class="option">
            <!-- 预览，传值给子组件渲染 -->
            <el-button
              id="msg1"
              type="primary"
              round
              @click="predict"
              style="background-color: skyblue; border: 1px solid #ffffff"
              >预览</el-button
            >
            <el-button
              style="background-color: skyblue; border: 1px solid #ffffff"
              id="msg1"
              type="primary"
              round
              @click="
                () => {
                  this.edit = false;
                  this.show = false;
                }
              "
              >取消</el-button
            >
            <el-button
              id="msg1"
              type="primary"
              round
              @click="send"
              style="background-color: skyblue; border: 1px solid #ffffff"
              >发送</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="center" v-if="show">
      <LetterShow
        :operateForm="operateForm"
        :id="letter_id"
        class="preview"
      ></LetterShow>
      <el-button
        type="primary"
        round
        class="out"
        @click="
          () => {
            show = false;
          }
        "
        >退出预览</el-button
      >
    </div>
    <el-dialog style="z-index:999999;margin-left:50px" :visible.sync="tag">
      <div class="code">
        二维码支付页面
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LetterForm from "../components/LetterForm.vue";
import LetterShow from "../components/LetterShow.vue";
export default {
  name: "Edit",
  components: { LetterForm, LetterShow },
  data() {
    return {
      socket: "",
      edit: false,
      show: false,
      tag:false,
      operateForm: {
        letter_id:"",
        user_id:"",
        letter_title:"",
        letter_content:"",
        letter_date1: "",
        letter_likeNum:0,
        letter_date2: "",
        isHidden: true,
        offline: false,
        to_name:"",
        background_img: "letter1.jpeg",
        isRead:0,
        time:"",
        address: '',
        from_name:"",
        user_avatar:'',
        from_nickname:'',
        to_nickname:"",
      },
      operateFormLabel: [
        {
          model: "to_name",
          label: "发送对象 ",
          type: "select",
          opts: [],
        },
        {
          model: "isHidden",
          label: "隐私信件 ",
          type: "switch",
        },
        {
          model: "date",
          label: "发送时间 ",
          type: "date",
        },
        {
          model: "letter_title",
          label: "信件标题 ",
          type: "input",
        },
        {
          model: "offline",
          label: "线下寄信 ",
          type: "switch",
        },
        {
          model: "address",
          label: "线下地址 ",
          type: "input",
        },
      ],
      sendUser: { name: "", nickname: "" },
    };
  },
  async created() {
    await this._userData;
    this._userData = this._userData?this._userData:JSON.parse(sessionStorage.getItem('_userData'))
    this.operateForm.from_nickname = this._userData.user_nickname
    this.operateForm.from_name = this._userData.user_name
    this.operateForm.user_avatar = this._userData.user_avatar
    this.operateForm.user_id = this._userData.user_id
    this.user_avatar = this._userData.user_avatar
    let friends = this._userData.friends;
    // console.log(this.operateFormLabel[0].opts)
    this.operateFormLabel[0].opts.push({
      label: "自己",
      value: this._userData.user_name,
    });
    friends.forEach((item) => {
      this.operateFormLabel[0].opts.push({
        label: item.user_nickname,
        value: item.user_name,
      });
    });
    this.sendUser.name = this.$route.query.name;
    this.sendUser.nickname = this.$route.query.nickname;
    this.operateForm.to_name = this.$route.query.name;
  },
  methods: {
    predict() {
      this.show = true;
    },
    editLetter() {
      if(this.operateForm.offline) {
        if(!this.operateForm.address) {
          this.$message.warning("线下寄信请填写收信地址")
        } else {
          this.edit = true
        }
      } else if(!this.operateForm.to_name) {
        this.$message.warning("请选择发送对象")
      } else if(!this.operateForm.letter_date1||!this.operateForm.letter_date1) {
        this.$message.warning("请选择发送时间")
      } else if(!this.operateForm.letter_title) {
        this.$message.warning("请填写信件标题")
      } else {
        this.edit = true; 
      }
        
    },
    send() {
      if(this.operateForm.letter_content.replace(/\s/g,"").length<50) {
        this.$message.warning("字数不少于50字哦")
        return
      }
      this.operateForm.letter_id = new Date().getTime() + this._userData.user_id
      this.operateForm.time = new Date(this.operateForm.letter_date1 + ' ' + this.operateForm.letter_date2).getTime()
        if (this.operateForm.offline) {
          this.tag = true
        }
        // this.socket.send(JSON.stringify(this.operateForm))
        else if (this.$global.ws && this.$global.ws.readyState == 1) {
          this.$global.sendMsg(this.operateForm);
          this.$message.success("信件已在您选择的条件下发送成功");
          this.edit = false;
          this.show = false;
        }
    },
  },
  mounted() {
    // 用websocket实时消息发送
    // this.socket = new WebSocket('ws://localhost:3000')
    // this.socket.addEventListener('open',()=>{
    //   console.log('连接成功')
    // })
    // this.socket.addEventListener('message',function(e){
    //   console.log('succc')
    // })
    // this.$global.creatSocket();
    // this.$global.ws.onmessage = function (res) {
    //   console.log(JSON.parse(res.data));
    // };
  },
};
</script>

<style lang="less" scoped>
.mainBody {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 615px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  .back {
    position: fixed;
    left: 90px;
    top: 90px;
    display: flex;
    align-items: flex-end;
    font-weight: 600;
    color: skyblue;
    z-index: 2;
    cursor: pointer;
    .iconpark-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .table {
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    font-weight: 600;
    .tip {
      display: flex;
      align-self: start;
      justify-content: center;
      align-items: center;
      padding-bottom: 55px;
      padding-top: 55px;
      span {
        position: relative;
        display: inline-block;
        margin-left: 50px;
        width: 200px;
        height: 100px;
        border: 2px solid skyblue;
        border-radius: 50%;
        line-height: 100px;
        text-align: center;
        background-color: skyblue;
        color: #fff;
        // font-family: '宋体';
        &::before {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 15px 40px;
          position: absolute;
          bottom: 30px;
          left: -65px;
          border-color: transparent skyblue transparent transparent;
        }
      }
    }
  }
  .left {
    width: 700px;
    height: 600px;
    padding-top: 15px;
    // padding-right: 20px;
    /* 去掉单选按钮 */
    input[type="radio"] {
      display: none;
    }
    .cards {
      position: relative;
      width: 100%;
      height: 100%;
      margin-bottom: 20px;
    }
    .card {
      position: absolute;
      width: 60%;
      height: 100%;
      left: 0;
      right: 0;
      margin: auto;
      transition: transform 0.4s ease;
      cursor: pointer;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      object-fit: cover;
    }

    #item-1:checked ~ .cards #song-1,
    #item-2:checked ~ .cards #song-2,
    #item-3:checked ~ .cards #song-3 {
      transform: translatex(0) scale(1);
      opacity: 1;
      z-index: 1;
    }

    #item-1:checked ~ .cards #song-2,
    #item-2:checked ~ .cards #song-3,
    #item-3:checked ~ .cards #song-1 {
      transform: translatex(50%) scale(0.8);
      opacity: 0.6;
      z-index: 0;
    }

    #item-1:checked ~ .cards #song-3,
    #item-2:checked ~ .cards #song-1,
    #item-3:checked ~ .cards #song-2 {
      transform: translatex(-50%) scale(0.8);
      opacity: 0.6;
      z-index: 0;
    }
    // .card {
    //   border: 5px solid black;
    //   border-radius: 15px;
    // }
  }
  .modia {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.8);
    .container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      background-image: url("../assets/images/edit.png");
      background-size: 130% auto;
      background-position: -174px -300px;
      z-index: 3;
      .content {
        position: absolute;
        left: 27%;
        top: 0;
        width: 49.6%;
        height: 100%;
        .option {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 100%;
          height: 72px;
          background-image: url("../assets/images/table.png");
          background-position: 100px center;
          border-radius: 5px;
          #msg1 {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .center {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    // transform: translate(-50%, 50%);
    z-index: 99999;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    .out {
      margin-left: 200px;
      background-color: skyblue;
      border: none;
    }
    .preview {
      width: 950px;
      height: 95vh;
      &::-webkit-scrollbar {
        display: none;
      }
      box-shadow: none;
      transition: 0.5s ease;
    }
  }
}
.code {
  text-align: center;
  height: 400px;
}
</style>
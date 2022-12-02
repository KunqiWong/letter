<template>
  <div class="base">
    <el-dialog
      title="找回密码"
      :visible.sync="back"
      width="30%"
      style="margin-top: 100px"
    >
      <div class="back" v-show="back">
        <div
          style="
            position: relative;
            flex: 1;
            justify-content: center;
            display: flex;
            align-items: center;
            margin-top: 30px;
          "
        >
          <label for="e" style="margin-right: 10px">邮箱:</label>
          <el-input
            id="e"
            placeholder="请输入邮箱"
            v-model="backEmail"
            style="width: 165px; margin-right: 10px"
          ></el-input>
          <el-button
            v-if="s"
            type="primary"
            round
            style="background-color: skyblue; border: 1px solid #ffffff"
            @click="toback"
            >找回密码</el-button
          >
          <el-button
            v-else
            type="primary"
            round
            style="background-color: skyblue; border: 1px solid #ffffff"
            @click="toback"
            >已发送({{ time }})</el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 注册登录界面 -->
    <div class="loginAndRegist">
      <!--登录表单-->
      <div class="loginArea">
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <div class="remember" @click="() => (this.back = true)">
            忘记密码？
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!-- 标语 -->
          <div v-show="isShow" class="title">
            <svg class="iconpark-icon">
              <use href="#bird"></use>
            </svg>
            LOGIN
            <svg class="iconpark-icon" style="transform: rotateY(180deg)">
              <use href="#bird"></use>
            </svg>
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!-- 密码框和用户名框 -->
          <div v-show="isShow" class="pwdArea">
            <div
              style="
                position: relative;
                flex: 1;
                justify-content: center;
                display: flex;
                align-items: center;
                flex-direction: column;
              "
            >
              <label for="user" style="position: absolute; top: 5px; left: 95px"
                >账号:</label
              >
              <el-input
                id="user"
                class="username"
                v-model="loginUser.username"
                style="width: 165px"
                placeholder="请输入用户名"
              ></el-input>
            </div>
            <div
              style="
                position: relative;
                flex: 1;
                justify-content: center;
                display: flex;
                align-items: center;
                flex-direction: column;
              "
            >
              <label for="psd" style="position: absolute; top: 5px; left: 95px"
                >密码:</label
              >
              <el-input
                id="psd"
                placeholder="请输入密码"
                v-model="loginUser.password"
                style="width: 165px"
                show-password
              ></el-input>
            </div>
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!-- 登录注册按钮 -->
          <div v-show="isShow" class="btnArea">
            <el-button
              type="primary"
              round
              style="background-color: skyblue; border: 1px solid #ffffff"
              @click="UserLogin"
              >登录</el-button
            >
          </div>
        </transition>
      </div>
      <!-- 注册表单 -->
      <div class="registArea">
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!--  注册表头-->
          <div v-show="!isShow" class="rigestTitle">
            <svg class="iconpark-icon">
              <use href="#bird"></use>
            </svg>
            REGISTER
            <svg class="iconpark-icon" style="transform: rotateY(180deg)">
              <use href="#bird"></use>
            </svg>
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!--            注册表单-->
          <div v-show="!isShow" class="registForm">
            <div
              style="
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              用&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;&nbsp;名:
              <el-input
                placeholder=""
                v-model="regUser.regUsername"
                style="width: 165px; margin-left: 10px"
                clearable
              >
              </el-input>
            </div>
            <div
              style="
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:
              <el-input
                placeholder=""
                style="width: 165px; margin-left: 10px"
                v-model="regUser.regPwd"
                show-password
              ></el-input>
            </div>
            <div
              style="
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              确&nbsp;认&nbsp;密&nbsp;码:
              <el-input
                placeholder=""
                style="width: 165px; margin-left: 10px"
                v-model="regUser.regRePwd"
                show-password
              ></el-input>
            </div>
            <div style="flex: 1; display: flex; align-items: center">
              邮&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱:
              <el-input
                placeholder=""
                style="width: 165px; margin-left: 10px"
                v-model="regUser.email"
              ></el-input>
            </div>
            <div
              style="
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
              "
            >
              验&nbsp;&nbsp;&nbsp;证&nbsp;&nbsp;&nbsp;码:
              <el-input
                placeholder=""
                style="width: 165px; margin-left: 10px"
                v-model="regUser.code"
              ></el-input>
              <el-button
                v-show="change"
                @click="getC"
                style="
                  position: absolute;
                  right: -5px;
                  background-color: transparent;
                  border: none;
                "
                >|&nbsp;&nbsp;获取验证码</el-button
              >
              <el-button
                disabled
                v-show="!change"
                style="
                  position: absolute;
                  right: -5px;
                  background-color: transparent;
                  border: none;
                "
                >已发送({{ time }})</el-button
              >
            </div>
          </div>
        </transition>
        <transition
          name="animate__animated animate__bounce"
          enter-active-class="animate__fadeInUp"
          leave-active-class="animate__zoomOut"
          appear
        >
          <!--            注册按钮-->
          <div v-show="!isShow" class="registBtn">
            <el-button
              type="primary"
              round
              style="background-color: skyblue; border: 1px solid #ffffff"
              @click="userRegister"
              >注册</el-button
            >
          </div>
        </transition>
      </div>
      <!-- 信息展示界面 -->
      <div
        id="aaa"
        class="showInfo"
        :style="{
          borderTopRightRadius: styleObj.bordertoprightradius,
          borderBottomRightRadius: styleObj.borderbottomrightradius,
          borderTopLeftRadius: styleObj.bordertopleftradius,
          borderBottomLeftRadius: styleObj.borderbottomleftradius,
          right: styleObj.rightDis,
        }"
        ref="showInfoView"
      >
        <!-- 欢迎图片 -->
        <div v-show="isShow">
          <el-button
            type="success"
            style="background-color: skyblue; border: 1px solid #ffffff"
            round
            @click="changeToRegiest"
            >还没有账户？点击注册</el-button
          >
        </div>
        <!-- 欢迎图片 -->
        <div v-show="!isShow">
          <el-button
            type="success"
            style="background-color: skyblue; border: 1px solid #ffffff"
            round
            @click="changeToLogin"
            >已有账户？点击登录</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "animate.css";
// eslint-disable-next-line no-unused-vars
import {
  logIn,
  isReg,
  getCode,
  register,
  lookBack,
} from "@/request/api/login.js";
import { getData } from "../request/api/data";
import Vue from "vue";
export default {
  name: "Login",
  data() {
    return {
      loginUser: {
        username: "",
        password: "",
      },
      backEmail: "",
      admins: {},
      regUser: {
        regUsername: "",
        regRePwd: "",
        regPwd: "",
        email: "",
        code: "",
      },
      styleObj: {
        bordertoprightradius: "15px",
        borderbottomrightradius: "15px",
        bordertopleftradius: "0px",
        borderbottomleftradius: "0px",
        rightDis: "0px",
      },
      isShow: true,
      change: true,
      time: 60,
      timer: null,
      back: false,
      s: true,
    };
  },
  // created() {
  //   this.loadInfoOfAdmin();
  // },
  updated() {
    if (this.time == 0) {
      this.change = true;
      this.time = 60;
      clearInterval(this.timer);
      this.timer = null;
      this.s = true;
    }
  },
  methods: {
    changeToRegiest() {
      this.styleObj.bordertoprightradius = "0px";
      this.styleObj.borderbottomrightradius = "0px";
      this.styleObj.bordertopleftradius = "15px";
      this.styleObj.borderbottomleftradius = "15px";
      this.styleObj.rightDis = "50%";
      this.isShow = !this.isShow;
    },
    changeToLogin() {
      this.styleObj.bordertoprightradius = "15px";
      this.styleObj.borderbottomrightradius = "15px";
      this.styleObj.bordertopleftradius = "0px";
      this.styleObj.borderbottomleftradius = "0px";
      this.styleObj.rightDis = "0px";
      this.isShow = !this.isShow;
    },
    toback() {
      if (
        !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          this.backEmail
        )
      ) {
        this.$message.error("请输入正确的邮箱");
        return false;
      } else {
        isReg({ email: this.backEmail }).then((res) => {
          if (res.code != 1) {
            this.$message.error("该邮箱未注册");
          } else {
            this.s = false;
            this.timer = setInterval(() => {
              this.time--;
            }, 1000);
            lookBack({ email: this.backEmail }).then(() => {
              this.$message.success("密码已发送到您的邮箱");
            });
          }
        });
      }
    },
    //用户登录
    UserLogin() {
      logIn(this.loginUser).then((res) => {
        if (res.code == "200") {
          localStorage.setItem("token", JSON.stringify(res.token));
          // this.$bus.$emit('letter',res.data.letters)
          //登录成功请求对应数据
          this.$loading();
          getData({ name: "" }).then((data) => {
            this.$loading().close();
            Vue.prototype._userData = data;
            sessionStorage.setItem("_userData", JSON.stringify(data));
            this.$message.success("登录成功！");
            this.$router.push("/manage");
          });
        } else {
          this.$message.error("用户名或密码错误！");
        }
      });

      // else if (res.code == "400") {
      //   this.$message.primary(res.msg);
      // } else if (res.code == "401") {
      //   this.$message.error(res.msg);
      // }
    },
    //获取验证码
    getC() {
      if (this.regUser.email == "") {
        this.$message.error("请先输入邮箱之后再来获取验证码");
        return;
      } else if (
        !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          this.regUser.email
        )
      ) {
        this.$message.error("请输入正确的邮箱");
        return false;
      }
      // 查询邮箱是否被注册
      isReg(this.regUser).then((res) => {
        if (res.code == 1) {
          this.$message.error("该邮箱已被注册");
          return;
        } else {
          getCode(this.regUser);
          //转变样式60s
          this.change = false;
          this.timer = setInterval(() => {
            this.time--;
          }, 1000);
          this.$message.success("验证码已发送至您的邮箱");
        }
      });
    },
    //用户注册
    userRegister() {
      if (this.regUser.regUsername === "") {
        this.$message.error("用户名不能为空！");
        return false;
      } else if (this.regUser.regPwd === "") {
        this.$message.error("密码不能为空！");
        return false;
      } else if (this.regUser.regPwd.length < 8) {
        this.$message.error("密码长度至少8位！");
        return false;
      } else if (this.regUser.regPwd.length > 16) {
        this.$message.error("密码长度最长16位！");
        return false;
      } else if (this.regUser.regPwd != this.regUser.regRePwd) {
        this.$message.error("两次密码输入不同，请检查后重新注册！");
        return false;
      } else if (this.regUser.code === "") {
        this.$message.error("请输入验证码");
        return false;
      } else {
        let user = {};
        user.username = this.regUser.regUsername;
        user.password = this.regUser.regPwd;
        user.code = this.regUser.code;
        user.email = this.regUser.email;
        register(user).then((res) => {
          console.log(res);
          if (res.code == "200") {
            this.$message.success("注册成功，请登录吧！");
            this.regUser = {
              regUsername: "",
              regRePwd: "",
              regPwd: "",
              code: "",
              email: "",
            };
            this.changeToLogin();
          }
          if (res.code == "400") {
            this.$message.error("验证码错误");
            return;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
/* @import '../assets/css/Login.css' */
.base {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/images/bg.jpeg");
  background-size: cover;
  /* background-image: linear-gradient(to right,#b2fefa,#0ed2f7); */
}
.back {
  height: 80px;
  border-radius: 20px;
}
.loginAndRegist {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.remember {
  position: absolute;
  left: 20px;
  bottom: 10px;
  font-size: 10px;
  cursor: pointer;
  color: #ccc;
  z-index: 333;
}
.remember:hover {
  font-weight: 600;
  color: skyblue;
}
.loginArea {
  background-color: rgba(255, 255, 255, 0.8);
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  height: 400px;
  width: 350px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  overflow: hidden;
  font-weight: 600;
}
.registArea {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  height: 400px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.showInfo {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  position: absolute;
  height: 400px;
  width: 350px;
  z-index: 2;
  top: 0;
  right: 0;
  background-image: url("../assets/images/file.jpeg");
  background-size: cover;
}
/* .showInfo:hover{
    background-size: 100%;
    background-position: -50px -50px;
} */
.title {
  width: 70%;
  flex: 1;
  border-bottom: 1px solid skyblue;
  /* #257B5E */
  display: flex;
  align-items: center;
  color: #79abdc;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
}
#aaa {
  transition: 0.3s linear;
}
.pwdArea {
  width: 100%;
  flex: 1.5;
  display: flex;
  flex-direction: column;
  padding-top: 25px;
}
.pwdArea input {
  outline: none;
  height: 30%;
  border-radius: 13px;
  padding-left: 10px;
  font-size: 12px;
  border: 1px solid gray;
}
.pwdArea input:focus {
  border: 2px solid skyblue;
}
.btnArea {
  flex: 0.7;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}
.rigestTitle {
  width: 70%;
  flex: 1;
  color: #79abdc;
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid skyblue;
}
.registForm {
  flex: 2;
  display: flex;
  flex-direction: column;
  /* color: skyblue; */
  font-size: 16px;
  font-weight: 600;
  padding-top: 25px;
}

.registForm input {
  outline: none;
  height: 30%;
  border-radius: 13px;
  padding-left: 10px;
  font-size: 12px;
  border: 1px solid gray;
}
.registForm input:focus {
  border: 2px solid skyblue;
}
#elselect:focus {
  border: 2px solid skyblue;
}
.registBtn {
  flex: 0.7;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  /* border: 1px solid #fff; */
}
</style>
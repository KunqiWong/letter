<template>
  <div class="app-header">
    <div class="app-header-left">
      <p class="app-name" @click="toHome">
        <svg class="iconpark-icon" style="font-size: 35px; padding-right: 5px">
          <use href="#bird"></use>
        </svg>
        信鸽
      </p>
    </div>
    <div class="app-header-right">
      <div class="search-wrapper">
        <input
          class="search-input"
          type="text"
          placeholder="寻觅笔友或寄往远方的信"
          v-model="searchData"
          @keyup.enter="search"
        />
        <svg
          class="iconpark-icon"
          style="color: skyblue; cursor: pointer"
          @click="search"
        >
          <use href="#search"></use>
        </svg>
      </div>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <button class="profile-btn">
            <img :src="user.user_avatar" />
            <span>{{ user.user_nickname }}</span>
          </button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="toHome">主页</el-dropdown-item>
          <el-dropdown-item command="setting">设置</el-dropdown-item>
          <el-dropdown-item command="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="isShow" :close-on-click-modal="false">
      <div class="head">
        <div class="h">头像</div>
        <div>
          <AvatarUploader
            :avatar="user.user_avatar"
            @avatarUrl="getAvatarUrl"
            @deleteAvatar="deleteAvatar"
          ></AvatarUploader>
          <!-- :region="options_OSS.region"
        :accessKeyId="options_OSS.accessKeyId"
        :accessKeySecret="options_OSS.accessKeySecret"
        :bucket="options_OSS.bucket" -->
        </div>
      </div>
      <LetterForm
        :formLabel="operateFormLabel"
        :form="operateForm"
        :sendUser="null"
        ref="form"
        style="padding-top: 50px"
      ></LetterForm>
      <div slot="footer" class="dialog-footer">
        <el-button style="background-color: skyblue; border: 1px solid #fff" type="primary" @click="isShow = false">取消</el-button>
        <el-button style="background-color: skyblue; border: 1px solid #fff" type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LetterForm from "./LetterForm.vue";
import AvatarUploader from "./AvatarUploader.vue";
import { updateAvatar } from "../request/api/data";
export default {
  components: { LetterForm, AvatarUploader },
  data() {
    return {
      isShow: false,
      letterContent: "",
      edit: false,
      // options_OSS: {
      //   region: "oss-cn-chengdu",
      //   accessKeyId: "xxx",
      //   accessKeySecret: "xxx",
      //   bucket: "yimiao-manage",
      // },
      user_avatar: "",
      user: {},
      operateForm: {
        user_id: "",
        user_nickname: "",
        user_tag: "",
        user_avatar: "",
      },
      operateFormLabel: [
        {
          model: "user_nickname",
          label: "昵称",
          type: "input",
        },
        {
          model: "user_tag",
          label: "个性签名",
          type: "input",
        },
      ],
      searchData: "",
    };
  },
  async created() {
    // this.user_avatar = require('@/assets/images/header.jpg')
    await this._userData;
    this.user = this._userData
      ? this._userData
      : JSON.parse(sessionStorage.getItem("_userData"));
    // 初始化表格数据
    this.operateForm.user_id = this.user.user_id;
    this.operateForm.user_tag = this.user.user_tag;
    this.operateForm.user_nickname = this.user.user_nickname;
    this.operateForm.user_avatar = this.user.user_avatar;
  },
  methods: {
    getAvatarUrl(avatarUrl) {
      // console.log("头像url:", avatarUrl);
      // this.user_avatar = avatarUrl;
      this.operateForm.user_avatar = avatarUrl;
    },
    deleteAvatar() {},
    submit() {
      this.isShow = false;
      this.$message.success("修改信息成功");
      //传operateForm数据到后端更新
      updateAvatar(this.operateForm).then(() => {
        //服务端更新后，更新全局数据（监视更新页面数据）
        this._userData = this._userData
          ? this._userData
          : JSON.parse(sessionStorage.getItem("_userData"));
        this._userData.user_nickname = this.operateForm.user_nickname;
        this._userData.user_tag = this.operateForm.user_tag;
        this._userData.user_avatar = this.operateForm.user_avatar;
      });
    },
    handleCommand(command) {
      eval("this." + command + "()");
    },
    logOut() {
      this.$message("您已退出登录");
      localStorage.removeItem("token");
      sessionStorage.removeItem("index");
      sessionStorage.removeItem("_userData");
      this._userData = {};
      this.$router.push("/login");
    },
    toHome() {
      this.$router.push({ path: "/manage/home" });
      this.$bus.$emit("toHome", 0);
    },
    setting() {
      this.isShow = true;
    },
    search() {
      this.$router.push({path:"/manage/search",query: { name: this.searchData } });
    },
  },
  mounted() {},
  // watch: {
  //   _userData: {
  //     handler(newval,oldval) {
  //       console.log(333)
  //       this.user.user_nickname = newval.user_nickname
  //       this.user.user_tag = newval.user_tag
  //       this.user.user_avatar = newval.user_avatar
  //     }
  //   }
  // },
};
</script>

<style lang="less">
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 24px;
  position: relative;

  &-right {
    display: flex;
    align-items: center;
  }

  &-left {
    cursor: pointer;
  }

  &-right button {
    margin-left: 10px;
  }
}

.app-name {
  display: flex;
  // justify-content: flex-start;
  align-items: center;
  color: #79abdc;
  margin: 0;
  font-size: 20px;
  line-height: 24px;
  font-weight: 300;
  letter-spacing: 5px;
  // margin: 0 32px;
}

.search-wrapper {
  border-radius: 20px;
  background-color: var(--search-area-bg);
  padding-right: 12px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 480px;
  color: var(--light-font);
  box-shadow: 0 2px 6px 0 rgba(136, 148, 171, 0.2),
    0 24px 20px -24px rgba(71, 82, 107, 0.1);
  overflow: hidden;
  .iconpark-icon {
    width: 1.2em;
    height: 1.2em;
  }
  .iconpark-icon:hover {
    color: aqua !important;
  }
  .dark & {
    box-shadow: none;
  }
}

.search-input {
  border: none;
  flex: 1;
  outline: none;
  height: 100%;
  padding: 0 20px;
  font-size: 16px;
  background-color: var(--search-area-bg);
  color: var(--main-color);
}

.profile-btn {
  padding: 0;
  border: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-left: 2px solid #ddd;

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 4px;
  }

  span {
    color: var(--main-color);
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
  }
}
.head {
  display: flex;
  align-items: center;
  margin-left: 60px;
  .h {
    margin-right: 20px;
  }
}
</style>
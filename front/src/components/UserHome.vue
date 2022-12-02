<template>
  <div class="mainBodyOfHome">
    <div class="left" :class="{ headTop: !isUser }">
      <el-card class="card">
        <div class="user">
          <img
            :src="user.user_avatar"
            alt=""
            style="cursor: pointer"
            @click="() => (isVisible_previewAvatarDialog = true)"
          />
          <div class="userinfo">
            <p class="name">{{ user.user_nickname }}</p>
            <p class="access">{{ user.user_tag }}</p>
            <el-button
              v-if="!isUser&&!info.isFriend"
              round
              type="primary"
              style="
                background-color: skyblue;
                border: 1px solid #ffffff;
                margin-top: 10px;
              "
              @click="addFriend"
              >+笔友</el-button
            >
          </div>
        </div>
        <div id="letter">
          <div class="state">
            <svg class="iconpark-icon"><use href="#mail"></use></svg>公开信件：
          </div>
          <ul class="list" :class="{ active2: !isUser }">
            <li
              v-for="item in letterPublic"
              :key="item.letter_id"
              @click="read(item)"
              :class="{ active: item.letter_id == num }"
            >
              <div class="liLeft">《{{ item.letter_title }}》</div>
              <div class="liRight" v-show="isUser">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <svg class="iconpark-icon" style="margin-right: 10px">
                      <use href="#more-one"></use>
                    </svg>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-show="item.hidden"
                      @click.native="change(item)"
                      >公开</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-show="!item.hidden"
                      @click.native="change(item)"
                      >隐藏</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="remove(item)"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="openComment(item.letter_id)"
                      >评论</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="liRight" v-show="!isUser">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <svg class="iconpark-icon" style="margin-right: 10px">
                      <use href="#more-one"></use>
                    </svg>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="openComment(item.letter_id)"
                      >评论</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </li>
          </ul>
        </div>
        <div v-show="isUser">
          <div class="state">
            <svg class="iconpark-icon"><use href="#mail"></use></svg>隐私信件：
          </div>
          <ul class="list">
            <li
              v-for="item in letterHidden"
              :key="item.letter_id"
              @click="read(item)"
              :class="{ active: item.letter_id == num }"
            >
              <div class="liLeft">《{{ item.letter_title }}》</div>
              <div class="liRight">
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <svg class="iconpark-icon" style="margin-right: 10px">
                      <use href="#more-one"></use>
                    </svg>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-show="item.isHidden"
                      @click.native="change(item)"
                      >公开</el-dropdown-item
                    >
                    <el-dropdown-item
                      v-show="!item.isHidden"
                      @click.native="change(item)"
                      >隐藏</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="remove(item)"
                      >删除</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click.native="openComment(item.letter_id)"
                      >评论</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </li>
          </ul>
        </div>
      </el-card>
    </div>
    <div class="right">
      <LetterShow :id="letter_id"></LetterShow>
    </div>
    <el-dialog class="header_img" :visible.sync="isVisible_previewAvatarDialog">
      <img width="600" height="600" :src="user.user_avatar" />
    </el-dialog>
  </div>
</template>

<script>
import LetterShow from "./LetterShow.vue";
import { getData } from "../request/api/data";
import { updateBoolean,deleteLetter } from "../request/api/update";
export default {
  name: "Home",
  components: { LetterShow },
  props: ["info"],
  data() {
    return {
      user: {},
      num: "",
      letterPublic: [],
      letterHidden: [],
      currentId: "",
      letter_id: "",
      isVisible_previewAvatarDialog: false,
    };
  },
  created() {
    this.$loading();
    this._userData=this._userData?this._userData:JSON.parse(sessionStorage.getItem("_userData"));
    getData(this.info).then((res) => {
      this.$loading().close();
      if (!res) this.$router.push("/login");
      this.user = res;
      this.currentId = this.user.user_id;
      this.user.letters.forEach((item) => {
        if (!item.isHidden) this.letterPublic.push(item);
        else this.letterHidden.push(item);
      });
      this.letter_id = this.letterPublic[0].letter_id;
      this.num = this.letter_id;
    });
  },
  computed: {
    isUser() {
      // console.log(this._userData.user_id,this.currentId)
      return this._userData.user_id == this.currentId;
    },
  },
  methods: {
    openComment(letterId) {
      this.$router.push({path:"/manage/letter",  query: { id: letterId } });
    },
    change(letter) {
      updateBoolean({
        isHidden: letter.isHidden,
        letter_id: letter.letter_id,
        isRead: ''
      }).then((res) => {
        if (letter.isHidden) {
          letter.isHidden = !letter.isHidden;
          this.letterHidden = this.letterHidden.filter(
            (item) => item.letter_id != letter.letter_id
          );
          this.letterPublic.push(letter);
        } else {
          letter.isHidden = !letter.isHidden;
          this.letterPublic = this.letterPublic.filter(
            (item) => item.letter_id != letter.letter_id
          );
          this.letterHidden.push(letter);
        }
      });
    },
    remove(letter) {
      this.$confirm(`确定要删除《${letter.letter_title}》吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteLetter({ letter_id: letter.letter_id }).then((res) => {
            this.letterHidden = this.letterHidden.filter(
              (item) => item.letter_id != letter.letter_id
            );
            this.letterPublic = this.letterPublic.filter(
              (item) => item.letter_id != letter.letter_id
            );
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    read(item) {
      this.letter_id = item.letter_id;
      this.num = this.letter_id;
    },
    addFriend() {
      let data = {
        user_id:this._userData.user_id,
        user_friends_id:this.user.user_id,
        user_name:this._userData.user_name,
        to_name:this.user.user_name,
        user_avatar:this._userData.user_avatar,
        user_nickname:this._userData.user_nickname
      }
      console.log(data)
      this.$global.sendMsg(data)
      this.$message.success('好友请求已发送')
    }
  },
  watch: {
    info: {
      handler(newval, oldval) {
        this.$loading();
        getData(newval).then((res) => {
          this.$loading().close();
          if (!res) this.$router.push("/login");
          this.user = res;
          this.currentId = res.user_id
          this.letterPublic = [];
          this.letterHidden = [];
          // this.currentId = this.user.id;
          this.user.letters.forEach((item) => {
            if (!item.isHidden) this.letterPublic.push(item);
            else this.letterHidden.push(item);
          });
        });
      },
    },
    // _userData: {
    //   handler(newval,oldval) {
    //     console.log(2)
    //     this.user = newval
    //   }
    // }
  },
};
</script>

<style scoped>
.mainBodyOfHome {
  display: flex;
  width: 100%;
  height: 615px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
}
.headTop {
  padding-top: 20px;
}
.left {
  flex: 1;
}
.right {
  flex: 2;
  margin-left: 20px;
  height: 615px;
}
.right::-webkit-scrollbar {
  display: none;
}
.card {
  display: flex;
  height: 615px;
  flex-direction: column;
  justify-content: space-between;
  border: none;
  box-shadow: none;
  /* transform: translateX(20px);
  border-radius: 20px;
  box-shadow: -7px 10px 5px 5px #ccc; */
}
.left .user {
  display: flex;
  align-items: center;
  height: 200px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.left .user img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 40px;
}
.list {
  overflow-y: scroll;
  overflow-x: hidden;
  border: 3px solid skyblue;
  border-radius: 10px;
  padding: 5px;
  margin: 0 0 20px;
  height: 135px;
}
.list::-webkit-scrollbar {
  display: none;
}
.left .userinfo .name {
  font-size: 32px;
  margin-bottom: 10px;
}
.state {
  display: flex;
  align-items: center;
  color: skyblue;
  margin-bottom: 5px;
  font-size: 15px;
  margin-left: 5px;
}
.state .iconpark-icon {
  width: 1.2em;
  height: 1.2em;
}
.left .userinfo .access,
li {
  display: flex;
  justify-content: space-between;
  color: #999999;
  cursor: pointer;
  font-size: 15px;
  align-items: center;
  border-radius: 5px;
}
.liLeft:hover {
  color: skyblue;
}
.liRight {
  overflow: hidden;
  padding-top: 5px;
}
li .iconpark-icon:hover {
  color: black;
}
li .iconpark-icon {
  width: 2em;
  height: 2em;
}
.active {
  background-color: #ccc;
  color: #79abdc;
}
.active2 {
  height: 300px;
}
.header_img {
  margin-top: -100px;
}
.header_img img {
  margin-left: 58px;
  border-radius: 20px;
}
</style>
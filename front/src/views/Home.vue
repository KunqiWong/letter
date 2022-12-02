<template>
  <div class="mainBody">
    <UserHome :info="{ name: name ,isFriend:true}"></UserHome>
    <div class="aside" ref="aside">
      <div class="change" @click="change">
        <svg ref="img" class="iconpark-icon">
          <use href="#arrow-right"></use>
        </svg>
      </div>
      <div ref="friends">
        <div class="search-wrapper">
          <input
            class="search-input"
            type="text"
            placeholder="搜索笔友"
            v-model="searchData"
          />
          <svg class="iconpark-icon" style="color: skyblue; cursor: pointer">
            <use href="#search"></use>
          </svg>
        </div>
        <div class="friends">
          <div class="banner">
            <svg class="iconpark-icon"><use href="#user"></use></svg>我
          </div>
          <div
            class="user"
            :class="{ bg: id == user.user_id }"
            @click="look(user.user_id, user.user_name)"
          >
            <div class="left">
              <img :src="user.user_avatar" alt="" />
              <div class="name">{{ user.user_nickname }}</div>
            </div>
            <el-tooltip
              class="item"
              effect="light"
              content="给自己写信"
              placement="bottom"
            >
              <svg
                class="iconpark-icon"
                @click.stop="toEdit(user.user_name, user.user_nickname)"
              >
                <use href="#editor"></use>
              </svg>
            </el-tooltip>
          </div>
          <div class="banner">
            <svg class="iconpark-icon"><use href="#user"></use></svg>我的笔友
          </div>
          <div
            class="user"
            v-for="item in user.friends"
            :class="{ bg: id == item.user_id }"
            :key="item.user_id"
            @click="look(item.user_id, item.user_name)"
          >
            <div class="left">
              <img :src="item.user_avatar" alt="" />
              <div class="name">{{ item.user_nickname }}</div>
            </div>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <svg class="iconpark-icon" style="margin-right: 10px">
                  <use href="#more-one"></use>
                </svg>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  @click.native="toEdit(item.user_name, item.user_nickname)"
                  >写信给他/她</el-dropdown-item
                >
                <el-dropdown-item @click.native="remove(item)"
                  >删除笔友</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="写信给他/她"
              placement="bottom"
            >
              <svg
                class="iconpark-icon"
                @click.stop="toEdit(item.name, item.id)"
              >
                <use href="#editor"></use>
              </svg>
            </el-tooltip> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserHome from "../components/UserHome.vue";
import {deleteFriend} from  "../request/api/update";
import Vue from "vue";
export default {
  name: "Home",
  data() {
    return {
      name: "",
      id: "",
      user: {},
      searchData: "",
    };
  },
  components: {
    UserHome,
  },
  async created() {
    await this._userData;
    if (this._userData) {
      this.user = this._userData;
    } else {
      this.user = JSON.parse(sessionStorage.getItem("_userData"));
      this._userData = this.user;
      Vue.prototype._userData = this.user;
    }
    this.id = this.user.user_id;
    this.name = this.user.user_name;
  },
  methods: {
    change() {
      this.$refs.img.classList.toggle("rotate");
      this.$refs.aside.classList.toggle("translate");
      this.$refs.friends.classList.toggle("hidden");
    },
    look(id, name) {
      // console.log(typeof id,name)
      this.id = id;
      this.name = name;
    },
    toEdit(name, nickname) {
      this.$router.push({
        path: "/manage/edit",
        query: { name: name, nickname: nickname },
      });
    },
    remove(item) {
      this.$confirm(`确定要删除笔友${item.user_nickname}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteFriend({user_id:item.user_id,user_friends_id:this.user.user_id}).then(()=>{
            this.user.friends = this.user.friends.filter(x=>{
              console.log(item.user_id!=x.user_id)
              item.user_id != x.user_id
            })
            console.log(this.user.friends)
            this._userData = JSON.parse(JSON.stringify(this.user))
            this.$message.success('删除笔友成功')
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
  // watch: {
  //   _userData: {
  //     handler(newval,oldval) {
  //       // 两种变化情况
  //       // 1.刷新后 _userData会变成undefined (立马监视immediate:true)
  //       // 2.更改信息后
  //       console.log(2)
  //       this.user = newval?newval:oldval
  //     },
  //   }
  // },
};
</script>

<style lang="less" scoped>
.rotate {
  transform: rotate(-180deg);
}
.translate {
  transform: translateX(260px);
  background-color: transparent !important;
  border: none !important;
}
.hidden {
  visibility: hidden;
}
.bg {
  background-color: #ebebeb;
}
.mainBody {
  position: relative;
  display: flex;
  width: 100%;
  height: 615px;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  .aside {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #fff;
    width: 300px;
    height: 615px;
    border: 3px solid skyblue;
    border-radius: 20px;
    overflow: hidden;
    transition: 0.5s ease;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .search-wrapper {
      border: 1.5px solid skyblue;
      border-radius: 10px;
      background-color: var(--search-area-bg);
      margin-left: 30px;
      margin-bottom: 10px;
      height: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 240px;
      color: var(--light-font);
      box-shadow: 0 2px 6px 0 rgba(136, 148, 171, 0.2),
        0 24px 20px -24px rgba(71, 82, 107, 0.1);
      overflow: hidden;
      .iconpark-icon {
        width: 0.9em;
        height: 0.9em;
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
      padding: 0 10px;
      height: 100%;
      font-size: 12px;
      background-color: var(--search-area-bg);
      color: var(--main-color);
    }
    .change {
      padding: 10px;
      background-color: #fff;
      border-bottom-left-radius: 20px;
      cursor: pointer;
      .iconpark-icon {
        transition: 0.5s ease;
        width: 20px;
        height: 20px;
        color: skyblue;
        &:hover {
          color: aqua;
        }
      }
    }
    .banner {
      display: flex;
      align-items: center;
      padding-left: 10px;
      font-weight: 600;
      color: skyblue;
    }
    .user {
      display: flex;
      align-items: center;
      margin-top: 5px;
      border-radius: 10px;
      padding: 5px 0;
      &:hover {
        background-color: #ebebeb;
      }
      .left {
        display: flex;
        align-items: center;
        width: 260px;
        cursor: pointer;
        img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          margin-right: 20px;
          margin-left: 10px;
        }
      }
      .el-dropdown-link {
        .iconpark-icon {
          padding-top: 5px;
          width: 2em;
          height: 2em;
        }
      }
      .iconpark-icon {
        cursor: pointer;
      }
    }
  }
}
</style>
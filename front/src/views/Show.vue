<template>
  <div class="mainBody" ref="body">
    <div class="jump hidden" ref="top">
      回到顶部<svg class="iconpark-icon"><use href="#to-top-one"></use></svg>
    </div>
    <nav class="nav">
      <h3>
        <svg class="iconpark-icon"><use href="#bird"></use></svg>信件展览<svg
          class="iconpark-icon"
          style="transform: rotatey(180deg)"
        >
          <use href="#bird"></use>
        </svg>
      </h3>
      <div class="right">
        <span :class="{ active: left }" @click="toLeft"
          >最热<svg class="iconpark-icon" :class="{ hidden2: !left }">
            <use href="#fire"></use></svg
          ><svg class="iconpark-icon" :class="{ hidden2: left }">
            <use href="#fire-7a87lh75"></use></svg
        ></span>
        <span>|</span>
        <span :class="{ active: !left }" @click="toRight"
          >最新<svg class="iconpark-icon" :class="{ hidden2: !left }">
            <use href="#time"></use></svg
          ><svg class="iconpark-icon" :class="{ hidden2: left }">
            <use href="#time-7a87phkd"></use></svg
        ></span>
        <div class="change" @click="change">
          <el-tooltip
            v-show="sort"
            effect="dark"
            content="降序"
            placement="bottom"
          >
            <svg class="iconpark-icon">
              <use href="#sort-amount-down"></use>
            </svg>
          </el-tooltip>
          <el-tooltip
            v-show="!sort"
            effect="dark"
            content="升序"
            placement="bottom"
          >
            <svg class="iconpark-icon"><use href="#sort-amount-up"></use></svg>
          </el-tooltip>
        </div>
      </div>
    </nav>
    <div class="content">
      <div v-for="item in list" :key="item.letter_id" class="box">
        <div class="top" @click="view(item.letter_id)">
          <h4>{{ item.letter_title }}</h4>
          <span>---致{{ item.to_nickname }}</span>
          <div class="date">{{ item.letter_date1 }}</div>
        </div>
        <div class="info">
          <div class="left" @click="toHome(item.from_name)">
            <img
              class="avatar"
              :src="item.user_avatar"
              width="36"
              height="36"
            />
            <div class="name">{{ item.from_name }}</div>
          </div>
          <div class="right">
            <div class="like" @click="encourage(item)">
              赞
              <svg
                class="iconpark-icon"
                :class="{ hidden2: isGreat(item.letter_id) }"
              >
                <use href="#like"></use>
              </svg>
              <svg
                class="iconpark-icon"
                :class="{ hidden2: !isGreat(item.letter_id) }"
              >
                <use href="#like-74b6dc41"></use>
              </svg>
              ({{ item.letter_likeNum }})
            </div>
            <div class="comment" @click="view(item.letter_id)">
              评论<svg class="iconpark-icon"><use href="#comment"></use></svg
              >({{ item.comments.length }})
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button
        v-if="bottom"
        type="primary"
        round
        size="big"
        style="
          background-color: skyblue;
          border: 1px solid skyblue;
          margin-top: -10px;
          font-weight: 600;
          letter-spacing: 5px;
        "
        @click="loading"
        >点击加载更多<i class="el-icon-refresh"></i
      ></el-button>
      <el-button
        v-else
        type="primary"
        round
        size="big"
        style="
          background-color: skyblue;
          border: 1px solid skyblue;
          margin-top: -10px;
          cursor: default;
          font-weight: 600;
          letter-spacing: 5px;
        "
        >已经到底啦!</el-button
      >
    </div>
  </div>
</template>

<script>
import { getList } from "../request/api/data";
import { getGreat, addGreat, removeGreat } from "../request/api/update";
import Vue from 'vue'
export default {
  name: "Show",
  data() {
    return {
      list: [],
      sort: true,
      left: true,
      page: 0,
      bottom: true,
      greatList: [],
      way: "hot",
    };
  },
  created() {
    this.$loading();
    getList({ way: this.way, page: this.page, sort: this.sort }).then((res) => {
      this.$loading().close();
      if (!res) this.$router.push("/login");
      this.list = res;
      this.page += 1;
    });
    getGreat({ letter: "1" }).then((res) => {
      this.greatList = res;
    });
    
  },
  methods: {
    isGreat(id) {
      // console.log(this.greatList)
      return this.greatList.some((item) => item.letter_id == id);
    },
    loading() {
      this.$loading();
      getList({ way: this.way, page: this.page, sort: this.sort }).then(
        (res) => {
          if (!res) this.$router.push("/login");
          this.$loading().close();
          this.list.push(...res);
          if (res.length < 10) {
            this.bottom = false;
          }
          this.page += 1;
        }
      );
    },
    toLeft() {
      this.left = true;
      console.log(this.left);
      this.page = 0;
      this.way = "hot";
      this.$loading();
      getList({ way: this.way, page: 0, sort: this.sort }).then((res) => {
        this.$loading().close();
        if (!res) this.$router.push("/login");
        this.list = res;
        this.page += 1;
        this.bottom = true;
      });
    },
    toRight() {
      this.left = false;
      console.log(this.left);
      this.page = 0;
      this.way = "time";
      this.$loading();
      getList({ way: this.way, page: 0, sort: this.sort }).then((res) => {
        this.$loading().close();
        if (!res) this.$router.push("/login");
        this.list = res;
        this.page += 1;
        this.bottom = true;
      });
    },
    change() {
      this.sort = !this.sort;
      this.page = 0;
      this.$loading();
      getList({ way: this.way, page: 0, sort: this.sort }).then((res) => {
        this.$loading().close();
        if (!res) this.$router.push("/login");
        this.list = res;
        this.page += 1;
        this.bottom = true;
      });
    },
    view(letter_id) {
      this.$router.push({ path: "/manage/letter", query: { id: letter_id } });
    },
    encourage(x) {
      if (this.isGreat(x.letter_id)) {
        //取消点赞
        removeGreat({ letter_id: x.letter_id }).then(() => {
          //some、filter等都是不改变原数组的
          this.greatList = this.greatList.filter(
            (item) => item.letter_id != x.letter_id
          );
          x.letter_likeNum -= 1;
        });
      } else {
        //点赞
        addGreat({ letter_id: x.letter_id }).then(() => {
          this.greatList.push({ letter_id: x.letter_id });
          x.letter_likeNum += 1;
        });
      }
    },
    toHome(user_name) {
      this.$router.push({ path: "/manage/other", query: { name: user_name } });
    },
  },
  computed: {},
  mounted() {
    this.$refs.body.addEventListener("scroll", () => {
      if (this.$refs.body.scrollTop > this.$refs.body.offsetHeight) {
        this.$refs.top.classList.remove("hidden");
      } else {
        this.$refs.top.classList.add("hidden");
      }
    });
    this.$refs.top.addEventListener("click", () => {
      this.$refs.body.scrollTop = 0;
    });
  },
  //要设置路由缓存
  activated() {
    this.$nextTick(()=>{
      this.$refs.body.scrollTop = this.scrollTop?this.scrollTop:0
    })
  },
  //保存滚动条高度
  beforeRouteLeave(to, from, next) {
    this.$route.meta.savedPosition = {
      x: 0,
      y: this.$refs.body.scrollTop,
    };
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (
      to.path === "/manage/show" &&
      (from.path === "/manage/search" || from.path === "/manage/letter") &&
      to.meta &&
      to.meta.savedPosition
    ) {
      Vue.prototype.scrollTop=to.meta.savedPosition.y;
    }
    next();
  },
};
</script>

<style lang="less" scoped>
.active {
  font-weight: 600;
}
.hidden {
  visibility: hidden;
}
.hidden2 {
  display: none;
}
.jump {
  border: 1px solid skyblue;
  border-radius: 20px;
  width: 90px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: skyblue;
  color: #fff;
  font-size: 13px;
  position: fixed;
  bottom: 40px;
  right: 60px;
  cursor: pointer;
  .iconpark-icon {
    width: 1.2em;
    height: 1.4em;
    // margin-left: 5px;
  }
}
.mainBody {
  width: 100%;
  height: 615px;
  background-color: #fff;
  background-image: url("../assets/images/bg3.jpeg");
  background-size: cover;
  background-position: bottom;
  border-radius: 20px;
  overflow-y: auto; //用auto解决子组件两个滚动条
  /* 子盒子高度也要固定，不然更新评论时会撑开盒子 */
  .nav {
    position: sticky;
    top:0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 50px;
    background-color: skyblue;
    // color: #ccc;
    padding: 0 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    h3 {
      color: #fff;
      letter-spacing: 3px;
      display: flex;
      align-items: center;
      .iconpark-icon {
        width: 1.2em;
        height: 1.2em;
        margin: 3px;
      }
    }
    .right {
      color: #fff;
      display: flex;
      align-items: center;
      .iconpark-icon {
        height: 0.9em;
        margin-left: 3px;
      }
      font-size: 13px;
      cursor: pointer;
      span {
        padding: 0 3px;
        font-size: 15px;
      }
      .change {
        margin-left: 20px;
        .iconpark-icon {
          width: 1.5em;
          height: 1.5em;
        }
      }
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 20px 125px;
    .box {
      text-align: center;
      width: 500px;
      border: 1px solid #ccc;
      background-color: #fff;
      border-radius: 20px;
      padding: 5px 10px;
      margin-bottom: 50px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
      .top {
        cursor: pointer;
        h4 {
          font-size: 30px;
          font-family: "楷体";
          text-align: center;
        }
        text-align: right;
        .date {
          font-size: 12px;
          color: var(--text-minor);
        }
        span {
          font-size: 8px;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-left: 5px;
        .left {
          display: flex;
          align-items: center;
          cursor: pointer;
          .avatar {
            border-radius: 50%;
            margin-right: 10px;
          }
        }
        .right {
          display: flex;
          align-items: center;
          .like {
            display: flex;
            align-items: center;
            margin-right: 20px;
            cursor: pointer;
          }
          .comment {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
        }
      }
    }
  }
  .bottom {
    margin: 0 43.5% 20px;
  }
}
</style>
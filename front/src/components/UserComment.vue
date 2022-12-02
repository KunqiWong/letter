<template>
  <div class="container" style="height: 600px">
    <nav class="nav">
      <h3>评论</h3>
      <p>{{ count }}</p>
      <div class="right">
        <span :class="{ active: left }" @click="toLeft;">最热</span>
        <span>|</span>
        <span :class="{ active: !left }" @click="toRight;">最新</span>
      </div>
    </nav>
    <div class="head">
      <!-- 评论区域如果当前用户有头像则显示头像,没有则显示默认头像 -->
      <!-- <img v-if="picture" :src="`http://` + picture" alt="" /> -->
      <img :src="user.user_avatar" alt="" />
      <!-- 评论框 -->
      <el-input
        class="input"
        maxlength="30"
        show-word-limit
        v-model="primaryComment"
        type="textarea"
        :rows="3"
        placeholder="写下你的评论"
      />
      <!-- 发布按钮 -->
      <button @click="commitComment(primaryComment)">发表评论</button>
    </div>
    <div class="none" v-if="!current.length">暂无评论</div>
    <div v-else class="comment" v-for="item in current" :key="item.comment_id">
      <div class="info">
        <img class="avatar" :src="item.user_avatar" width="36" height="36" />
        <div class="right">
          <div class="name">{{ item.user_nickname }}</div>
          <div class="date">{{ item.comment_date }}</div>
        </div>
      </div>
      <div class="content">{{ item.comment_content }}</div>
      <div class="control">
        <span
          class="like"
          :class="{ active: isGreat(item.comment_id) }"
          @click="likeClick(item)"
        >
          <svg class="iconpark-icon"><use href="#thumbs-up"></use></svg>
          <span class="like-num">{{
            item.comment_like_count > 0
              ? item.comment_like_count + "人赞"
              : "赞"
          }}</span>
        </span>
        <span class="comment-reply" @click="showCommentInput(item)">
          <svg class="iconpark-icon"><use href="#comment"></use></svg>
          <span>评论</span>
        </span>
      </div>
      <div class="reply">
        <div class="item" v-for="reply in item.reply" :key="reply.comment_id">
          <div class="reply-content">
            <span class="from-name">{{ reply.user_nickname }}</span
            ><span>&nbsp;&nbsp;:&nbsp;</span>
            <span class="to-name">@{{ reply.to_user_nickname }}</span>
            <span>{{ reply.comment_content }}</span>
          </div>
          <div class="reply-bottom">
            <span>{{ reply.comment_date }}</span>
            <span
          class="like"
          :class="{ active: isGreat(reply.comment_id) }"
          @click="likeClick(reply)"
          style="margin-left:20px"
        >
          <svg class="iconpark-icon"><use href="#thumbs-up"></use></svg>
          <span class="like-num">{{
            reply.comment_like_count > 0
              ? reply.comment_like_count + "人赞"
              : "赞"
          }}</span>
        </span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <svg class="iconpark-icon"><use href="#comment"></use></svg>
              <span>评论</span>
            </span>
          </div>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-show="showItemId === item.comment_id">
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
                @click="cancel"
                style="background-color: skyblue; border: 1px solid #fff"
                >取消</el-button
              >
              <el-button
                class="btn"
                type="primary"
                round
                @click="commitComment(inputComment, item)"
                style="background-color: skyblue; border: 1px solid #fff"
                >确定</el-button
              >
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 页码 -->
    <div style="text-align: center; padding: 15px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pages * 10"
        :current-page="page"
        @current-change="changePage"
        :page-size="10"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
import { getLetter } from "../request/api/data";
import { commit } from "../request/api/comment";
import { getGreat, addGreat, removeGreat } from "../request/api/update";
// import sort from './mixins/sort'
export default {
  // props: {
  //   comments: {
  //     type: Array,
  //     required: true
  //   }
  // },
  // mixins:[sort],
  data() {
    return {
      primaryComment: "",
      inputComment: "",
      showItemId: "",
      comments: [],
      current: [],
      pages: 10,
      page: 1,
      count: 0,
      left: true,
      letter: {},
      user: {},
      greatList: [],
    };
  },
  props: ["id"],
  async created() {
    await this._userData;
    this.user = this._userData
      ? this._userData
      : JSON.parse(sessionStorage.getItem("_userData"));
    const res = await getLetter({ letter_title: "", letter_id: this.id });
    this.greatList = await getGreat({ comment: "2" });
    this.bug = await getGreat({ comment: "2" });
    if (res) {
      this.letter = res[0];
      this.comments = this.letter.comments;
      this.pages = Math.ceil(this.comments.length / 10);
      this.current = this.comments.slice(0, 10);
      this.comments.forEach((item) => {
        this.count += item.reply.length + 1;
      });
    }
    console.log(res)
  },
  computed: {
    toLeft() {
      this.left = true;
      this.comments = this.comments.sort((a, b) => b.comment_like_count - a.comment_like_count);
    },
    toRight() {
      this.left = false;
      this.comments = this.comments.sort((a, b) => b.comment_time - a.comment_time);
    },
    change() {},
  },
  methods: {
    isGreat(id) {
      return this.greatList.some((item) => item.comment_id == id);
    },
    /**
     * 点赞
     */
    likeClick(item) {
      if (!this.isGreat(item.comment_id)) {
        addGreat({ comment_id: item.comment_id }).then(() => {
          // push不改变原数组，返回值为其长度
          this.greatList.push({ comment_id: item.comment_id });
          item.comment_like_count += 1;
        });
      } else {
        removeGreat({ comment_id: item.comment_id }).then(() => {
          this.greatList = this.greatList.filter(
            (x) => x.comment_id != item.comment_id
          );
          item.comment_like_count -= 1;
        });
      }
      // addGreat,removeGreat
      // if (item.isLike === null) {
      //   Vue.$set(item, "isLike", true);
      //   item.likeNum++;
      // } else {
      //   if (item.isLike) {
      //     item.likeNum--;
      //   } else {
      //     item.likeNum++;
      //   }
      //   item.isLike = !item.isLike;
      // }
    },

    /**
     * 点击取消按钮
     */
    cancel() {
      this.showItemId = "";
    },

    /**
     * 提交评论
     */
    commitComment(content, item) {
      if (content) {
        let temp = {};
        temp.comment_id = new Date().getTime() + this.user.user_name;
        temp.user_id = this.user.user_id;
        temp.letter_id = this.id;
        temp.comment_like_count = 0;
        temp.comment_date = new Date().toLocaleString().replace(/\//g, "-");
        temp.comment_content = content;
        temp.parent_comment_id = item ? item.comment_id : "";
        temp.comment_time = new Date().getTime();
        temp.to_user_nickname = item
          ? item.user_nickname
          : this.letter.from_nickname;
        temp.user_avatar = this.user.user_avatar;
        temp.user_name = this.user.user_name;
        temp.user_nickname = this.user.user_nickname;
        temp.to_user_name = item ? item.user_name : this.letter.to_name;
        commit(temp);
        if (item) {
          this.comments.forEach((x) => {
            if (x.comment_id == item.comment_id) {
              x.reply.unshift(temp);
            }
          });
          this.inputComment = "";
        } else {
          this.comments.unshift(temp);
          this.primaryComment = "";
          this.page = 1;
        }
        this.count++;
      }
    },

    /**
     * 点击评论按钮显示输入框
     * item: 当前大评论
     * reply: 当前评论的评论
     */
    showCommentInput(item, reply) {
      // if (reply) {
      //   this.inputComment = "@" + reply.user_nickname + " ";
      // } else {
        this.inputComment = "";
      // }
      this.showItemId = item.comment_id;
    },
    changePage(page) {
      this.current = this.comments.slice((page - 1) * 10, page * 10);
      this.page = page;
    },
  },
  watch: {
    //监听页面变化，进行分页
    comments: {
      handler(newval, oldval) {
        this.pages = Math.ceil(newval.length / 10);
        this.current = newval.slice(0, 10);
        this.showItemId = "";
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="less">
.active {
  color: #000;
  font-weight: 600;
}
.none {
  margin: 20px 45%;
  font-size: 20px;
  letter-spacing: 2px;
}
.container {
  padding: 0 10px;
  box-sizing: border-box;
  width: 90%;
  height: 100%;
  margin: 0 auto;
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 150px;
    color: #ccc;
    padding: 10px 0;
    h3 {
      color: #000;
    }
    p {
      margin-left: -20px;
    }
    .right {
      font-size: 13px;
      cursor: pointer;
      span {
        padding: 0 3px;
      }
    }
  }
  .head {
    // background-color: rgb(248, 248, 248);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-radius: 10px;
  }
  .head img {
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }
  /* 评论框 */
  .head .input {
    width: 82%;
  }
  /* 发布评论按钮 */
  .head button {
    width: 120px;
    height: 48px;
    border: 0;
    border-radius: 5px;
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    background-color: rgb(118, 211, 248);
    cursor: pointer;
    letter-spacing: 2px;
  }
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid var(--border-fourth);
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: var(--text-main);
          margin-bottom: 5px;
          font-weight: 500;
        }
        .date {
          font-size: 12px;
          color: var(--text-minor);
        }
      }
    }
    .content {
      font-size: 16px;
      color: var(--text-main);
      line-height: 20px;
      padding: 10px 0;
    }
    .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active,
        &:hover {
          color: var(--color-main);
          font-weight: normal;
        }
      }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--text-minor);
      
      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          color: var(--color-main);
        }
      }
    }
    .reply {
      margin: 10px 0;
      border-left: 2px solid var(--border-first);
      .item {
        margin: 0 10px;
        padding: 10px 0;
        border-bottom: 1px dashed var(--border-third);
        .reply-content {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--text-main);
          .from-name {
            color: var(--color-main);
          }
          .to-name {
            color: var(--color-main);
            margin-left: 5px;
            margin-right: 5px;
          }
        }
        .reply-bottom {
          display: flex;
          align-items: center;
          margin-top: 6px;
          font-size: 12px;
          color: var(--text-minor);
          .reply-text {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            &:hover {
              color: var(--color-main);
            }
            .icon-comment {
              margin-right: 5px;
            }
          }
        }
      }
      .write-reply {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--text-minor);
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: var(--color-main);
        }
        .el-icon-edit {
          margin-right: 5px;
        }
      }
      .fade-enter-active,
      fade-leave-active {
        transition: opacity 0.5s;
      }
      .fade-enter,
      .fade-leave-to {
        opacity: 0;
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
    }
  }
}
</style>
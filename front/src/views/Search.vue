<template>
  <div class="mainBody">
    <div
      class="back"
      @click="
        () => {
          this.$router.go(-1);
        }
      "
    >
      <svg class="iconpark-icon"><use href="#back"></use></svg>返回上一页
    </div>
    <div class="content">
      <div class="l">
        <div class="title">信件</div>
        <div v-for="item in list" :key="item.letter_id" class="box">
        <div class="top" @click="view(item.letter_id)">
          <h4 v-html="item.letter_title"></h4>
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
      <div class="r">
        <div class="title">用户</div>
         <div
            class="user"
            v-for="item in userlist"
            :key="item.user_id"
            @click="toHome(item.user_name)"
          >
            <div class="left">
              <img :src="item.user_avatar" alt="" />
              <div class="name" v-html="item.user_nickname"></div>
            </div>
            <el-button
              round
              type="primary"
              style="
                background-color: skyblue;
                border: 1px solid skyblue;
              "
              @click.stop="addFriend(item)"
              >+笔友</el-button
            >
          </div>
      </div>
    </div>
    <div class="column"></div>
  </div>
</template>

<script>
import UserHome from "../components/UserHome.vue";
import { getUser } from "../request/api/data";
import { getLetter } from "../request/api/data";
import { getGreat,addGreat,removeGreat } from "../request/api/update";
export default {
  name: "Other",
  components: { UserHome },
  data() {
    return {
      list: [],
      userlist: [],
      greatList:[],
      key:'',
      user:{}
    };
  },
  async created() {
    await this._userData
    this.key = this.$route.query.name
    this.user=this._userData?this._userData:JSON.parse(sessionStorage.getItem('_userData'))
    let res = await getLetter({ 'letter_title': this.key, 'id': "" });
    let re = await getUser({ 'user_nickname': this.key});
    this.greatList = await getGreat({letter:"1"})
    if(!res&&!re) this.$router.push('/login')
    this.list = res;
    if(re) this.userlist = re;
    //对关键字高亮
    this.highlight()
  },
  methods: {
    view(letter_id) {
      this.$router.push({ path: "/manage/letter", query: { id: letter_id } });
    },
    toHome(user_name) {
      this.$router.push({ path: "/manage/other", query: { name: user_name } });
    },
    highlight() {
      if(this.list) {
        this.list.forEach(item=>{
          item.letter_title=item.letter_title.replace(this.key,`<span style="color:skyblue">${this.key}</span>`) 
        })
        this.list.sort((a,b)=>a.letter_title.length-b.letter_title.length)
      }
      if(this.userlist) {
        this.userlist.forEach(item=>{
          item.user_nickname=item.user_nickname.replace(this.key,`<span style="color:skyblue">${this.key}</span>`) 
        })
        this.userlist.sort((a,b)=>a.user_nickname.length-b.user_nickname.length)
      }
    },
    addFriend(item) {
      let data = {
        user_id: this.user.user_id,
        user_friends_id: item.user_id,
        user_name: this.user.user_name,
        to_name: item.user_name,
        user_avatar: this.user.user_avatar,
        user_nickname: this.user.user_nickname
      }
      console.log(data)
      this.$global.sendMsg(data)
      this.$message.success('好友请求已发送')
    },
    isGreat(id) {
      return this.greatList.some((item) => item.letter_id == id);
    },
     encourage(x) {
      if (this.isGreat(x.letter_id)) {
        //取消点赞
        removeGreat({letter_id:x.letter_id}).then(()=>{
          //some、filter等都是不改变原数组的
          this.greatList = this.greatList.filter(item=>item.letter_id!=x.letter_id)
          x.letter_likeNum-=1
        })
      } else {
        //点赞
        addGreat({letter_id:x.letter_id}).then(()=>{
          this.greatList.push({letter_id:x.letter_id})
          x.letter_likeNum+=1
        })
      }
    },
  },
  watch: {
    '$route': async function(to, from) {
      //这样就可以获取到变化的参数了，然后执行参数变化后相应的逻辑就行了
      // console.log(this.$route.query)
      this.key = this.$route.query.name
      let res = await getLetter({ 'letter_title': this.key, 'id': "" });
      let re = await getUser({ 'user_nickname': this.key});
      if(!res&&!re) this.$router.push('/login')
      this.list = res;
      if(re) this.userlist = re;
      //对关键字高亮
      this.highlight()
    }
  }
};
</script>

<style lang="less" scoped>
.hidden2 {
  display: none;
}
.column {
  height: 70vh;
  width: 5px;
  background-color: skyblue;
}
.mainBody {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 615px;
  background-color: #fff;
  border-radius: 20px;
  overflow-y: scroll;
  .back {
    position: fixed;
    left: 90px;
    top: 90px;
    display: flex;
    align-items: flex-end;
    font-weight: 600;
    color: skyblue;
    .iconpark-icon {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    cursor: pointer;
  }
  .content {
    display: flex;
    width: 1200px;
    margin-top: 70px;
    // background-color: yellow;
    .l {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
      flex: 1;
      border-right: 5px solid skyblue;
      .title {
        width: 100%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        // padding-right: 100px;
        font-weight: 600;
        font-size: 30px;
        letter-spacing: 5px;
        background-color: skyblue;
        color: #fff;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
        margin-bottom: 20px;
        margin-right: -1px;
      }
      .box {
        text-align: center;
        width: 500px;
        border: 1px solid black;
        border-radius: 20px;
        padding: 5px 10px;
        margin-bottom: 50px;
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
      .r {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        .title {
        width: 100%;
        text-align: center;
        height: 50px;
        line-height: 50px;
        // padding-right: 100px;
        font-weight: 600;
        font-size: 30px;
        letter-spacing: 5px;
        background-color: skyblue;
        color: #fff;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        margin-bottom: 20px;
        // margin-right: -1px;
      }
      .user {
      display: flex;
      align-items: center;
      margin-top: 5px;
      border-radius: 10px;
      padding: 5px 0;
      font-size: 20px;
      
      &:hover {
        background-color: #ebebeb;
      }
      .left {
        display: flex;
        align-items: center;
        width: 260px;
        cursor: pointer;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 20px;
          margin-left: 10px;
        }
      }
      .iconpark-icon {
        cursor: pointer;
      }
    }
      }
  }
}
</style>
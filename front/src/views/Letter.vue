<template>
  <div class="mainBody" ref="body">
    <div class="back" @click="back"><svg class="iconpark-icon"><use href="#back"></use></svg>返回上一页</div>
    <div class="top hidden" ref="top">回到顶部<svg class="iconpark-icon"><use href="#to-top-one"></use></svg></div>
    <div class="content">
      <LetterShow :id="id" class="letter"></LetterShow>
    </div>
    <UserComment :id="id" class="comment"></UserComment>
  </div>
</template>

<script>
import UserComment from "../components/UserComment.vue";
import LetterShow from "../components/LetterShow.vue";
export default {
  name: "Show",
  components: { UserComment, LetterShow },
  data() {
    return {
      id: '',
    };
  },
  created() {
    this.id = this.$route.query.id;
    console.log(this.id)
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  },
  mounted() {
    this.$refs.body.addEventListener('scroll',()=>{
    if(this.$refs.body.scrollTop>this.$refs.body.offsetHeight) {
      this.$refs.top.classList.remove('hidden')
    } else {
      this.$refs.top.classList.add('hidden')
    }
    })
    this.$refs.top.addEventListener('click',()=>{
      this.$refs.body.scrollTop = 0
    })
  },
};
</script>

<style lang="less" scoped>
.hidden {
  visibility: hidden;
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
  .top {
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
    right: 70px;
    cursor: pointer;
    .iconpark-icon {
      width: 1.2em;
      height: 1.4em;
      // margin-left: 5px;
    }
  }
  .content {
    width: 950px;
    height: 1300px;
    border-radius: 20px;
    // background: white;
    margin-top: 20px;
    
    .letter {
      height: 125vh;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
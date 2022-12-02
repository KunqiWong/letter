<template>
  <div class="mainBody">
    <div class="back" @click="()=>{this.$router.back(-1)}"><svg class="iconpark-icon"><use href="#back"></use></svg>返回上一页</div>
    <UserHome :info='info'></UserHome>
  </div>
</template>

<script>
import UserHome from "../components/UserHome.vue";
export default {
  name: "Other",
  components: { UserHome },
  data() {
    return {
        info:{
          name:''
        },
    }
  },
  created() {
    this.info.name = this.$route.query.name
    // console.log(this.$route.query)
  },
};
</script>

<style lang="less" scoped>
.mainBody {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 615px;
  background-color: #fff;
  border-radius: 20px;
  .back {
    position: absolute;
    left: 5px;
    top: 5px;
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
}
</style>
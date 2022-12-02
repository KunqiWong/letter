<template>
  <el-container class="h">
    <el-header class="el-header">
      <UserHeader></UserHeader>
    </el-header>
    <el-container>
      <el-aside width="60px">
        <LeftNavBar></LeftNavBar>
      </el-aside>
      <el-main>
        <!-- 设置路由缓存 -->
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import LeftNavBar from "../components/LeftNavBar";
import UserHeader from "../components/UserHeader";
export default {
  name: "Manage",
  components: { LeftNavBar, UserHeader },
  data() {
    return {};
  },
  created() {
  },
  mounted() {},
};
</script>

<style scoped>
.el-header {
  padding: 0;
}
.h {
  height: 100vh;
}
</style>
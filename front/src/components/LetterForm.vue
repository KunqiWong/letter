<template>
 <div style="position:relative;">
   <div v-if="nickname" class="nickname">
    <slot name="nickname"></slot>
    </div>
  <el-form
    class="form"
    ref="form"
    label-width="100px"
    :model="form"
  >
    <el-form-item
      v-for="item in formLabel"
      :key="item.label"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        :placeholder="'请输入' + item.label"
        v-model="form[item.model]"
      >
      </el-input>
      <el-switch
        v-if="item.type === 'switch'"
        v-model="form[item.model]"
        active-color='skyblue'
      ></el-switch>
      <div v-if="item.type === 'date'">
        <el-col :span="11">
          <el-date-picker
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            v-model="form.letter_date1"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2"
          >&nbsp;&nbsp;&nbsp;&nbsp;-</el-col
        >
        <el-col :span="11">
          <el-time-picker
            placeholder="选择时间"
            value-format='HH:mm:ss'
            v-model="form.letter_date2"
            style="width: 100%"
          ></el-time-picker>
        </el-col>
      </div>
      <el-select
        v-if="item.type === 'select'"
        placeholder="请选择"
        v-model="form[item.model]"
      >
        <el-option
          v-for="item in item.opts"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
 </div>
</template>

<script>
export default {
  name: "Form",
  data() {
    return {
      user:{}
    }
  },
  props: {
    formLabel: Array,
    form: Object,
    nickname: String,
  },
  created() {
    
  }
};
</script>

<style lang="less" scoped>
.nickname {
  position: absolute;
  left: 100px;
  top: 0;
  padding-top: 3px;
  background-color: #fff;
  width: 300px;
  height: 30px;
  z-index: 2;
}

</style>
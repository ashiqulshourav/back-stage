<template>
  <el-tabs tab-position="top" class="custom_input" type="border-card">
    <el-tab-pane label="中文">
      <el-input v-model="chineseTxt" />
    </el-tab-pane>
    <el-tab-pane label="English">
      <el-input />
    </el-tab-pane>
    <el-tab-pane label="French">
      <el-input />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
const chineseTxt = ref();
</script>

<style scoped lang="scss">
.custom_input {
  border: none !important;
  :deep() {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__item {
      height: 32px;
    }
    .el-tabs__nav-scroll {
      height: 32px;
    }
    .el-tabs__nav-wrap {
      &:after {
        display: none;
      }
    }
    .el-tabs__content {
      padding: 0 !important;
    }
    .el-tabs__header {
      border-bottom: none !important;
      border-top: 1px solid var(--el-border-color-light);
      border-left: 1px solid var(--el-border-color-light);
    }
  }
}
</style>

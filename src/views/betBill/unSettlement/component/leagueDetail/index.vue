<template>
<div>
  <div class="text-2xl text-black font-bold">
    盘口详情
  </div>
  <div class="grid grid-cols-4 gap-2 mt-4">
    <div class="item">
      <div class="prop">赛事ID</div>
      <div class="value">455213123457</div>
    </div>
    <div class="item">
      <div class="prop">联 赛</div>
      <div class="value">WTA华新公开赛-女单</div>
    </div>
    <div class="item">
      <div class="prop">开赛时间</div>
      <div class="value">2024-0203 18:00:00</div>
    </div>
    <div class="item">
      <div class="prop">盘口状态</div>
      <div class="value">已开赛</div>
    </div>
    <div class="item">
      <div class="prop">赛种</div>
      <div class="value">网球</div>
    </div>
    <div class="item">
      <div class="prop">比赛方</div>
      <div class="value">王欣 vs 小鸟菜菜绪</div>
    </div>
    <div class="item">
      <div class="prop">结算人员</div>
      <div class="value">Bai Bai</div>
    </div>
    <div class="item">
      <div class="prop">赛事状态</div>
      <div class="value">全场结算</div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">

</script>
<style scoped>
  .item {
    display: flex;
    gap: 0.5rem;
    color: var(--el-text-color-regular);
  }
  .item .prop {
    width: 25%;
    text-align: justify;
    position: relative;
  }
  .prop::after {
    content: ":";
    position: absolute;
    right: 0;
  }
</style>
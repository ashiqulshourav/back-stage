<template>
  <IconifyIconOffline
    @click="changeType"
    :class="['text-[#A8ABB2]']"
    icon="trading_play"
  />
  <IconifyIconOffline
    @click="changeType"
    :class="['text-[#A8ABB2] text-sm ml-2 mr-2']"
    icon="trading_switch"
  />
  <IconifyIconOffline
    @click="changeType"
    :class="['text-[#409EFF] text-sm mr-2']"
    icon="trading_pause"
  />
  <IconifyIconOffline
    @click="changeType"
    :class="['text-[#409EFF]']"
    icon="trading_lock"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  typeNum?: number | null;
}>();

const changeType = () => {
  console.log('IconGroup.vue文件 30==============行打印=', 111);
};
</script>

<style scoped></style>

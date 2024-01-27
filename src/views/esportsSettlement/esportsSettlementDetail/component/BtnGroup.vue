<template>
  <el-radio-group class="mt-2" v-model="currentIndex" @change="changeIndex">
    <el-radio-button
      :label="index"
      v-for="(item, index) in keyList"
      :key="index"
      >{{ NAV_TITLE_NAME[item] }}</el-radio-button
    >
  </el-radio-group>
</template>

<script setup lang="ts">
import { NAV_TITLE_NAME } from '../utils/map';
const currentIndex = ref(0);
const emits = defineEmits(['changeIndex']);

defineProps<{
  keyList: string[];
}>();

const changeIndex = index => emits('changeIndex', index);
</script>

<style scoped></style>

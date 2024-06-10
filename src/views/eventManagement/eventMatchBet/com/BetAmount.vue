<template>
  <div class="relative h-[110px] bg-white dark:bg-transparent">
    <div
      class="absolute w-[1px] h-full left-[45.45%] translate-x-[-50%] bg-[#dcdfe6] dark:bg-[#363536]"
    ></div>
    <div
      class="w-full absolute bottom-[10px] -translate-y-1/2 bg-[#D9D9D9] dark:bg-[#676877] h-[1px]"
    ></div>

    <div
      v-for="(item, index) in renderList"
      :key="index"
      class="absolute bottom-[14px] cursor-pointer px-[2px] w-[1%] h-[80%] flex items-end"
      :style="{
        left: `${index}%`
      }"
    >
      <el-tooltip placement="top-start">
        <template #content>
          <div class="flex flex-col text-xs">
            <span> {{ t('比赛进行时间') }}: {{ index }}{{ t('分') }} </span>
            <span> {{ t('注单数量') }}:{{ item }} </span>
          </div>
        </template>
        <div
          v-if="item > 0"
          class="bg-[#BEDAFF] dark:bg-[#eeb683] w-full ease-in-out duration-500 transition-all"
          :style="{
            height: convertToPercentage(item, maxNum) + '%'
          }"
        ></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
const props = defineProps<{
  renderList: number[];
}>();

const maxNum = computed(() => {
  return Math.max(...props.renderList);
});

const convertToPercentage = (value: number, base: number) => {
  return (value / base) * 100;
};
</script>

<style scoped></style>

<template>
  <div class="relative h-[140px] bg-white dark:bg-transparent">
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
        left: `${index + 1}%`
      }"
    >
      <el-tooltip placement="top-start" v-if="item > 0">
        <template #content>
          <div class="flex flex-col text-xs">
            <span> {{ t('比赛进行时间') }}: {{ index + 1 }}{{ t('分') }} </span>
            <span> {{ t('注单数量') }}:{{ item }} </span>
          </div>
        </template>
        <div
          class="bg-[#BEDAFF] dark:bg-[#eeb683] w-full ease-in-out duration-500 transition-all"
          :style="{
            height: convertToPercentage(item, maxNum) + '%'
          }"
          @click="showBetDetail(index + 1)"
        ></div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addDialog, closeDialog } from '@/components/ReDialog';
import { t } from '@/plugins/i18n';
import BetList from './BetList.vue';
const props = defineProps<{
  renderList: number[];
  matchId: number | string;
}>();

const maxNum = computed(() => {
  return Math.max(...props.renderList);
});

const convertToPercentage = (value: number, base: number) => {
  return (value / base) * 100;
};

const showBetDetail = (i: number) => {
  addDialog({
    class: 'reset_dialog',
    width: '80%',
    center: true,
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: ({ options, index }) =>
      h(BetList, {
        index: i,
        matchId: props.matchId,
        onCloseDialog: (_: boolean) => {
          closeDialog(options, index);
        }
      })
  });
};
</script>

<style scoped></style>

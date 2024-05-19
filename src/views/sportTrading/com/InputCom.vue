<template>
  <div
    class="w-1/5 text-center input_wrapper"
    @mouseenter="e => mouseEvent(e, renderData, 'enter')"
    @mouseleave="e => mouseEvent(e, renderData, 'leave')"
  >
    <div
      v-if="s.sourceBetItemsId !== 1"
      class="min-w-[120px] text-[--el-color-primary] text-left"
    >
      {{ renderData.dpOdds?.toFixed(2) }}
    </div>
    <div
      v-else
      class="text-[--el-color-primary] flex justify-start cursor-pointer relative"
    >
      <div class="w-[120px] flex justify-start">
        <el-input-number
          class="!w-[70px]"
          size="small"
          :step="0.01"
          v-model="renderData.dpOdds"
          controls-position="right"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { subtraction, addition } from '@pureadmin/utils';
const emits = defineEmits(['changeMouse']);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
}>();

const renderData = reactive<sportTradingDataAPI.BetItemsDtoList>(props.s);

watch(
  () => props.selectNum,
  v => {
    if (props.selectItem.betItemsId === renderData.betItemsId) {
      if (v > 0) {
        renderData.dpOdds = addition(renderData.dpOdds, v, 2);
      } else {
        renderData.dpOdds = subtraction(renderData.dpOdds, v, 2);
      }
    }
  }
);

//- 鼠标滑入交互处理
const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave'
) => {
  emits('changeMouse', e, s, type);
  //- reload页面
};
</script>

<style lang="scss">
.el-input-number.is-controls-right .el-input__wrapper {
  padding-left: 10px !important;
  padding-right: 30px !important;
}
</style>

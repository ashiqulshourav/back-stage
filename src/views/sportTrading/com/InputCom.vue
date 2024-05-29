<template>
  <div
    class="w-1/4 text-center input_wrapper relative h-full"
    @mouseenter.stop="e => mouseEvent(e, props.s, 'enter')"
    @mouseleave.stop="e => mouseEvent(e, props.s, 'leave')"
  >
    <div
      v-if="showNum"
      :class="[
        'min-w-[120px] text-[--el-color-primary] text-left h-full flex items-center',
        saleStatus !== 2 && 'text-[--el-color-info]'
      ]"
    >
      {{ s.dpOdds?.toFixed(2) }}
    </div>
    <div
      v-else
      class="text-[--el-color-primary] flex justify-start cursor-pointer h-full relative"
    >
      <div class="w-[120px] flex justify-start items-center h-full">
        <el-input-number
          class="!w-[70px]"
          size="small"
          :step="0.01"
          @change="changeDpOdds"
          v-model="s.dpOdds"
          controls-position="right"
        />
      </div>
    </div>
    <div
      v-if="s.odds !== s.dpOdds"
      class="absolute right-0 top-1/2 translate-y-[-50%] w-[60px] text-xs text-white"
      :style="{ backgroundColor: `var(${tipData.color})` }"
    >
      {{ tipData.val }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { subtraction, addition } from '@pureadmin/utils';
import { debounce } from '@pureadmin/utils';
import { hasAuth } from '@/router/utils';

const emits = defineEmits(['changeMouse', 'changeSelectNum']);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  saleStatus: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
}>();

const showNum = ref(true);

watch(
  () => props.s,
  d => {
    showNum.value = d.sourceBetItemsId !== 1;
  },
  {
    deep: true
  }
);

watch(
  () => props.selectNum,
  v => {
    if (props.selectItem.betItemsId === props.s.betItemsId) {
      if (v > 0) {
        props.s.dpOdds = addition(props.s.dpOdds, v, 2);
      } else if (v < 0) {
        props.s.dpOdds = subtraction(props.s.dpOdds, Math.abs(v), 2);
      }
    }
  }
);
const changeDpOdds = debounce((v: number) => {
  const n: number = subtraction(v, props.selectItem.dpOdds, 2);
  emits('changeSelectNum', n);
}, 500);

const tipData = computed(() => {
  return {
    val: `${props.s.dpOdds > props.s.odds ? '+' : '-'}${Math.abs(
      subtraction(Math.abs(props.s.dpOdds), Math.abs(props.s.odds), 2)
    )}`,
    color:
      props.s.dpOdds > props.s.odds
        ? '--el-color-success-light-3'
        : '--el-color-danger-light-3'
  };
});

//- 鼠标滑入交互处理
const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave'
) => {
  if (!hasAuth('CHANGE_ODDS') || props.saleStatus !== 2) return;
  emits('changeMouse', e, s, type);
};
</script>

<style lang="scss">
.el-input-number.is-controls-right .el-input__wrapper {
  padding-left: 10px !important;
  padding-right: 30px !important;
}
</style>

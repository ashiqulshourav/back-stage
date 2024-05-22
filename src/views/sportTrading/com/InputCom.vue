<template>
  <div
    class="w-1/5 text-center input_wrapper relative"
    @mouseenter.stop="e => mouseEvent(e, props.s, 'enter')"
    @mouseleave.stop="e => mouseEvent(e, props.s, 'leave')"
  >
    <div
      v-if="showNum"
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
          @change="changeDpOdds"
          v-model="renderData.dpOdds"
          controls-position="right"
        />
      </div>
    </div>
    <div
      v-if="renderData.odds !== renderData.dpOdds"
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

const emits = defineEmits(['changeMouse', 'changeSelectNum']);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
}>();

const showNum = ref(true);
watch(
  () => props.s,
  d => (showNum.value = d.sourceBetItemsId !== 1),
  {
    deep: true
  }
);

const renderData = reactive<sportTradingDataAPI.BetItemsDtoList>(props.s);

watch(
  () => props.selectNum,
  v => {
    if (props.selectItem.betItemsId === props.s.betItemsId) {
      if (v > 0) {
        renderData.dpOdds = addition(renderData.dpOdds, v, 2);
      } else if (v < 0) {
        renderData.dpOdds = subtraction(renderData.dpOdds, Math.abs(v), 2);
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
    val: `${renderData.dpOdds > renderData.odds ? '+' : '-'}${Math.abs(
      subtraction(renderData.dpOdds, Math.abs(renderData.odds))
    )}`,
    color:
      renderData.dpOdds > renderData.odds
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

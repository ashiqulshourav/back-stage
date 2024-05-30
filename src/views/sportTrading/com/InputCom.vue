<template>
  <div
    class="w-1/4 text-center input_wrapper relative h-full input_container"
    @mouseenter.stop="e => mouseEvent(e, props.s, 'enter')"
    @mouseleave.stop="e => mouseEvent(e, props.s, 'leave')"
  >
    <div
      v-if="showNum"
      :class="[
        'min-w-[120px] text-[--el-color-primary] text-left h-full flex items-center',
        saleStatus !== 2 && 'text-[#909399]'
      ]"
    >
      {{ s.dpOdds?.toFixed(2) }}
    </div>
    <div
      v-else
      class="text-[--el-color-primary] flex justify-start cursor-pointer h-full relative"
    >
      <div class="w-[120px] flex justify-start items-center h-full">
        <!-- :min="-0.99"
          :max="0.99" -->
        <el-input-number
          class="!w-[70px]"
          size="small"
          :step="0.01"
          @focus="inputFoucs(true)"
          controls-position="right"
          v-model="inputCom"
          @change="changeDpOdds"
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

const emits = defineEmits([
  'changeMouse',
  'changeSelectNum',
  'showShortcutContainer'
]);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  saleStatus: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
}>();

const s1 = ref(0);
const oldVal = ref(0);
const inputCom = computed({
  get() {
    return props.s.dpOdds;
  },
  set(v: number) {
    if (!v || oldVal.value === v) return;
    oldVal.value = v;
    const n = subtraction(v, props.s.dpOdds, 2);
    if (n > 0) {
      s1.value = addition(s1.value, n, 2);
    } else {
      s1.value = subtraction(s1.value, Math.abs(n), 2);
    }
    props.s.dpOdds = v;
    if (Math.abs(props.s.dpOdds) >= 1) {
      if (Math.abs(props.s.dpOdds) === 1) {
        props.s.dpOdds = -1;
      } else if (props.s.dpOdds > 0) {
        props.s.dpOdds = subtraction(props.s.dpOdds, 2, 2);
      } else {
        props.s.dpOdds = subtraction(2, Math.abs(props.s.dpOdds), 2);
      }
    }
    changeDpOdds();
  }
});

const changeDpOdds = debounce(() => {
  emits('changeSelectNum', s1.value);
  s1.value = 0;
}, 1000);

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
      if (Math.abs(props.s.dpOdds) >= 1) {
        if (Math.abs(props.s.dpOdds) === 1) {
          props.s.dpOdds = -1;
        } else if (props.s.dpOdds > 0) {
          props.s.dpOdds = subtraction(props.s.dpOdds, 2, 2);
        } else {
          props.s.dpOdds = subtraction(2, Math.abs(props.s.dpOdds), 2);
        }
      }
    }
  }
);

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

//- 输入框获得焦点
const inputFoucs = (status: boolean) => {
  emits('showShortcutContainer', status, props.s);
};
</script>

<style lang="scss">
.el-input-number.is-controls-right .el-input__wrapper {
  padding-left: 10px !important;
  padding-right: 30px !important;
}
</style>

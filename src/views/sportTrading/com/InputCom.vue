<template>
  <div
    class="w-1/4 text-center input_wrapper relative h-full input_container"
    @mouseleave.stop="e => mouseEvent(e, props.s, 'leave')"
  >
    <span
      v-if="showNum"
      @mouseenter.stop="e => mouseEvent(e, props.s, 'enter')"
      :class="[
        'text-[--el-color-primary] text-left h-full flex items-center w-[70px]',
        saleStatus !== 2 && '!text-[#909399]',
        s.dpOdds?.toFixed(2) < 0 && 'translate-x-[-6px]'
      ]"
    >
      {{ s.dpOdds?.toFixed(2) }}
    </span>
    <div
      v-else
      class="text-[--el-color-primary] flex justify-start cursor-pointer h-full relative"
    >
      <div
        class="w-[120px] flex justify-start items-center h-full"
        @mousemove="inputContainerMouseMove"
        @mouseenter="inputContainerMouseEnter"
        @mouseleave="inputContainerMouseLeave"
      >
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
import { resetDpodds } from '../util/playMap';

const emits = defineEmits([
  'changeMouse',
  'changeSelectNum',
  'showShortcutContainer',
  'hideScrollList'
]);
const props = defineProps<{
  s: sportTradingDataAPI.BetItemsDtoList;
  selectNum: number;
  saleStatus: number;
  selectItem: sportTradingDataAPI.BetItemsDtoList;
  betItemsDtoList: sportTradingDataAPI.BetItemsDtoList[];
}>();

// 快捷键鼠标事件
let lastX = ref<number>(0);
let direction = ref<string>('');

const inputContainerMouseEnter = (e: any) => {
  lastX.value = e.clientX;
};

const inputContainerMouseMove = (e: any) => {
  const currentX = e.clientX;
  if (lastX !== undefined) {
    const diffX = currentX - (lastX.value as number);
    if (diffX > 0) {
      direction.value = 'right';
    } else {
      direction.value = 'left';
    }
  }
};

const inputContainerMouseLeave = () => {
  if (direction.value === 'left') {
    emits('hideScrollList');
  }
  lastX.value = 0;
  direction.value = '';
};

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
      props.s.dpOdds = resetDpodds(props.s.dpOdds);
    }
    if (props.betItemsDtoList.length === 2) {
      const d = props.betItemsDtoList.find(
        item => item.betItemsId !== props.selectItem.betItemsId
      ) as sportTradingDataAPI.BetItemsDtoList;
      if (n > 0) {
        d.dpOdds = subtraction(d.dpOdds, n, 2);
      } else {
        d.dpOdds = addition(d.dpOdds, Math.abs(n), 2);
      }
      if (Math.abs(d.dpOdds) >= 1) d.dpOdds = resetDpodds(d.dpOdds);
    }

    changeDpOdds();
  }
});

const changeDpOdds = debounce(() => {
  emits('changeSelectNum', s1.value);
  s1.value = 0;
}, 500);

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
  let baseN = 0;
  let val = 0;
  if (props.s.odds < 0 && props.s.dpOdds < 0) {
    val = subtraction(Math.abs(props.s.odds), Math.abs(props.s.dpOdds), 2);
  } else if (props.s.odds > 0 && props.s.dpOdds > 0) {
    val = subtraction(Math.abs(props.s.dpOdds), Math.abs(props.s.odds), 2);
  } else if (
    (props.s.odds < 0 && props.s.dpOdds > 0) ||
    (props.s.odds > 0 && props.s.dpOdds < 0)
  ) {
    if (props.s.odds > 0) {
      baseN = subtraction(2, Math.abs(props.s.dpOdds), 2);
      val = subtraction(baseN, props.s.odds, 2);
    } else {
      baseN = subtraction(2, Math.abs(props.s.dpOdds), 2);
      val = subtraction(Math.abs(props.s.odds), baseN, 2);
    }
  }
  return {
    val: val > 0 ? `+${val}` : val,
    color: val > 0 ? '--el-color-success-light-3' : '--el-color-danger-light-3'
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

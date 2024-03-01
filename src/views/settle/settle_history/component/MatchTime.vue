<template>
  <span class="text-sm">
    {{ getTime(showTime).h }}:{{ getTime(showTime).m }}:{{
      getTime(showTime).s
    }}
  </span>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { getTime } from '@pureadmin/utils';
import { MatchEventRowType } from '../utils/type';

const props = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
    beginTime: number;
  }
>();
const emits = defineEmits(['changeEventTime']);

watch(
  () => props.row,
  d => {
    if (d.t1 == 0 && d.t2 == 0) {
      d.eventTime = dayjs().startOf('day').valueOf();
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const showTime = computed(() => {
  return (+props.row.eventTime - props.beginTime) / 1000;
});
</script>

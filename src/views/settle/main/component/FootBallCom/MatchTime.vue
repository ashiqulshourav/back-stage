<template>
  <span class="text-sm" v-if="row.isBackEndReturnData">
    {{ getTime(showTime).h }}:{{ getTime(showTime).m }}:{{
      getTime(showTime).s
    }}
  </span>
  <el-time-picker
    v-else
    :class="[row.canceled === 1 && 'canceled']"
    v-model="row.eventTime"
    :disabled="!row.isEdit"
    :placeholder="t('请选择当前录入时间')"
    value-format="x"
    :default-value="dayjs().startOf('day').toDate()"
    @change="changeEventTime(row, index, item.tableList)"
    format="HH:mm:ss"
  />
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from '../../utils/type';
import { message } from '@/utils/message';
import dayjs from 'dayjs';
import { getTime } from '@pureadmin/utils';
import { compareTime } from '@/utils/formatDate';

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

const changeEventTime = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[]
) => {
  if (childIndex === 0) return;
  if (
    compareTime(dayjs(row.eventTime).format('HH:mm:ss')) <=
    (+childrenData[childIndex - 1].eventTime - props.beginTime) / 1000
  ) {
    message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
    row.eventTime = '';
  }
};
</script>

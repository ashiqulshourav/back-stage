<template>
  <span class="text-sm" v-if="row.isBackEndReturnData">
    {{ getTime(showTime).h }}:{{ getTime(showTime).m }}:{{
      getTime(showTime).s
    }}
  </span>
  <div class="flex" v-else>
    <el-input
      type="number"
      size="small"
      :placeholder="t('分')"
      class="mr-2"
      :formatter="v => inputRestrictions(v)"
    />
    <el-input
      type="number"
      size="small"
      :placeholder="t('秒')"
      class="ml-2"
      :formatter="v => inputRestrictions(v)"
    />
  </div>
  <!-- <el-time-picker
    v-else
    :class="[row.canceled === 1 && 'canceled']"
    v-model="row.eventTime"
    :disabled="!row.isEdit"
    :placeholder="t('请选择当前录入时间')"
    value-format="x"
    :default-value="dayjs().startOf('day').toDate()"
    @change="changeEventTime(row, index, item.tableList)"
    format="HH:mm:ss"
  /> -->
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from './util/type';
import { message } from '@/utils/message';
import dayjs from 'dayjs';
import { getTime } from '@pureadmin/utils';
import { compareTime } from '@/utils/formatDate';
import { inputRestrictions } from '@/utils/formatNumber';

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
  return (new Date(props.row.eventTime).getTime() - props.beginTime) / 1000;
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

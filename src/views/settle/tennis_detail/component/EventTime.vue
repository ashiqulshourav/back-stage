<template>
  <div class="w-[150px]">
    <el-time-picker
      v-model="row.eventTime"
      :placeholder="t('请选择当前录入时间')"
      :disabled="!row.isEdit"
      value-format="x"
      :default-value="dayjs().startOf('day').toDate()"
      @change="changeEventTime"
      format="HH:mm:ss"
    />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import dayjs from 'dayjs';
const props = defineProps<{
  row: SattleDataAPI.InningEvent;
  index: number;
  list: SattleDataAPI.InningEvent[];
  dataList: SattleDataAPI.TennisEventsData[];
  parentIndex: number;
}>();

const emits = defineEmits(['changeEventTime']);

const changeEventTime = () => {
  const { index, row, list, dataList, parentIndex } = props;
  if (
    parentIndex > 0 &&
    index === 0 &&
    row.eventTime < dataList[parentIndex - 1].eventTime
  ) {
    return message(t('当前盘结算时间不能小于上一盘'), { type: 'error' });
  }
  if (index === 0) return;
  if (+row.eventTime <= new Date(list[index - 1].eventTime).getTime()) {
    message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
    row.eventTime = '';
  }
};
</script>

<style scoped></style>

<template>
  <div class="w-[200px]">
    <el-time-picker
      :class="[row.canceled === 1 && 'canceled']"
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
  row: any;
  index: number;
  list: any[];
}>();

const emits = defineEmits(['changeEventTime']);

const changeEventTime = () => {
  const { index, row, list } = props;
  if (index === 0) return;
  if (+row.eventTime <= new Date(list[index - 1].eventTime).getTime()) {
    message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
    row.eventTime = '';
  }
};
</script>

<style scoped></style>

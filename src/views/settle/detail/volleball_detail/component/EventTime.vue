<template>
  <div class="timer_container">
    <span class="text-sm" v-if="row.id">
      {{ getTime(showTime).h }}:{{ getTime(showTime).m }}:{{
        getTime(showTime).s
      }}
    </span>
    <el-time-picker
      v-else
      v-model="row.eventTime"
      :class="[errorType && 'error_color']"
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
import { getTime } from '@pureadmin/utils';
import { compareTime } from '@/utils/formatDate';

const props = defineProps<{
  row: SattleDataAPI.volleyballData;
  index: number;
  dataList: SattleDataAPI.volleyballData[];
  errorType: boolean;
  beginTime: number;
}>();

const emits = defineEmits(['changeEventTime']);

const showTime = computed(() => {
  return (+props.row.eventTime - props.beginTime) / 1000;
});

const changeEventTime = () => {
  const { index, row, dataList } = props;
  if (
    index > 0 &&
    compareTime(dayjs(row.eventTime).format('HH:mm:ss')) <=
      (+dataList[index - 1].eventTime - props.beginTime) / 1000
  ) {
    row.eventTime = '';
    return message(t('当前结算时间不能小于上一局'), { type: 'error' });
  }
};
</script>

<style scoped lang="scss">
.timer_container {
  :deep() {
    .is-disabled {
      .el-input__wrapper {
        border: none;
        background-color: transparent;
        box-shadow: none;
        .el-input__prefix {
          display: none;
        }
        .el-input__inner {
          flex-grow: 0;
          text-align: center;
        }
      }
    }
    .error_color {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
      }
    }
  }
}
</style>

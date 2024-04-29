<template>
  <div>
    <el-date-picker
      class="ml-4 !w-[260px]"
      v-model="timeVal"
      :type="isSingle ? 'date' : 'daterange'"
      :placeholder="placeholder"
      value-format="x"
      :format="format"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :disabled-date="disableDate"
      @change="changeDate"
      :shortcuts="shortcuts"
    />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';

const props = withDefaults(
  defineProps<{
    val: string | number | string[];
    placeholder?: string;
    format?: string;
    disableDate?: Function;
    isShowShortCuts?: boolean;
    isSingle?: boolean;
    startPlaceholder?: string;
    endPlaceholder?: string;
  }>(),
  {
    disableDate: () => {},
    format: 'YYYY-MM-DD',
    isShowShortCuts: true,
    isSingle: false,
    placeholder: t('请选择日期'),
    startPlaceholder: t('开始日期'),
    endPlaceholder: t('结束日期')
  }
);

const shortcuts = !props.isShowShortCuts
  ? []
  : props.isSingle
  ? [
      {
        text: t('一星期之前'),
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          return date;
        }
      },
      {
        text: t('昨日'),
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24);
          return date;
        }
      },
      {
        text: t('今日'),
        value: new Date()
      },
      {
        text: t('明日'),
        value: () => {
          const date = new Date();
          date.setTime(date.getTime() + 3600 * 1000 * 24);
          return date;
        }
      }
    ]
  : [
      {
        text: t('最近七日'),
        value: () => {
          const start7Days =
            dayjs().subtract(7, 'day').startOf('day').format('YYYY-MM-DD') +
            '00:00:00';
          const end7Days =
            dayjs().endOf('day').format('YYYY-MM-DD') + '23:59:59';
          return [start7Days, end7Days];
        }
      },
      {
        text: t('最近三十日'),
        value: () => {
          const start30Days =
            dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD') +
            '00:00:00';
          const end30Days =
            dayjs().endOf('day').format('YYYY-MM-DD') + '23:59:59';
          return [start30Days, end30Days];
        }
      },

      {
        text: t('上月'),
        value: () => {
          const startMonth =
            dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') +
            '00:00:00';
          const endMonth =
            dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') +
            '23:59:59';
          return [startMonth, endMonth];
        }
      },
      {
        text: t('上周'),
        value: () => {
          const startOfWeek =
            dayjs().subtract(1, 'week').day(1).format('YYYY-MM-DD') +
            '00:00:00';
          const endOfWeek =
            dayjs().subtract(1, 'week').day(7).format('YYYY-MM-DD') +
            '23:59:59';
          return [startOfWeek, endOfWeek];
        }
      },
      {
        text: t('本周'),
        value: () => {
          const startOfWeek = dayjs().day(1).format('YYYY-MM-DD') + '00:00:00';
          const endOfWeek = dayjs().day(7).format('YYYY-MM-DD') + '23:59:59';
          return [startOfWeek, endOfWeek];
        }
      },
      {
        text: t('本月'),
        value: () => {
          const startMonth =
            dayjs().startOf('month').format('YYYY-MM-DD') + '00:00:00';
          const endMonth =
            dayjs().endOf('month').format('YYYY-MM-DD') + '23:59:59';
          return [startMonth, endMonth];
        }
      }
    ];
const emits = defineEmits(['update:val', 'changeDate']);
const timeVal = computed({
  get: () => props.val,
  set(val) {
    emits('update:val', val);
  }
});

const changeDate = (t: number | number[]) => {
  emits('changeDate', t);
};
</script>

<style scoped></style>

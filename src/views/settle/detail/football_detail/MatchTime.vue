<template>
  <span class="text-sm" v-if="row.isBackEndReturnData">
    {{ padZero(parseInt(+row.eventTime / 60)) }}:{{
      padZero(+row.eventTime % 60)
    }}
  </span>
  <div class="flex" v-else>
    <el-input
      type="number"
      size="small"
      :placeholder="t('分')"
      class="mr-2"
      v-model="minuteNum"
      :disabled="!row.isEdit"
      :formatter="v => inputRestrictions(v, 0, 150)"
    />
    <el-input
      type="number"
      size="small"
      :placeholder="t('秒')"
      class="ml-2"
      :disabled="!row.isEdit"
      v-model="secondNum"
      :formatter="v => inputRestrictions(v, 0, 59)"
    />
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from './util/type';
import dayjs from 'dayjs';
import { padZero } from '@/utils/formatDate';
import { inputRestrictions } from '@/utils/formatNumber';

const props = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
    beginTime: number;
  }
>();
const emits = defineEmits(['changeEventTime']);
const secondNum = ref<number>(null);
const minuteNum = ref<number>(null);

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

watch(
  () => secondNum.value,
  () => {
    if (!minuteNum.value) {
      minuteNum.value = 0;
    }
    if (minuteNum.value !== null && secondNum.value !== null) {
      const r = minuteNum.value * 60 + +secondNum.value;
      props.row.eventTime = r;
    }
  }
);
</script>

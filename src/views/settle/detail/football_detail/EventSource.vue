<template>
  <el-select
    :class="[
      row.canceled && 'canceled',
      '!w-[150px]',
      !row.homeAway && 'un_select'
    ]"
    :disabled="!row.isEdit"
    v-model="row.homeAway"
    :placeholder="row.isEdit ? t('请选择') : '-'"
    @change="teamChangeEvent(row, index, item.tableList, item.type)"
  >
    <template v-if="row.matchPeriodId === 50">
      <el-option :label="t('双方无进球')" value="none" />
      <el-option :label="t('主队进一球')" value="home" />
      <el-option :label="t('客队进一球')" value="away" />
      <el-option :label="t('双方各进一球')" value="all" />
    </template>
    <template v-else>
      <el-option :label="t('主队')" value="home" />
      <el-option v-if="!row.isEdit" :label="t('平局')" value="" />
      <el-option :label="t('客队')" value="away" />
    </template>
  </el-select>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType } from './util/type';

const { row, index, item } = defineProps<
  MatchEventRowType & {
    item: SattleDataAPI.ChildrenDataList;
  }
>();

const emits = defineEmits(['teamChangeEvent']);

const teamChangeEvent = (...data) => {
  if (row.matchPeriodId === 50) {
    let t1 = 0;
    let t2 = 0;
    switch (row.homeAway) {
      case 'home':
        t1 = 1;
        break;
      case 'away':
        t2 = 1;
        break;
      case 'all':
        t1 = 1;
        t2 = 1;
        break;
    }
    if (index === 0) {
      row.t1 = t1;
      row.t2 = t2;
    } else {
      const prevRow = item.tableList[index - 1];
      row.t1 = +prevRow.t1 + t1;
      row.t2 = +prevRow.t2 + t2;
    }
    row.firstNum = index + 1;
    row.firstT1 = t1;
    row.firstT2 = t2;
  } else {
    emits('teamChangeEvent', ...data);
  }
};
</script>

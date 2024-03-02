<template>
  <div v-if="!row.id">
    <el-button
      size="small"
      type="primary"
      v-if="!row.isEdit"
      @click="row.isEdit = true"
      >{{ t('编辑') }}</el-button
    >
    <el-button
      v-if="row.isEdit"
      size="small"
      type="primary"
      @click="saveItem"
      >{{ t('保存') }}</el-button
    >
    <el-button
      v-if="!row.isEdit && isShowSettleBtn"
      size="small"
      type="primary"
      @click="settleJunClick"
      >{{
        row.gameRule === 'INNING' ?
          t('结算节') :
        row.inningNum === 1 ?
          t('结算上半场') :
        row.inningNum === 2 ?
          t('结算下半场') : t('结算加时赛')
}}</el-button
    >
    <el-button size="small" type="danger" @click="deleteChildItem">{{
      t('删除')
    }}</el-button>
  </div>
  <span v-else>--</span>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
const props = defineProps<{
  row: SattleDataAPI.InningEvent;
  childIndex: number;
}>();

const isShowSettleBtn = computed(() => {
  return (
    props.row.t1 !== '' &&
    props.row.t2 !== '' &&
    props.row.eventTime &&
    !props.row.isEdit
  );
});

const saveItem = () => {
  props.row.t1Error = false;
  props.row.t2Error = false;
  props.row.eventTimeError = false;
  let errMsg = '';
  switch (true) {
    case !props.row.t1:
      props.row.t1Error = true;
      errMsg = t('主队比分不能为空');
      break;
    case !props.row.t2:
      errMsg = t('客队比分不能为空');
      props.row.t2Error = true;
      break;
    case !props.row.eventTime:
      errMsg = t('结算时间不能为空');
      props.row.eventTimeError = true;
      break;
  }
  if (!errMsg) {
    props.row.isEdit = false;
  } else {
    message(errMsg, { type: 'error' });
  }
};

const emits = defineEmits(['deleteChildItem', 'settlementHandicap']);

const deleteChildItem = () => emits('deleteChildItem');

const settleJunClick = () => {
  props.row.isEdit = false;
  emits('settlementHandicap');
};
</script>

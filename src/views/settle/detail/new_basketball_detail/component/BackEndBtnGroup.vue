<template>
  <div class="flex">
    <el-button
      v-if="renderObj.settlementType === 2"
      class="reset-margin"
      link
      type="primary"
      size="small"
      :icon="useRenderIcon('settle')"
      @click="resetMatchEvent(row, index)"
    >
      {{ t('重新结算') }}
    </el-button>
    <el-button
      v-if="renderObj.settlementType === 2"
      class="reset-margin"
      link
      type="danger"
      size="small"
      :icon="useRenderIcon(Delete)"
      @click="cancelMatchEvent(row, index)"
    >
      {{ t('取消事件') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';
import Delete from '@iconify-icons/ep/delete';

defineProps<{
  row: SattleDataAPI.newBasketballEventsList;
  dataList: SattleDataAPI.newBasketballEventsList[];
  index: number;
  renderObj: SattleDataAPI.getSettlementDataList;
}>();

const emits = defineEmits([
  'cancelMatchEvent',
  'resetSettleBtnClick',
  'resetMatchEvent'
]);

const cancelMatchEvent = (...data) => emits('cancelMatchEvent', ...data);
const resetMatchEvent = (...data) => emits('resetMatchEvent', ...data);
</script>

<style scoped></style>

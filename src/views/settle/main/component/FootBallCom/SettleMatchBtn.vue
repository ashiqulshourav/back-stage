<template>
  <div class="flex mb-2">
    <CustomButton
      v-if="!parentRow.halfSettlementStatus"
      type="primary"
      :btn-text="t('上半场结束结算')"
      :link="true"
      :icon="useRenderIcon('icon_money')"
      :loading="balanceLoading.half"
      :disabled="!!parentRow.halfSettlementStatus || !childDataTotal"
      @click="settlementFunction(parentRow.matchId, 'half')"
    />
    <CustomButton
      v-if="parentRow.halfSettlementStatus && !parentRow.fullSettlementStatus"
      type="danger"
      :btn-text="t('全场结束结算')"
      :link="true"
      :icon="useRenderIcon('icon_money')"
      :loading="balanceLoading.all"
      :disabled="!!parentRow.fullSettlementStatus || !childDataTotal"
      @click="settlementFunction(parentRow.matchId, 'all')"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/Form/CustomButton.vue';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { t } from '@/plugins/i18n';

defineProps<{
  balanceLoading: any;
  parentRow: SattleDataAPI.getSettlementDataList;
  childDataTotal: number;
}>();

const emites = defineEmits(['settlementFunction']);
const settlementFunction = (...data) => emites('settlementFunction', ...data);
</script>

<style scoped></style>

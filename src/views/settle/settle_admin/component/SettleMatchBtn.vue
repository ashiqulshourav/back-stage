<template>
  <div class="flex mb-2">
    <CustomButton
      v-for="key in Object.keys(balanceLoading)"
      :key="key"
      :type="key === 'half' ? 'primary' : 'danger'"
      :btn-text="key === 'half' ? t('上半场结束结算') : t('全场结束结算')"
      :link="true"
      :icon="useRenderIcon('icon_money')"
      :loading="balanceLoading[key]"
      :disabled="
        (key === 'half'
          ? !!parentRow.halfSettlementStatus
          : !!parentRow.fullSettlementStatus) || !childDataTotal
      "
      @click="settlementFunction(parentRow.matchId, key as 'half' | 'all')"
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
const settlementFunction = (...data) =>emites('settlementFunction',...data)
</script>

<style scoped></style>

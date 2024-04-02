<template>
  <div class="flex">
    <!-- v-if="!parentRow.halfSettlementStatus && hasAuth('FIRSTHALFSETTLE')" -->
    <CustomButton
      type="primary"
      :btn-text="currentSettleType.txt"
      :loading="balanceLoading.half"
      :disabled="!childDataTotal || currentSettleType.disabled"
      @click="settleClick"
    />
    <CustomButton
      type="danger"
      :btn-text="t('结算比赛')"
      :loading="balanceLoading.all"
      :disabled="!!parentRow.fullSettlementStatus || !childDataTotal"
      @click="closeMatchClick"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/Form/CustomButton.vue';
import { t } from '@/plugins/i18n';
import { SETTLE_BUTTON_TYPE } from './util/type';
import { message } from '@/utils/message';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{
  balanceLoading: any;
  parentRow: SattleDataAPI.getSettlementDataList;
  childDataTotal: number;
  matchId: number;
  overTimeStatus: boolean;
  penaltyKickStatus: boolean;
}>();

const currentSettleType = computed(() => {
  const o = {
    txt: '',
    reqUrl: '',
    confirmTxt: '',
    disabled: false
  };
  switch (props.parentRow.settlementStatus) {
    case SETTLE_BUTTON_TYPE.normal_half:
    case null:
      o.txt = t('常规赛上半场结算');
      o.confirmTxt = t('确定要常规赛上半场结算么？');
      o.reqUrl = 'firstHalfSettlement';
      break;
    case SETTLE_BUTTON_TYPE.normal_all:
      o.txt = t('常规赛全场结算');
      o.confirmTxt = t('确定要常规赛全场结算么？');
      o.reqUrl = 'allSettlement';
      break;
    case SETTLE_BUTTON_TYPE.over_half:
      o.txt = t('加时赛上半场结算');
      o.confirmTxt = t('确定要加时赛上半场结算么？');
      o.reqUrl = 'overTimeHalfSettlement';
      o.disabled = !props.overTimeStatus;
      break;
    case SETTLE_BUTTON_TYPE.over_all:
      o.txt = t('加时赛全场结算');
      o.confirmTxt = t('确定要加时赛全场结算么？');
      o.reqUrl = 'overTimeFullSettlement';
      o.disabled = !props.overTimeStatus;
      break;
    case SETTLE_BUTTON_TYPE.penalty_kick:
      o.txt = t('点球全场结算');
      o.confirmTxt = t('确定要点球全场结算么？');
      o.reqUrl = 'penaltyKickSettlement';
      o.disabled = !props.penaltyKickStatus;
      break;
    case SETTLE_BUTTON_TYPE.penalty_kick:
      o.txt = t('点球全场结算');
      o.confirmTxt = t('确定要点球全场结算么？');
      o.reqUrl = 'penaltyKickSettlement';
      o.disabled = !props.penaltyKickStatus;
      break;
    default:
      o.txt = t('点球全场结算');
      o.confirmTxt = t('确定要点球全场结算么？');
      o.reqUrl = 'penaltyKickSettlement';
      o.disabled = true;
      break;
  }
  return o;
});

const emites = defineEmits(['settlementFunction', 'reloadTable']);
const router = useRouter();
const closeMatchClick = () => {
  ElMessageBox.confirm(t('是否立即结算比赛么？'), t('警告'), {
    dangerouslyUseHTMLString: true,
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    center: true
  }).then(async () => {
    const res = await API.closeSaleStatus({ matchId: props.matchId });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    router.go(-1);
  });
};

const settleClick = () => {
  ElMessageBox.confirm(currentSettleType.value.confirmTxt, t('警告'), {
    dangerouslyUseHTMLString: true,
    confirmButtonText: t('确认'),
    cancelButtonText: t('取消'),
    center: true
  }).then(async () => {
    const res = await API[currentSettleType.value.reqUrl]({
      matchId: props.matchId
    });
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    emites('reloadTable', true);
  });
};
</script>

<style scoped></style>

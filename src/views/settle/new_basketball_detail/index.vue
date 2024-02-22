<template>
  <div class="main">
    <DetiltTitle
      @allSettleBtnClick="allSettleBtnClick"
      :renderObj="renderObj"
      :allSettleLoading="allSettleLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from '@/utils/message';
import DetiltTitle from '../component/Settle_detail_title.vue';

defineOptions({ name: 'SETTLE_NEW_BASKETBALL_DETAIL' });

const route = useRoute();
const renderObj = reactive<SattleDataAPI.getSettlementDataList>(
  {} as SattleDataAPI.getSettlementDataList
);
onMounted(() => {
  initMatchDetail();
});

const initMatchDetail = async () => {
  const res = await API.getPreSaleInfo({
    matchId: +route.params.matchId
  });
  if (res.code) return message(res.msg, { type: 'error' });
  Object.assign(renderObj, res.data);
};

const allSettleBtnClick = () => {};

const allSettleLoading = ref(false);
</script>

<style lang="scss" scoped></style>

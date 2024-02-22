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
import DetiltTitle from '../component/Settle_detail_title.vue';

defineOptions({ name: 'SETTLE_NEW_BASKETBALL_DETAIL' });

const route = useRoute();
onMounted(() => {
  console.log('index.vue文件 14==============行打印=');
  initMatchDetail();
});

const initMatchDetail = async () => {
  console.log('index.vue文件 23==============行打印=', route);
  const res = await API.getPreSaleInfo({ matchId: route.params.matchId });
};

const renderObj = reactive({});

const allSettleBtnClick = () => {};

const allSettleLoading = ref(false);
</script>

<style lang="scss" scoped></style>

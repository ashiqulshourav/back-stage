<template>
  <el-countdown
    v-if="
      isSelfHandle && parentRow.settlementType !== 2 && row.settleType !== 1
    "
    class="!text-xs mr-3"
    :value="getTimeValue(row)"
    format="HH:mm:ss"
    @finish="countdownFinish"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  row: SattleDataAPI.MatchEventsList;
  parentRow: SattleDataAPI.getSettlementDataList;
}>();

//- 距离事件接受后剩余时间
const BASE_TIME = 1000 * 60 * 5;

const getTimeValue = (d: SattleDataAPI.MatchEventsList) => {
  const t = BASE_TIME - (d.t - new Date(d.createdAt).getTime());
  return Date.now() + t;
};

const isSelfHandle = computed(() => {
  console.log(
    'CountDownBtn.vue文件 28==============行打印=',
    new Date(props.row.createdAt)
  );
  const isShow =
    props.row.t - new Date(props.row.createdAt).getTime() < BASE_TIME;
  props.row.isShowCount = isShow;
  console.log('CountDownBtn.vue文件 31==============行打印=', isShow);
  return isShow;
});

//- 倒计时结束事件
const countdownFinish = () => (props.row.isShowCount = false);
</script>

<style scoped></style>

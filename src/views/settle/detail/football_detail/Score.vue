<template>
  <div class="mt-1 mr-5 text-sm bg-gray-100">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="flex item-center text-sm">
          <span>{{ t('目前比分') }}： </span>
          <span>
            {{
              dataList[0].tableList[dataList[0].tableList.length - 1]?.t1 ?? 0
            }}
            -
            {{
              dataList[0].tableList[dataList[0].tableList.length - 1]?.t2 ?? 0
            }}
          </span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="flex">
          <span>{{ t('目前红牌') }}：</span>
          <el-text type="danger">{{ getCurrentCard.home.red ?? 0 }}</el-text>
          <span>-</span>
          <el-text type="danger">{{ getCurrentCard.away.red ?? 0 }}</el-text>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="flex ml-3">
          <span>{{ t('目前黄牌') }}：</span>
          <el-text type="primary">{{
            getCurrentCard.home.yellow ?? 0
          }}</el-text>
          <span class="2">-</span>
          <el-text type="primary">{{
            getCurrentCard.away.yellow ?? 0
          }}</el-text>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="flex text-sm">
          <span>{{ t('目前角球') }}：</span>
          <span>
            {{
              dataList[2].tableList[dataList[2].tableList.length - 1]?.t1 ?? 0
            }}
            -
            {{
              dataList[2].tableList[dataList[2].tableList.length - 1]?.t2 ?? 0
            }}
          </span>
        </div>
      </el-col>
      <el-col
        :span="5"
        v-if="
          renderObj.fullSettlementStatus === 1 &&
          hasAuth('ENABLERECALCULATIONANDSETTLE')
        "
      >
        <el-button
          @click="openSecondSettleClick"
          type="primary"
          size="small"
          v-if="renderObj.reSettleStatus === 0"
          >{{ t('开启二次结算') }}</el-button
        >
        <el-button
          @click="confirmSecondSettleClick"
          type="warning"
          size="small"
          v-else
          >{{ t('确认二次结算') }}</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';

const props = defineProps<{
  renderObj: SattleDataAPI.getSettlementDataList;
  dataList: SattleDataAPI.ChildrenDataList[];
}>();

const emits = defineEmits([
  'openSecondSettleClick',
  'confirmSecondSettleClick'
]);

const openSecondSettleClick = () => {
  emits('openSecondSettleClick');
};

const confirmSecondSettleClick = () => {
  emits('confirmSecondSettleClick');
};

const getCurrentCard = computed(() => {
  const data = {
    home: {
      red: 0,
      yellow: 0
    },
    away: {
      red: 0,
      yellow: 0
    }
  };
  props.dataList[1].tableList.forEach(item => {
    if (item.homeAway === 'home') {
      item.redOrYellow === 1 ? (data.home.yellow += 1) : (data.home.red += 1);
    } else if (item.homeAway === 'away') {
      item.redOrYellow === 1 ? (data.away.yellow += 1) : (data.away.red += 1);
    }
  });
  return data;
});
</script>

<style scoped></style>

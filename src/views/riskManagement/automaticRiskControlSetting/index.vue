<template>
  <div class="main">
    <div class="mb-5">
      <!-- Top Buttons -->
      <div class="flex justify-between item-center mb-4">
        <div class="flex mt-4 flex-wrap w-full">
          <CustomButton
            class="mb-2 !ml-0 mr-2"
            v-for="item in AUTO_RISK_CONTROLS"
            :key="item.value"
            :type="item.value === currentRiskControlLabelId ? 'primary' : ''"
            :btnText="item.label"
            @click="changeType(item.value)"
          />
        </div>
        <el-button
          v-if="!isEditRiskControls"
          @click="toggle(true)"
          type="primary"
          >{{ t('编辑') }}</el-button
        >
        <div class="flex items-center" v-else>
          <el-button @click="cancelRiskControlsEdit" type="info">{{
            t('取消')
          }}</el-button>
          <el-button @click="confirmRiskControlsClick" type="primary">{{
            t('确认')
          }}</el-button>
        </div>
      </div>

      <!-- Tables -->
      <div>
        <!-- Automatically reject -->
        <!-- Automatic order placement -->
        <!-- AutoFreeze -->
        <!-- Auto Label Limit -->
        <div v-if="currentRiskControlLabelId == 3">
          <AutoLabelLimit
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="columns"
            :riskControlList="riskControlList"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :labelList="labelList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

import { AUTO_RISK_CONTROLS } from './utils/map';
import { useRiskControlHook } from './utils/hook';
import CustomButton from '@/components/Form/CustomButton.vue';
import {
  addThousandSeparator,
  formatNumberAndFillNull,
  formatNumber,
  formatNumberWithLength
} from '@/utils/formatNumber';
import AutoLabelLimit from './component/AutoLabelLimit.vue';

// :category="1" :venueType="1"
const {
  currentRiskControlLabelId,
  loading,
  changeType,
  isEditRiskControls,
  toggle,
  cancelRiskControlsEdit,
  confirmRiskControlsClick,
  columns,
  riskControlList,
  deleteControlLabel,
  addControlLabel,
  confirmSportClick,
  labelList
} = useRiskControlHook({ venueType: 1, category: 1 });
</script>

<style scoped lang="scss">
.el-input {
  height: 30px;
  .el-input__inner {
    height: 30px;
  }
}
</style>

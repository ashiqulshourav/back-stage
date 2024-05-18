<template>
  <div class="main">
    <div class="mb-5">
      <!-- Top Buttons -->
      <div class="flex justify-between item-center mb-2">
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
      </div>

      <div class="flex justify-between items-center mb-4">
        <span v-if="currentRiskControlLabelId == 0">{{ t('接拒设置') }}</span>
        <span v-if="currentRiskControlLabelId == 1">{{
          t('自动划单设置')
        }}</span>
        <span v-if="currentRiskControlLabelId == 2">{{
          t('冻结注单设置')
        }}</span>
        <span v-if="currentRiskControlLabelId == 3">{{
          t('自动标签、限额等级设置')
        }}</span>
        <EditAutoLabelButton
          :currentRiskControlLabelId="currentRiskControlLabelId"
          :isEditRiskControls="isEditRiskControls"
          :toggle="toggle"
          :cancelRiskControlsEdit="cancelRiskControlsEdit"
          :confirmRiskControlsClick="confirmRiskControlsClick"
        />
      </div>

      <!-- Tables -->
      <div>
        <!-- Automatically reject -->
        <div v-if="currentRiskControlLabelId == 0">
          <AutomaticReject
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="rejectOrderColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :rejectOrderList="rejectOrderList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- Automatic order placement -->
        <div v-if="currentRiskControlLabelId == 1">
          <AutomaticOrderPlacement
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="orderPlacementColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :orderPlacementList="orderPlacementList"
            :orderAutoFreezeList="orderAutoFreezeList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- AutoFreeze -->
        <div v-if="currentRiskControlLabelId == 2">
          <AutomaticFreeze
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="autoFreezeColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :orderPlacementList="orderPlacementList"
            :orderAutoFreezeList="orderAutoFreezeList"
            :isFormClick="isFormClick"
          />
        </div>
        <!-- Auto Label Limit -->
        <div v-if="currentRiskControlLabelId == 3">
          <AutoLabelLimit
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="autoLabelColumns"
            :riskControlList="riskControlList"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :labelList="labelList"
            :isFormClick="isFormClick"
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
import EditAutoLabelButton from './component/EditAutoLabelButton.vue';
import AutomaticReject from './component/AutomaticReject.vue';
import AutomaticOrderPlacement from './component/AutomaticOrderPlacement.vue';
import AutomaticFreeze from './component/AutomaticFreeze.vue';

// :category="1" :venueType="1"
const {
  currentRiskControlLabelId,
  loading,
  changeType,
  isEditRiskControls,
  toggle,
  cancelRiskControlsEdit,
  confirmRiskControlsClick,
  autoLabelColumns,
  riskControlList,
  deleteControlLabel,
  addControlLabel,
  labelList,
  orderPlacementColumns,
  rejectOrderColumns,
  rejectOrderList,
  orderPlacementList,
  pandaMatchList,
  autoFreezeColumns,
  orderAutoFreezeList,
  isFormClick
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

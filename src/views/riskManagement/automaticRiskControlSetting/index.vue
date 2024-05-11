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
          <AutomaticReject />
        </div>
        <!-- Automatic order placement -->
        <div v-if="currentRiskControlLabelId == 1">
          <AutomaticOrderPlacement
            :isEditRiskControls="isEditRiskControls"
            :loading="loading"
            :columns="orderPlacementColumns"
            :addControlLabel="addControlLabel"
            :deleteControlLabel="deleteControlLabel"
            :pandaMatchList="pandaMatchList"
            :orderPlacementList="orderPlacementList"
          />
        </div>
        <!-- AutoFreeze -->
        <AutomaticFreeze />
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
  pandaMatchList
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

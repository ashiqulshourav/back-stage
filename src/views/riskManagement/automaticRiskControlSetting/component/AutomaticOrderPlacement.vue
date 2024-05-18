<template>
  <div>
    <pure-table
      maxHeight="500"
      align-whole="center"
      :loading="loading"
      size="small"
      border
      :data="orderPlacementList"
      :columns="columns"
      :header-cell-style="tableHeaderStyleBlue"
    >
      <template #eventSource="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.sourceCode"
          :placeholder="t('事件源')"
          clearable
          required
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in EVENT_SOURCE"
            :key="item.value"
          />
        </el-select>

        <span v-else>{{ row.sourceName }} </span>
        <div
          v-if="!row.sourceCode && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('事件源不能为空') }}
        </div>
      </template>
      <template #eventName="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.eventCode"
          :placeholder="t('事件名称')"
          clearable
          :onChange="changeEventName(row)"
          required
        >
          <el-option
            :label="item.eventName"
            :value="item.eventCode"
            v-for="item in EVENT_NAMES"
            :key="item.eventCode"
            :disabled="eventDisabled(item.eventCode, row)"
          />
        </el-select>
        <span v-else>{{ row.eventName }} </span>
        <div
          v-if="!row.eventCode && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('事件名称不能为空') }}
        </div>
      </template>
      <template #beforeBetting="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betBeforeTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betBeforeTime }} {{ t('秒') }} </span>
      </template>
      <template #afterBetting="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betAfterTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betAfterTime }} {{ t('秒') }} </span>
        <div
          v-if="showBettingError(row) && isFormClick"
          class="text-red-500 text-xs text-start"
        >
          {{ t('自动划单投注后时间必须大于自动划单投注前时间') }}
        </div>
      </template>
      <template #betAmount="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.minLimitAmount"
          />
          -
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.maxLimitAmount"
          />
        </div>
        <span v-else>
          {{ row.minLimitAmount || '0' }} -
          {{ row.maxLimitAmount || t('以上') }}</span
        >
      </template>
    </pure-table>

    <!-- Edit Buttons -->
    <div class="mt-2" v-if="isEditRiskControls">
      <el-button size="small" type="primary" @click="addControlLabel">
        <span class="text-xs">+</span>
      </el-button>
      <el-button size="small" type="primary" @click="deleteControlLabel">
        <span class="text-[16px]">-</span>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';

import { usePublicHooks } from '@/hooks';
import {
  addThousandSeparator,
  formatNumberAndFillNull,
  formatNumberWithLength
} from '@/utils/formatNumber';
import { labelListType } from '@/views/operateManager/com/playerList/utils/types';
import { getLabelColor } from '@/components/RiskLabelList/utils';
import { getLabelLevelByName } from '@/components/RiskLabelList/utils';
import { PandaMatch } from '@/views/eventManagement/eventQuery/utils/types';
import { EVENT_SOURCE } from '@/views/eventManagement/eventQuery/utils/map';
import { EVENT_NAMES } from '../utils/map';

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  orderPlacementList: RiskManagementDataAPI.OrderPlacementTypes[];
  addControlLabel: () => void;
  deleteControlLabel: () => void;
  isFormClick: boolean;
}>();

const changeEventName = (row): any => {
  row.eventName = EVENT_NAMES.find(
    item => item.eventCode == row.eventCode
  )?.eventName;
};

const eventDisabled = (eventCode: string, row: any) => {
  let disable = false;
  props.orderPlacementList.forEach(item => {
    if (item.sourceCode == row.sourceCode) {
      console.log('same');
      if (item.eventCode == eventCode) {
        disable = true;
      }
    }
  });

  return disable;
};

const showBettingError = (row: any) => {
  return !row.betBeforeTime && !row.betAfterTime;
};
</script>

<style scoped lang="scss">
.custom {
  flex: 0 0 0;
  max-width: unset;
  .el-tag__content {
    color: white;
  }
}
</style>

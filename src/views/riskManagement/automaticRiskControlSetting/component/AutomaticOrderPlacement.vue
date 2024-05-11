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
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in EVENT_SOURCE"
            :key="item.value"
          />
        </el-select>

        <span v-else>{{ row.sourceCode }} </span>
      </template>
      <template #eventName="{ row }">
        <el-select
          v-if="isEditRiskControls"
          v-model="row.level"
          :placeholder="t('请选择')"
          clearable
        >
          <el-option
            :label="item"
            :value="item"
            v-for="(item, idx) in sportLimmitList"
            :key="idx"
          />
        </el-select>
        <span v-else>{{ row.level }} </span>
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
      <template #betAfterTime="{ row }">
        <div v-if="isEditRiskControls" class="flex items-center gap-2">
          <el-input
            :formatter="v => formatNumberAndFillNull(v, 13)"
            v-model="row.betAfterTime"
          />
          {{ t('秒') }}
        </div>
        <span v-else> {{ row.betAfterTime }} {{ t('秒') }} </span>
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

const sportLimmitList = reactive<string[]>([]);

const { tableHeaderStyleBlue } = usePublicHooks();
const props = defineProps<{
  isEditRiskControls: boolean;
  loading: boolean;
  columns: TableColumnList;
  orderPlacementList: RiskManagementDataAPI.OrderPlacementTypes[];
  addControlLabel: () => void;
  deleteControlLabel: () => void;
  pandaMatchList: PandaMatch[];
}>();

const getLimmitLevelList = async () => {
  const res = await API.getLimitListDropDownBox();
  if (res.code) return;
  sportLimmitList.length = 0;
  sportLimmitList.push(...res.data);
};
onMounted(() => {
  getLimmitLevelList();
});
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

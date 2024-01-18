<template>
  <div class="main">
    <SearchForm
      :form="form"
      @resetForm="resetForm"
      :loading="loading"
      @onSearch="onSearch"
    />

    <SportTypeNav :currentSportId="currentSportId" @onSearch="onSearch" />

    <PureTableBar
      :title="t('结算管理')"
      :columns="columns"
      @refresh="reloadTable"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :row-key="row => row.matchId"
          :expand-row-keys="expandMatchList"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @expand-change="expandChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template
            #expand="{
              row: parentRow,
              index: parIndex
            }: {
              row: SaleDataAPI.PreSaleList,
              index: number
            }"
          >
            <div class="flex mb-2">
              <CustomButton
                v-for="key in Object.keys(balanceLoading)"
                :key="key"
                :type="key === 'half' ? 'primary' : 'danger'"
                :btn-text="key === 'half' ? t('上半场结算') : t('全场结算')"
                :link="true"
                :icon="useRenderIcon(icon_money)"
                :loading="balanceLoading[key]"
                :disabled="
                  (key === 'half'
                    ? !!parentRow.halfSettlementStatus
                    : !!parentRow.fullSettlementStatus) || !childDataTotal
                "
                @click="
                  settlementFunction(parentRow.matchId, key as 'half' | 'all')
                "
              />
            </div>
            <div class="m-4">
              <div v-for="item in parentRow.childrenData" :key="item.type">
                <div class="mt-3 mb-1 font-bold">
                  {{ MATCH_EVENT_CODE[item.type] }}
                </div>
                <pure-table
                  :row-key="row => row.id"
                  :data="item.tableList"
                  :loading="childloading"
                  :columns="childColumns"
                  size="small"
                  table-layout="auto"
                  border
                  :header-cell-style="{
                    background: 'var(--el-fill-color-light)',
                    color: 'var(--el-text-color-primary)',
                    textAlign: 'center'
                  }"
                  :cell-style="{ textAlign: 'center' }"
                >
                  <template #eventCode="{ row, index: childIndex }">
                    <el-select
                      :disabled="!row.isEdit"
                      v-model="row.redOrYellow"
                      :placeholder="t('请选择')"
                      v-if="item.type === 'yellow_red_card'"
                      @change="
                        teamChangeEvent(
                          row,
                          childIndex,
                          item.tableList,
                          item.type
                        )
                      "
                    >
                      <el-option :label="t('红牌')" :value="2" />
                      <el-option :label="t('黄牌')" :value="1" />
                    </el-select>
                    <span v-else>{{ MATCH_EVENT_CODE[row.eventCode] }}</span>
                  </template>

                  <template #eventTime="{ row, index: childIndex }">
                    <el-time-picker
                      v-model="row.eventTime"
                      :placeholder="t('请选择时间')"
                      :disabled="!row.isEdit"
                      :default-value="new Date(new Date().toLocaleDateString())"
                      value-format="x"
                      @change="changeEventTime(row, childIndex, item.tableList)"
                      format="HH:mm:ss"
                    />
                  </template>

                  <template #matchPeriodId="{ row }">
                    <el-select
                      :disabled="!row.isEdit"
                      v-model="row.matchPeriodId"
                      :placeholder="t('请选择')"
                    >
                      <el-option :label="t('上半场')" :value="6" />
                      <el-option :label="t('下半场')" :value="7" />
                    </el-select>
                  </template>

                  <template #homeAway="{ row, index: childIndex }">
                    <div>
                      <el-select
                        :disabled="!row.isEdit"
                        v-model="row.homeAway"
                        :placeholder="t('请选择')"
                        @change="
                          teamChangeEvent(
                            row,
                            childIndex,
                            item.tableList,
                            item.type
                          )
                        "
                      >
                        <el-option :label="t('主队')" value="home" />
                        <el-option
                          v-if="!row.isEdit"
                          :label="t('平局')"
                          value=""
                        />
                        <el-option :label="t('客队')" value="away" />
                      </el-select>
                    </div>
                  </template>

                  <template #player1Name="{ row }">
                    <el-input
                      v-model="row.player1Name"
                      :disabled="!row.isEdit"
                      maxLength="20"
                    />
                  </template>

                  <template
                    #canceled="{
                      row,
                      index: childIndex
                    }: {
                      row: SattleDataAPI.MatchEventsList,
                      index: number
                    }"
                  >
                    <el-switch
                      v-if="
                        row.isBackEndReturnData &&
                        childIndex === item.tableList.length - 1
                      "
                      v-model="row.canceled"
                      inline-prompt
                      :disabled="!row.isEdit"
                      class="pure-datatheme"
                    />
                    <span v-else>-</span>
                  </template>

                  <template
                    #operation="{ row }: { row: SattleDataAPI.MatchEventsList }"
                  >
                    <div class="flex items-center justify-center">
                      <template v-if="row.isBackEndReturnData">
                        <el-countdown
                          v-if="isSelfHandle && !row.timeEnd"
                          class="!text-xs"
                          :value="getTimeValue(row)"
                          format="HH:mm:ss"
                          @finish="countdownFinish(row)"
                        />
                        <el-button
                          class="ml-1 reset-margin"
                          type="primary"
                          :link="true"
                          size="small"
                          :icon="useRenderIcon(icon_money)"
                          @click="changeSettleType(parentRow.matchId)"
                          >{{ t('自动转手动结算') }}</el-button
                        >
                      </template>
                      <template v-else>
                        <el-button
                          class="reset-margin"
                          link
                          type="default"
                          :size="size"
                          v-if="!row.isBackEndReturnData"
                          :icon="useRenderIcon(EditPen)"
                          @click="editChild(row)"
                        >
                          {{ t('编辑') }}
                        </el-button>

                        <el-button
                          class="reset-margin"
                          link
                          type="primary"
                          :size="size"
                          v-if="!row.isBackEndReturnData"
                          :disabled="!row.isEdit"
                          :icon="useRenderIcon(saveIcon)"
                          @click="
                            handleChildrenData(row, parIndex, 'save', parentRow)
                          "
                        >
                          {{ t('保存') }}
                        </el-button>
                      </template>
                      <el-button
                        class="reset-margin"
                        link
                        type="danger"
                        :size="size"
                        v-if="!row.isBackEndReturnData"
                        :disabled="!row.isSave || row.isEdit"
                        :icon="useRenderIcon(uploadIcon)"
                        @click="
                          handleChildrenData(row, parIndex, 'upload', parentRow)
                        "
                      >
                        {{ t('提交') }}
                      </el-button>
                    </div>
                  </template>

                  <template #dataSourceCode="{ row }">
                    <el-text
                      v-for="(_, index) in eventQuotientList"
                      :key="index"
                      :type="row[_.type] === 1 ? 'primary' : 'info'"
                      :class="['!text-xs', index === 1 && '!mr-2 !ml-2']"
                      >{{ _.val }}</el-text
                    >
                  </template>
                </pure-table>
                <div class="mt-2 cursor-pointer">
                  <IconifyIconOffline
                    v-if="isShowAddIcon(parentRow.childrenData)"
                    width="25px"
                    :icon="icon_circle_fill"
                    @click="addChildRow(item.tableList, item.type)"
                  />
                </div>
              </div>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import icon_money from '@iconify-icons/ri/money-cny-box-fill';
import icon_circle_fill from '@iconify-icons/ri/add-circle-fill';
import saveIcon from '@iconify-icons/ri/save-3-fill';
import uploadIcon from '@iconify-icons/ri/upload-2-fill';
import { useSettle } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import { MATCH_EVENT_CODE } from '@/utils/maps/sports_map';
import CustomButton from '@/components/Form/CustomButton.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { MatchEventType } from './utils/type';
import EditPen from '@iconify-icons/ep/edit-pen';
// import CountDown from '@/components/CountDown/index.vue';

defineOptions({ name: 'settle_admin' });
const changeEventTime = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[]
) => {
  if (childIndex === 0) return;
  if (
    +row.eventTime <= new Date(childrenData[childIndex - 1].eventTime).getTime()
  ) {
    message(t('时间不能小于前一个事件发生时间'), { type: 'error' });
    row.eventTime = '';
  }
};

const BASE_TIME = 1000 * 60 * 5;
const isSelfHandle = row => {
  return BASE_TIME < row.t - new Date(row.createdAt).getTime();
};

const getTimeValue = (d: SattleDataAPI.MatchEventsList) => {
  const t = BASE_TIME - (d.t - new Date(d.createdAt).getTime());
  return Date.now() + t;
};

const countdownFinish = row => (row.timeEnd = true);

const eventQuotientList = [
  { type: 'xjFlag', val: t('188数据') },
  { type: 'psFlag', val: t('熊猫数据') },
  { type: 'vsFlag', val: t('播控数据') }
];

const teamChangeEvent = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[],
  type: string
) => {
  if (!row.homeAway) return;
  const isHome = row.homeAway === 'home';
  const isYellowRedCard = type === MatchEventType.YellowRedCard;
  if (childIndex === 0) {
    row.t1 = isHome ? (isYellowRedCard ? row.redOrYellow : 1) : 0;
    row.t2 = isHome ? 0 : isYellowRedCard ? row.redOrYellow : 1;
  } else {
    const prevRow = childrenData[childIndex - 1];
    const t1Increment = isHome
      ? isYellowRedCard
        ? (row.redOrYellow as number)
        : 1
      : 0;
    const t2Increment = isHome
      ? 0
      : isYellowRedCard
      ? (row.redOrYellow as number)
      : 1;
    row.t1 = +prevRow.t1 + t1Increment;
    row.t2 = +prevRow.t2 + t2Increment;
  }
};

const isShowAddIcon = (childrenData: SaleDataAPI.ChildrenDataList[]) => {
  const arr = childrenData
    .map(item => item.tableList)
    .flat()
    .filter(_ => _.settleType);
  return arr.length > 0;
};

const {
  form,
  loading,
  childloading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  childColumns,
  expandChange,
  addChildRow,
  editChild,
  resetForm,
  balanceLoading,
  settlementFunction,
  currentSportId,
  handleChildrenData,
  childDataTotal,
  expandMatchList,
  reloadTable,
  changeSettleType
} = useSettle();
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-statistic__number) {
  font-size: 14px;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

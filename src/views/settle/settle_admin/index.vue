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
          :header-cell-style="tableHeaderStyle"
          @expand-change="expandChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template
            #expand="{ row: parentRow, index: parIndex }: parentRowType"
          >
            <div class="flex mb-2">
              <CustomButton
                v-for="key in Object.keys(balanceLoading)"
                :key="key"
                :type="key === 'half' ? 'primary' : 'danger'"
                :btn-text="
                  key === 'half' ? t('上半场结束结算') : t('全场结束结算')
                "
                :link="true"
                :icon="useRenderIcon('icon_money')"
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
              <div
                v-for="(item, idx) in parentRow.childrenData"
                :key="item.type"
              >
                <div class="mt-3 mb-1 font-bold">
                  {{ MATCH_EVENT_CODE[item.type] }}
                </div>
                <pure-table
                  align-whole="center"
                  :row-key="row => row.id"
                  :data="item.tableList"
                  :loading="childloading"
                  :columns="childColumns"
                  size="small"
                  table-layout="auto"
                  border
                  :header-cell-style="tableHeaderStyle"
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

                  <template
                    #eventTime="{ row, index: childIndex }: MatchEventRowType"
                  >
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

                  <template #matchPeriodId="{ row }: MatchEventRowType">
                    <el-select
                      :disabled="!row.isEdit"
                      v-model="row.matchPeriodId"
                      :placeholder="t('请选择')"
                    >
                      <el-option
                        :label="
                          row.eventCode === MatchEventType.MatchStatus
                            ? t('上半场结束')
                            : t('上半场')
                        "
                        :value="
                          row.eventCode === MatchEventType.MatchStatus ? 31 : 6
                        "
                      />
                      <el-option
                        :label="
                          row.eventCode === MatchEventType.MatchStatus
                            ? t('下半场结束')
                            : t('下半场')
                        "
                        :value="
                          row.eventCode === MatchEventType.MatchStatus ? 100 : 7
                        "
                      />
                    </el-select>
                  </template>

                  <template #settleType="{ row }: MatchEventRowType">
                    <CountDownBtn
                      :row="row"
                      :parentRow="parentRow"
                      v-show="row.isShowCount"
                    />
                    <span v-show="!row.isShowCount">
                      {{ row.settleType === 0 ? t('自动结算') : t('人工结算') }}
                    </span>
                  </template>

                  <template
                    #homeAway="{ row, index: childIndex }: MatchEventRowType"
                  >
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

                  <template #player1Name="{ row }: MatchEventRowType">
                    <el-input
                      v-model="row.player1Name"
                      :disabled="!row.isEdit"
                      maxLength="20"
                    />
                  </template>

                  <template #canceled="{ row }: MatchEventRowType">
                    <el-text
                      class="!text-xs"
                      :type="row.canceled === 1 ? 'danger' : 'info'"
                      >{{ row.canceled === 1 ? t('否') : t('是') }}</el-text
                    >
                  </template>

                  <template #operation="{ row, index: i }: MatchEventRowType">
                    <div class="flex items-center justify-center">
                      <template v-if="row.isBackEndReturnData">
                        <BackEndBtnGroup
                          :row="row"
                          :parentRow="parentRow"
                          :size="size"
                          @changeSettleType="changeSettleType"
                          :parIndex="parIndex"
                          @handleChildrenData="handleChildrenData"
                          @cancelMatchEvent="cancelMatchEvent"
                          :dataList="parentRow.childrenData[idx].tableList"
                          :index="i"
                          :isShowCount="row.isShowCount"
                          @advanceSettlement="advanceSettlement"
                        />
                      </template>
                      <template v-else="!row.isBackEndReturnData">
                        <FrontBtnGroup
                          :size="size"
                          :row="row"
                          @editChild="editChild"
                          @handleChildrenData="
                            handleChildrenData(row, parIndex, 'save', parentRow)
                          "
                        />
                      </template>
                      <el-button
                        class="reset-margin"
                        link
                        type="danger"
                        :size="size"
                        v-if="!row.isBackEndReturnData"
                        :disabled="!row.isSave || row.isEdit"
                        :icon="useRenderIcon('uploadIcon')"
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
                  <el-button
                    v-if="parentRow.settlementType === 1"
                    class="ml-1 reset-margin"
                    @click="changeSettleType(parentRow.matchId)"
                    >{{ t('开启人工结算') }}</el-button
                  >

                  <div class="flex items-center" v-else>
                    <span class="mr-3">{{ t('人工结算中') }}...</span>
                    <IconifyIconOffline
                      width="25px"
                      icon="icon_circle_fill"
                      @click="
                        addChildRow(
                          item.tableList,
                          item.type,
                          parentRow.beginTime
                        )
                      "
                    />
                  </div>
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
import { useSettle } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
import { MATCH_EVENT_CODE } from '@/utils/maps/sports_map';
import CustomButton from '@/components/Form/CustomButton.vue';
import SportTypeNav from './component/SportTypeNav.vue';
import { MatchEventRowType, MatchEventType, parentRowType } from './utils/type';
import BackEndBtnGroup from './component/BackEndBtnGroup.vue';
import FrontBtnGroup from './component/FrontBtnGroup.vue';
import { usePublicHooks } from '@/hooks';
import CountDownBtn from './component/CountDownBtn.vue';

const { tableHeaderStyle } = usePublicHooks();

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

/* const isShowAddIcon = (childrenData: SaleDataAPI.ChildrenDataList[]) => {
  const arr = childrenData
    .map(item => item.tableList)
    .flat()
    .filter(_ => _.settleType);
  return arr.length > 0;
}; */

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
  changeSettleType,
  cancelMatchEvent,
  advanceSettlement
} = useSettle();
</script>

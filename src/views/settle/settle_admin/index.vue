<template>
  <div class="main">
    <SearchForm
      :form="form"
      @resetForm="resetForm"
      :loading="loading"
      @onSearch="onSearch"
    />

    <div class="flex mt-4">
      <CustomButton
        v-for="item in SPORT_ID_MAP"
        :key="item.value"
        :type="item.value === currentSportId ? 'success' : ''"
        :btnText="item.label"
        @click="onSearch('reload', item.value)"
      />
    </div>

    <PureTableBar
      :title="t('结算管理')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          row-key="matchId"
          adaptive
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :expand-row-keys="[]"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @expand-change="expandChange"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #sn="{ index: parIndex }">{{ parIndex + 1 }}</template>
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
              <span class="mr-4 ml-4">{{ t("注") }}:</span>
              <span class="mr-4">A: {{ t("编辑") }}</span>
              <span class="mr-4">B: {{ t("确认修改") }}</span>
              <span class="mr-4">C: {{ t("确认新增") }}</span>
              <span class="mr-4">D: {{ t("删除当前记录") }}</span>
            </div>
            <div class="m-4">
              <div v-for="item in parentRow.childrenData" :key="item.type">
                <div class="mt-3 mb-1 font-bold">
                  {{ MATCH_EVENT_CODE[item.type] }}
                </div>
                <pure-table
                  row-key="id"
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
                      v-model="redOrYellow"
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
                    <el-date-picker
                      v-model="row.eventTime"
                      type="datetime"
                      :placeholder="t('请选择时间')"
                      :disabled="!row.isEdit"
                      value-format="x"
                      @change="changeEventTime(row, childIndex, item.tableList)"
                      format="YYYY-MM-DD HH:mm:ss"
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
                    #operation="{
                      row,
                      index: childIndex
                    }: {
                      row: SattleDataAPI.MatchEventsList,
                      index: number
                    }"
                  >
                    <div class="flex items-center justify-center">
                      <CustomButton
                        :circle="true"
                        @click="editChild(row)"
                        v-if="
                          row.isBackEndReturnData &&
                          item.tableList.length - 1 === childIndex
                        "
                      >
                        <div class="w-[14px] h-[14px] align-middle">A</div>
                      </CustomButton>
                      <CustomButton
                        :circle="true"
                        @click="
                          handleChildrenData(row, parIndex, 'edit', parentRow)
                        "
                        v-if="
                          row.isBackEndReturnData &&
                          item.tableList.length - 1 === childIndex
                        "
                      >
                        <div class="w-[14px] h-[14px] align-middle">B</div>
                      </CustomButton>

                      <CustomButton
                        :circle="true"
                        @click="
                          handleChildrenData(row, parIndex, 'add', parentRow)
                        "
                        v-if="
                          !row.isBackEndReturnData &&
                          item.tableList.length - 1 === childIndex
                        "
                      >
                        <div class="w-[14px] h-[14px] align-middle">C</div>
                      </CustomButton>

                      <el-popconfirm
                        v-if="item.tableList.length - 1 === childIndex"
                        :title="`是否确认删除数据么`"
                        @confirm="
                          handleChildrenData(
                            row,
                            parIndex,
                            'delete',
                            parentRow,
                            item.tableList
                          )
                        "
                      >
                        <template #reference>
                          <el-button circle type="primary">
                            <div class="w-[14px] h-[14px] align-middle">D</div>
                          </el-button>
                        </template>
                      </el-popconfirm>
                    </div>
                  </template>
                </pure-table>
                <div class="mt-2 cursor-pointer">
                  <IconifyIconOffline
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
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import icon_money from "@iconify-icons/ri/money-cny-box-fill";
import icon_circle_fill from "@iconify-icons/ri/add-circle-fill";
import { useSettle } from "./utils/hook";
import SearchForm from "./component/SearchForm.vue";
import { t } from "@/plugins/i18n";
import { message } from "@/utils/message";
import { MATCH_EVENT_CODE } from "@/utils/maps/sports_map";
import { SPORT_ID_MAP } from "@/utils/maps/sports_map";
import CustomButton from "@/components/Form/CustomButton.vue";
defineOptions({ name: "settle_admin" });

const changeEventTime = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[]
) => {
  if (childIndex === 0) return;
  if (row.eventTime <= childrenData[childIndex - 1].eventTime) {
    message("时间不能小于前一个事件发生时间", { type: "error" });
    row.eventTime = "";
  }
};

const teamChangeEvent = (
  row: SattleDataAPI.MatchEventsList,
  childIndex: number,
  childrenData: SattleDataAPI.MatchEventsList[],
  type: string
) => {
  if (!row.homeAway) return;
  if (childIndex === 0) {
    if (row.homeAway === "home") {
      row.t1 = type === "yellow_red_card" ? redOrYellow.value : 1;
      row.t2 = 0;
    } else {
      row.t1 = 0;
      row.t2 = type === "yellow_red_card" ? redOrYellow.value : 1;
    }
  } else {
    if (row.homeAway === "home") {
      row.t1 =
        +childrenData[childIndex - 1].t1 +
        (type === "yellow_red_card" ? redOrYellow.value : 1);
      row.t2 = childrenData[childIndex - 1].t2;
    } else {
      row.t2 =
        +childrenData[childIndex - 1].t2 +
        (type === "yellow_red_card" ? redOrYellow.value : 1);
      row.t1 = childrenData[childIndex - 1].t1;
    }
  }
};

const {
  loading,
  childloading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleTableWidthChange,
  handleCurrentChange,
  handleSelectionChange,
  childColumns,
  expandChange,
  addChildRow,
  editChild,
  form,
  resetForm,
  balanceLoading,
  settlementFunction,
  currentSportId,
  handleChildrenData,
  redOrYellow,
  childDataTotal
} = useSettle();

onMounted(() => {
  onSearch();
});
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

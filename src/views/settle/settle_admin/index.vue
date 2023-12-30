<template>
  <div class="main">
    <SearchForm
      :form="form"
      @resetForm="resetForm"
      :loading="loading"
      @onSearch="onSearch"
    />

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
          @expand-change="getChildRenData"
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
            <div class="m-4">
              <div class="flex mb-2">
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(icon_money)"
                  :disabled="
                    !!parentRow.halfSettlementStatus ||
                    !parentRow.childrenData.length
                  "
                  @click="settlementFunction(parentRow.matchId, 'half')"
                  :loading="balanceLoading['half']"
                >
                  {{ t("上半场结算") }}
                </el-button>
                <el-button
                  link
                  type="danger"
                  :disabled="
                    !!parentRow.fullSettlementStatus ||
                    !parentRow.childrenData.length
                  "
                  :loading="balanceLoading['all']"
                  :icon="useRenderIcon(icon_money)"
                  @click="settlementFunction(parentRow.matchId, 'all')"
                >
                  {{ t("全场结算") }}
                </el-button>
                <span class="mr-4 ml-4">{{ t("注") }}:</span>
                <span class="mr-4">A: {{ t("编辑") }}</span>
                <span class="mr-4">B: {{ t("确认修改") }}</span>
                <span class="mr-4">C: {{ t("确认新增") }}</span>
              </div>
              <pure-table
                row-key="id"
                :data="parentRow.childrenData"
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
                <template #t1="{ row, index: childIndex }">
                  <el-input
                    v-model="row.t1"
                    :maxlength="4"
                    @input="
                      editScore(
                        $event,
                        row,
                        't1',
                        childIndex,
                        parentRow.childrenData
                      )
                    "
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #t2="{ row, index: childIndex }">
                  <el-input
                    v-model="row.t2"
                    :maxlength="4"
                    @input="
                      editScore(
                        $event,
                        row,
                        't2',
                        childIndex,
                        parentRow.childrenData
                      )
                    "
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #eventCode="{ row }">
                  <el-select
                    class="w-[150px]"
                    :disabled="!row.isEdit"
                    v-model="row.eventCode"
                    :placeholder="t('请选择')"
                  >
                    <el-option :label="t('足球进球')" value="goal" />
                  </el-select>
                </template>

                <!-- <template #sportId="{ row }">
                  <el-select
                    :disabled="!row.isEdit"
                    v-model="row.sportId"
                    :placeholder="t('请选择')"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="item in SPORT_ID_MAP"
                      :key="item.value"
                    />
                  </el-select>
                </template> -->

                <template #eventTime="{ row }">
                  <el-date-picker
                    v-model="row.eventTime"
                    type="datetime"
                    :placeholder="t('请选择时间')"
                    :disabled="!row.isEdit"
                    value-format="x"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </template>

                <template #matchPeriodId="{ row }">
                  <el-select
                    :disabled="!row.isEdit"
                    v-model="row.matchPeriodId"
                    :placeholder="t('请选择')"
                  >
                    <el-option :label="t('上半场')" :value="31" />
                    <el-option :label="t('下半场')" :value="100" />
                  </el-select>
                </template>

                <template #homeAway="{ row }">
                  <div>
                    <el-select
                      :disabled="!row.isEdit"
                      v-model="row.homeAway"
                      :placeholder="t('请选择')"
                    >
                      <el-option :label="t('主场')" value="home" />
                      <el-option :label="t('客场')" value="away" />
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
                  #canceled="{ row }: { row: SattleDataAPI.MatchEventsList }"
                >
                  <el-switch
                    v-if="row.isBackEndReturnData"
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
                    <el-button circle type="primary" @click="editChild(row)">
                      <div class="w-[14px] h-[14px] align-middle">A</div>
                    </el-button>
                    <el-button
                      circle
                      v-if="row.isBackEndReturnData"
                      type="primary"
                      @click="handleChildrenData(row, parIndex, 'edit')"
                    >
                      <div class="w-[14px] h-[14px] align-middle">B</div>
                    </el-button>
                    <el-button
                      v-else
                      circle
                      type="primary"
                      @click="handleChildrenData(row, parIndex, 'add')"
                    >
                      <div class="w-[14px] h-[14px] align-middle">C</div>
                    </el-button>
                  </div>
                </template>
              </pure-table>

              <div class="mt-2 cursor-pointer">
                <IconifyIconOffline
                  width="25px"
                  :icon="icon_circle_fill"
                  @click="addChildRow(parentRow)"
                />
              </div>
            </div>
          </template>
          <template #operation="">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :fit="false"
              size="small"
              :icon="useRenderIcon(icon_money)"
            >
              {{ t("编辑") }}
            </el-button>
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
// import { SPORT_ID_MAP } from "@/utils/maps/sports_map";
defineOptions({ name: "settle_admin" });

const editScore = (
  val: string,
  row: SattleDataAPI.MatchEventsList,
  type: "t1" | "t2",
  childIndex: number,
  prevData: SattleDataAPI.MatchEventsList[]
) => {
  row[type] = val.replace(/[^\d.]/g, "").replace(/^0+(?!$)/, "");
  if (childIndex !== 0) {
    if (+row[type] <= +prevData[childIndex - 1][type] && row[type] != "") {
      row[type] = "";
      message(t("请输入正确的事件数量"), { type: "error" });
    } else {
      if (prevData[childIndex + 1] && !row.isBackEndReturnData) {
        prevData[childIndex + 1].t1 = "";
        prevData[childIndex + 1].t2 = "";
      }
      if (type === "t1") {
        row.t2 = prevData[childIndex - 1].t2;
      } else {
        row.t1 = prevData[childIndex - 1].t1;
      }
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
  getChildRenData,
  addChildRow,
  editChild,
  form,
  resetForm,
  balanceLoading,
  settlementFunction,
  handleChildrenData
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

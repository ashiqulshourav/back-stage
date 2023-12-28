<template>
  <div class="main">
    <SearchForm :loading="loading" />

    <PureTableBar
      :title="t('结算管理')"
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          row-key="matchId"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @expand-change="getChildRenData"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #sn="{ index }">{{ index + 1 }}</template>
          <template #expand="{ row, index: parentIndex }">
            <div class="m-4">
              <div class="flex mb-2">
                <el-button
                  link
                  type="primary"
                  :icon="useRenderIcon(icon_money)"
                  @click="settlementFunction(row.matchId, 'half')"
                  :loading="balanceLoading['half']"
                >
                  {{ t("上半场结算") }}
                </el-button>
                <el-button
                  link
                  type="danger"
                  :loading="balanceLoading['all']"
                  :icon="useRenderIcon(icon_money)"
                  @click="settlementFunction(row.matchId, 'all')"
                >
                  {{ t("全场结算") }}
                </el-button>
                <span class="mr-4 ml-4">注:</span>
                <span class="mr-4">A: 编辑</span>
                <span class="mr-4">B: 确认修改</span>
                <span class="mr-4">C: 确认新增</span>
              </div>
              <pure-table
                row-key="id"
                :data="row.childrenData"
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
                <template #t1="{ row }">
                  <el-input
                    v-model="row.t1"
                    :maxlength="4"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #t2="{ row }">
                  <el-input
                    v-model="row.t2"
                    :maxlength="4"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :disabled="!row.isEdit"
                  />
                </template>

                <template #eventCode="{ row }">
                  <el-select
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
                    <el-option :label="t('上半场')" :value="1" />
                    <el-option :label="t('下半场')" :value="2" />
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
                      @click="handleChildrenData(row, parentIndex, 'edit')"
                    >
                      <div class="w-[14px] h-[14px] align-middle">B</div>
                    </el-button>
                    <el-button
                      v-else
                      circle
                      type="primary"
                      @click="handleChildrenData(row, parentIndex, 'add')"
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
                  @click="addChildRow(row)"
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
import { useLeague } from "./utils/hook";
import SearchForm from "./component/SearchForm.vue";
import { t } from "@/plugins/i18n";
// import { SPORT_ID_MAP } from "@/utils/maps/sports_map";
defineOptions({ name: "settle_admin" });

const {
  loading,
  childloading,
  columns,
  dataList,
  pagination,
  onSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  childColumns,
  getChildRenData,
  addChildRow,
  editChild,
  balanceLoading,
  settlementFunction,
  handleChildrenData
} = useLeague();

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

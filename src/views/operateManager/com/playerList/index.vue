<template>
  <div class="main">
    <SearchForm
      :form="form"
      :category="props.category"
      :loading="loading"
      :labelList="labelList"
      :tenantList="tenantList"
      @on-search="onSearch"
    />
    <PureTableBar :columns="columns" @refresh="onSearch('reload')">
      <template #title>
        <div>
          <p v-if="selectedDataList.length === 0">{{ t('用户列表') }}</p>
          <div v-else class="flex gap-3 items-center">
            <p>{{ t('已选择') + selectedDataList.length + t('个用户') }}</p>
            <el-button
              v-if="hasAuth('SETTING')"
              type="primary"
              @click="openMultiModal(false)"
              >{{ t('添加标签') }}</el-button
            >
            <el-button
              v-if="hasAuth('SETTING')"
              type="warning"
              @click="openMultiModal(true)"
              >{{ t('删除标签') }}</el-button
            >
          </div>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          class="table_container"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          border
          :default-sort="{ prop: 'level', order: 'descending' }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="tableHeaderStyle"
          @selection-change="handleSelectionChange"
          @page-size-change="handleTableWidthChange"
          @page-current-change="handleCurrentChange"
        >
          <template #riskControlLabel="{ row }">
            <el-row
              v-if="row.riskControlLabelList"
              class="items-center"
              :gutter="20"
            >
              <el-col :span="row.riskControlLabelList?.length > 6 ? 20 : 24">
                <el-row :gutter="5">
                  <el-col
                    v-for="label in row.riskControlLabelList.slice(0, 6)"
                    :key="label.id"
                    :span="8"
                    class="custom_tag"
                  >
                    <el-tag
                      :style="`background-color: ${getLabelColor(
                        label.level,
                        'risk'
                      )}`"
                      class="rounded-lg w-full py-1"
                    >
                      {{ label.name }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4" v-if="row.riskControlLabelList?.length > 6">
                <el-popover
                  placement="top-end"
                  :width="300"
                  trigger="hover"
                  content="this is over"
                >
                  <template #reference>
                    <el-button v-if="hasAuth('SETTING')" class="w-full"
                      ><el-icon><Plus /></el-icon
                    ></el-button>
                  </template>
                  <template #default>
                    <el-row :gutter="20">
                      <el-col
                        v-for="label in row.riskControlLabelList"
                        :key="label.id"
                        class="custom_tag"
                        :span="8"
                      >
                        <el-tag
                          :style="`background-color: ${getLabelColor(
                            label.level,
                            'risk'
                          )}`"
                          class="rounded-lg w-full py-1 text-white text-center"
                        >
                          {{ label.name }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </el-popover>
              </el-col>
            </el-row>
          </template>
          <template #attributeLabel="{ row }">
            <el-row
              v-if="row.attributeLabelList"
              class="items-center"
              :gutter="20"
            >
              <el-col :span="row.attributeLabelList?.length > 6 ? 20 : 24">
                <el-row :gutter="5">
                  <el-col
                    v-for="label in row.attributeLabelList.slice(0, 6)"
                    :key="label.id"
                    :span="8"
                    class="custom_tag"
                  >
                    <el-tag
                      :style="`background-color: ${getLabelColor(
                        label.level,
                        'attr'
                      )}`"
                      class="rounded-lg w-full py-1"
                    >
                      {{ label.name }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                :span="4"
                v-if="
                  row.attributeLabelList && row.attributeLabelList.length > 6
                "
              >
                <el-popover
                  placement="top-end"
                  :width="300"
                  trigger="hover"
                  content="this is over"
                >
                  <template #reference>
                    <el-button class="w-full"
                      ><el-icon><Plus /></el-icon
                    ></el-button>
                  </template>
                  <template #default>
                    <el-row :gutter="20">
                      <el-col
                        v-for="label in row.attributeLabelList"
                        :key="label.id"
                        :span="8"
                        class="custom_tag"
                      >
                        <el-tag
                          :style="`background-color: ${getLabelColor(
                            label.level,
                            'attr'
                          )}`"
                          class="rounded-lg w-full py-1 text-white text-center"
                        >
                          {{ label.name }}
                        </el-tag>
                      </el-col>
                    </el-row>
                  </template>
                </el-popover>
              </el-col>
            </el-row>
          </template>
          <template #operation="{ row }">
            <el-button
              v-if="hasAuth('SETTING')"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(EditPen)"
              @click="handleUpdateUser(row)"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <EditUser
      :isEditUser="isEditUser"
      :labelList="labelList"
      :userData="userData"
      :category="props.category"
      @on-close="handleCloseEditUser"
      @on-open-record="openRecordList"
      @on-del="dispatchLabelsDel"
      @on-add="dispatchLabelsAdd"
      @on-update-user="dispatchUpdateUser"
    />
    <RecordList
      :isOpen="isOpenRecord"
      :recordForm="recordForm"
      :loading="loading"
      :recordList="recordList"
      :pagination="recordPagination"
      @on-close="isOpenRecord = false"
      @on-search="onSearchRecord"
      @selection-change="handleSelectionChange"
      @page-size-change="handleRecordTableWidthChange"
      @page-current-change="handleRecordCurrentChange"
    />
    <MultiModal
      :isOpen="isMultiModal"
      :selectedDataList="selectedDataList"
      :isDel="isMultiDel"
      :labelList="labelList"
      @on-close="isMultiModal = false"
      @on-del="dispatchLabelsDel"
      @on-add="dispatchLabelsAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { userPlayerListHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import EditUser from './component/EditUser.vue';
import RecordList from './component/RecordList.vue';
import MultiModal from './component/multiModal.vue';
import { columns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { Plus } from '@element-plus/icons-vue';
import { hasAuth } from '@/router/utils';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';

defineOptions({ name: 'OPERATEMANAGERSPORTPLAYERLIST' });
const { tableHeaderStyle } = usePublicHooks();

const props = defineProps<{
  category: number;
  venueType: number;
}>();

const {
  loading,
  dataList,
  labelList,
  tenantList,
  selectedDataList,
  recordList,
  userData,
  isEditUser,
  isOpenRecord,
  openRecordList,
  openMultiModal,
  isMultiDel,
  isMultiModal,
  recordPagination,
  pagination,
  onSearch,
  onSearchRecord,
  form,
  recordForm,
  getLabelColor,
  handleUpdateUser,
  handleTableWidthChange,
  handleCurrentChange,
  handleRecordTableWidthChange,
  handleRecordCurrentChange,
  handleSelectionChange,
  handleCloseEditUser,
  dispatchLabelsDel,
  dispatchLabelsAdd,
  dispatchUpdateUser
} = userPlayerListHook(props.category, props.venueType);
</script>

<style lang="scss">
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
.el-row {
  row-gap: 0.5rem;
}
.el-table--border .el-table__cell {
  border-right: var(--el-table-border);
  border-right-width: 2px;
}
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border-bottom: var(--el-table-border);
  border-bottom-width: 2px;
}
.custom_tag {
  .el-tag__content {
    color: white;
  }
  .el-tag__content {
    white-space: break-spaces;
    overflow: hidden;
  }
  .el-tag .el-tag__close {
    color: white;
  }
}
</style>

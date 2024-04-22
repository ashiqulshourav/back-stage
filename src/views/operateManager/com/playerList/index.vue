<template>
  <div class="main">
    <SearchForm :form="form" :category="props.category" :loading="loading" @on-search="onSearch" />
    <PureTableBar
      :columns="columns"
      @refresh="onSearch('reload')"
    >
      <template #title>
        <div>
          <p v-if="selectedDataList.length === 0">{{t('用户列表')}}</p>
          <div v-else class="flex gap-3 items-center">
            <p>{{ t('已选择') + selectedDataList.length + t('个用户') }}</p>
            <el-button v-if="hasAuth('SETTING')" type="primary" @click="isMultiLabelAdd = true">{{t('添加标签')}}</el-button>
            <el-button v-if="hasAuth('SETTING')" type="warning" @click="isMultiLabelDel = true">{{t('删除标签')}}</el-button>
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
              <el-col
                :span="
                  row.riskControlLabelList &&
                  row.riskControlLabelList.length > 6
                    ? 20
                    : 24
                "
              >
                <el-row :gutter="20">
                  <el-col
                    v-for="(label, index) in row.riskControlLabelList.slice(0, 6)"
                    :key="label.id"
                    :span="8"
                  >
                    <p
                      v-if="index < 6"
                      :style="`background-color: ${getLabelColor(
                        label.level,
                        'risk'
                      )}`"
                      class="rounded-lg py-1 text-white"
                    >
                      {{ label.name }}
                    </p>
                  </el-col>
                </el-row>
              </el-col>
              <el-col
                :span="4"
                v-if="
                  row.riskControlLabelList &&
                  row.riskControlLabelList.length > 6
                "
              >
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
                        :span="8"
                      >
                        <div
                          :style="`background-color: ${getLabelColor(
                            label.level,
                            'risk'
                          )}`"
                          class="rounded-lg py-1 text-white text-center"
                        >
                          {{ label.name }}
                        </div>
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
              <el-col
                :span="
                  row.attributeLabelList && row.attributeLabelList.length > 6
                    ? 20
                    : 24
                "
              >
                <el-row :gutter="20">
                  <el-col
                    v-for="(label, index) in row.attributeLabelList"
                    :key="label.id"
                    :span="8"
                  >
                    <p
                      v-if="index < 6"
                      :style="`background-color: ${getLabelColor(
                        label.level,
                        'risk'
                      )}`"
                      class="rounded-lg py-1 text-white"
                    >
                      {{ label.name }}
                    </p>
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
                      >
                        <div
                          :style="`background-color: ${getLabelColor(
                            label.level,
                            'risk'
                          )}`"
                          class="rounded-lg py-1 text-white text-center"
                        >
                          {{ label.name }}
                        </div>
                      </el-col>
                    </el-row>
                  </template>
                </el-popover>
              </el-col>
            </el-row>
          </template>
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              v-if="hasAuth('SETTING')"
              :size="size"
              @click="handleUpdateUser(row)"
            >
              {{ t('编辑') }}
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <el-dialog v-model="isEditUser" class="divide-y divide-slate-200" width="800">
      <template #title>
        <p class="pl-5 font-medium">{{t('用户编辑')}}</p>
      </template>
      <el-form class="p-5 max-h-[600px] overflow-y-scroll" label-width="160">
        <el-form-item prop="" :label="t('用户ID:') ">
          <el-input disabled v-model="updateUserForm.id" />
        </el-form-item>
        <el-form-item prop="" :label="t('所属商户:')">
          <el-input disabled />
        </el-form-item>
        <el-form-item prop="" :label="t('账号启用:') ">
          <el-switch
            inline-prompt
            v-model="updateUserForm.isFreeze"
            active-text="o"
            inactive-text="p"
            :active-value="1"
            :inactive-value="0"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="" :label="t('特殊限额:') ">
          <el-select v-model="updateUserForm.limitLevel">
            <el-option label="hi" value="hi" />
          </el-select>
        </el-form-item>
        <el-form-item prop="" :label="t('最后下注时间:') ">
          <p>
            {{ dayjs(updateUserForm.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </el-form-item>
        <el-form-item prop="" :label="t('风控标签: ')">
          <el-row class="flex  w-full items-center justify-between">
            <p>{{t('每个用户最多添加20个风控标签')}}</p>
            <p class="text-primary text-right cursor-pointer" @click="handelOpenRecord(1)">{{t('风控标签修改记录')}}>></p>
          </el-row>
          <el-row :gutter="20" class="mt-2 w-full">
            <el-col v-for="label in riskLabels" :key="label.id" :span="6">
              <el-row :gutter="2" class="items-center">
                <el-col :span="20">
                  <div
                    :style="`background-color: ${getLabelColor(
                      label.level,
                      'risk'
                    )}`"
                    class="rounded text-white text-center"
                  >
                    <p>
                      {{ label.name }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button
                    :icon="Close"
                    :style="`background-color: ${getLabelColor(
                      label.level,
                      'risk'
                    )}`"
                    class="w-1/2 rounded-lg"
                    v-if="hasAuth('SETTING')"
                    @click="
                      handleUserLabelDel([updateUserForm.id], [label.id])
                    "
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="mt-2 w-full" v-if="!isAddLabel.risk">
            <el-col class="flex justify-end">
              <el-button v-if="hasAuth('SETTING')" :icon="Plus" type="primary" @click="isAddLabel.risk = true" class="text-primary">添加标签</el-button>
            </el-col>
          </el-row>
          <el-row class="mt-2 w-full" v-else>
            <el-col :span="14">
              <el-select
                multiple
                clearable
                filterable
                v-model="addLabelForms.risk"
              >
              <el-option
                v-for="label in riskControlList"
                :key="label.id"
                :label="label.name"
                :value="Number(label.id)"
              />
            </el-select>
            </el-col>
            <el-col :span="10" class="flex justify-end">
              <el-button v-if="hasAuth('SETTING')" type="primary" @click="handleAddRiskLabels([updateUserForm.id])" class="w-1/3">{{t('添加')}}</el-button>
              <el-button v-if="hasAuth('SETTING')" class="w-1/3" @click="isAddLabel.risk = false">{{t('取消')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="" :label="t('属性标签:') ">
          <el-row class="flex  w-full items-center justify-between">
            <p>{{t('每个用户最多添加20个风控标签')}}</p>
            <p class="text-primary text-right cursor-pointer" @click="handelOpenRecord(2)">{{t('属性标签修改记录')}}>></p>
          </el-row>
          <el-row :gutter="20" class="mt-2 w-full">
            <el-col v-for="label in attributeLabels" :key="label.id" :span="6">
              <el-row :gutter="1" class="items-center">
                <el-col :span="20">
                  <div
                    :style="`background-color: ${getLabelColor(
                      label.level,
                      'risk'
                    )}`"
                    class="rounded text-white text-center"
                  >
                    <p>
                      {{ label.name }}
                    </p>
                  </div>
                </el-col>
                <el-col :span="4">
                  <el-button
                    :icon="Close"
                    class="w-1/2"
                    v-if="hasAuth('SETTING')"
                    :style="`background-color: ${getLabelColor(
                      label.level,
                      'risk'
                    )}`"
                    @click="
                      handleUserLabelDel([updateUserForm.id], [label.id])
                    "
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="mt-2 w-full" v-if="!isAddLabel.attr">
            <el-col class="flex justify-end">
              <el-button v-if="hasAuth('SETTING')" :icon="Plus" type="primary" @click="isAddLabel.attr = true" class="text-primary">{{t('添加标签')}}</el-button>
            </el-col>
          </el-row>
          <el-row class="mt-2 w-full" v-else>
            <el-col :span="14">
              <el-select
                multiple
                clearable
                filterable
                v-model="addLabelForms.attr"
              >
              <el-option
                v-for="label in attributeList"
                :key="label.id"
                :label="label.name"
                :value="Number(label.id)"
              />
            </el-select>
            </el-col>
            <el-col :span="10" class="flex justify-end">
              <el-button v-if="hasAuth('SETTING')" type="primary" @click="handleAddAttrLabels([updateUserForm.id])" class="w-1/3">{{t('添加')}}</el-button>
              <el-button v-if="hasAuth('SETTING')" class="w-1/3" @click="isAddLabel.risk = false">{{t('取消')}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="pr-5">
          <el-button v-if="hasAuth('SETTING')" @click="isEditUser = false">{{t('取消')}}</el-button>
          <el-button v-if="hasAuth('SETTING')" @click="isEditUser = false" type="primary">{{t('保存')}}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isOpenRecord" class="divide-y divide-slate-200" width="800">
      <template #title>
        <p class="pl-5 font-medium">{{recordForm.labelType === 1 ? t('用户风控标签修改记录') : t("属性标签修改记录")}}</p>
      </template>
      <PureTableBar
        :title="t(`用户ID：${updateUserForm.id}`)"
        :columns="recordColumns"
        @refresh="onSearchRecord('reload')"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            class="table_container"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :default-sort="{ prop: 'level', order: 'descending' }"
            :data="recordList"
            :columns="dynamicColumns"
            :pagination="recordPagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="tableHeaderStyle"
            @selection-change="handleSelectionChange"
            @page-size-change="handleRecordTableWidthChange"
            @page-current-change="handleRecordCurrentChange"
          >
          </pure-table>
        </template>
      </PureTableBar> 
      <template #footer>
        <div class="pr-5">
          <el-button v-if="hasAuth('SETTING')" type="primary" @click="isOpenRecord = false">{{t('确定')}}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isMultiLabelAdd" class="divide-y divide-slate-200" width="800">
      <template #title>
        <p class="pl-5 font-medium">{{t('添加标签')}}</p>
      </template>
      <el-form label-width="160" class="mt-4 py-5">
        <el-form-item :label="t('用户数量:')">{{ t(`已选择${selectedDataList.length}个用户`) }}</el-form-item>
        <el-form-item :label="t('添加风控标签: ')">
          <el-select
            multiple
            clearable
            filterable
            v-model="addLabelForms.risk"
            class="!w-[400px]"
            >
            <el-option
              v-for="label in riskControlList"
              :key="label.id"
              :label="label.name"
              :value="Number(label.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('添加属性标签:')">
          <el-select
            multiple
            clearable
            filterable
            v-model="addLabelForms.attr"
            class="!w-[400px]"
            >
            <el-option
              v-for="label in attributeList"
              :key="label.id"
              :label="label.name"
              :value="Number(label.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="pr-5 flex justify-center">
          <el-button v-if="hasAuth('SETTING')" type="primary" @click="handleMultiAddLabels">{{t('保存并添加')}}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="isMultiLabelDel" class="divide-y divide-slate-200" width="800">
      <template #title>
        <p class="pl-5 font-medium">{{t('删除标签')}}</p>
      </template>
      <el-form label-width="160" class="mt-4 py-5">
        <el-form-item :label="t('用户数量:')">{{ t('已选择') + selectedDataList.length + t('个用户') }}</el-form-item>
        <el-form-item :label="t('删除风控标签:')">
          <el-select
            multiple
            clearable
            filterable
            v-model="addLabelForms.risk"
            class="!w-[400px]"
            >
            <el-option
              v-for="label in riskControlList"
              :key="label.id"
              :label="label.name"
              :value="Number(label.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('删除属性标签:')">
          <el-select
            multiple
            clearable
            filterable
            v-model="addLabelForms.attr"
            class="!w-[400px]"
            >
            <el-option
              v-for="label in attributeList"
              :key="label.id"
              :label="label.name"
              :value="Number(label.id)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="pr-5 flex justify-center">
          <el-button v-if="hasAuth('SETTING')" type="primary" @click="handleMultiDelLabels">{{t('保存并删除')}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from '@/components/RePureTableBar';
import { userPlayerListHook } from './utils/hook';
import SearchForm from './component/SearchForm.vue';
import { columns, recordColumns } from './component/TableColumnList';
import { t } from '@/plugins/i18n';
import { usePublicHooks } from '@/hooks';
import { Plus, Close } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import { hasAuth } from '@/router/utils';

defineOptions({ name: 'OPERATEMANAGERSPORTPLAYERLIST' });
const { tableHeaderStyle } = usePublicHooks();

const props = defineProps<{
  category: number;
}>();

const riskControlList = reactive<UserAPI.labelType[]>([]);
const attributeList = reactive<UserAPI.labelType[]>([]);
const initRiskControlList = async () => {
  const res = await API.getLabelList({
    category: props.category
  });
  riskControlList.length = 0;
  riskControlList.push(...res.data.riskControlLabelList);
  attributeList.length = 0;
  attributeList.push(...res.data.attributeLabelList);
};

onMounted(() => {
  initRiskControlList();
})
const {
  loading,
  form,
  updateUserForm,
  recordForm,
  addLabelForms,
  dataList,
  selectedDataList,
  recordList,
  isEditUser,
  isAddLabel,
  isMultiLabelAdd,
  isMultiLabelDel,
  handelOpenRecord,
  handleMultiAddLabels,
  handleMultiDelLabels,
  isOpenRecord,
  pagination,
  recordPagination,
  onSearch,
  onSearchRecord,
  getLabelColor,
  riskLabels,
  attributeLabels,
  handleUserLabelDel,
  handleUpdateUser,
  handleTableWidthChange,
  handleCurrentChange,
  handleRecordCurrentChange,
  handleRecordTableWidthChange,
  handleSelectionChange,
  handleAddRiskLabels,
  handleAddAttrLabels,
} = userPlayerListHook(props.category);
</script>

<style lang="scss">
.el-message-box .el-message-box__btns {
  display: flex;
  flex-direction: row;
}
.el-dialog {
  padding-left: 0;
  padding-right: 0;
}
.el-row {
  row-gap: 1rem;
}
.el-table--border .el-table__cell {
  border-right: var(--el-table-border);;
  border-right-width: 2px;

}
.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
  border-bottom: var(--el-table-border);;
  border-bottom-width: 2px;
}
</style>

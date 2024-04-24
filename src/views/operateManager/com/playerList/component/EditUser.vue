<template>
  <el-dialog
    v-model="isEditUser"
    class="divide-y divide-slate-200"
    width="800"
    @close="emits('onClose')"
  >
    <template #title>
      <p class="pl-5 font-medium">{{ t('用户编辑') }}</p>
    </template>
    <el-form class="p-5 max-h-[600px] overflow-y-scroll" label-width="160">
      <el-form-item prop="" :label="userData.userName">
        <el-text>{{ userData.id }}</el-text>
      </el-form-item>
      <el-text class="font-bold">{{ t('用户标签') }}</el-text>
      <el-form-item prop="" :label="t('风控标签: ')">
        <el-row class="flex w-full items-center justify-between">
          <p>{{ t('每个用户最多添加20个风控标签') }}</p>
          <p
            @click="emits('onOpenRecord', form.id, 1)"
            class="text-primary text-right cursor-pointer"
          >
            {{ t('风控标签修改记录') }}>>
          </p>
        </el-row>
        <el-row :gutter="20" class="mt-2 w-full">
          <el-col
            v-for="label in userData.riskControlLabelList"
            :key="label.id"
            class="custom"
            :span="6"
          >
            <el-row :gutter="2" class="items-center">
              <el-col :span="20" class="custom">
                <el-tag
                  :style="`background-color: ${getLabelColor(
                    label.level,
                    'risk'
                  )}`"
                  closable
                  class="rounded w-full text-white text-center"
                  @close="handleDeleteLabel(label.id)"
                >
                  <p>
                    {{ label.name }}
                  </p>
                </el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="mt-2 w-full" v-if="!isRiskLabelAdd">
          <el-col class="flex justify-end">
            <el-button
              v-if="hasAuth('SETTING')"
              :icon="Plus"
              type="primary"
              @click="isRiskLabelAdd = true"
              class="text-primary"
              >添加标签</el-button
            >
          </el-col>
        </el-row>
        <el-row class="mt-2 w-full" v-else>
          <el-col :span="14">
            <el-select multiple clearable filterable v-model="labelForm.risk">
              <el-option
                v-for="label in labelList.risk"
                :key="label.id"
                :label="label.name"
                :value="label.id"
              />
            </el-select>
          </el-col>
          <el-col :span="10" class="flex justify-end">
            <el-button
              v-if="hasAuth('SETTING')"
              type="primary"
              @click="handleAddLabel(labelForm.risk)"
              class="w-1/3"
              >{{ t('添加') }}</el-button
            >
            <el-button
              v-if="hasAuth('SETTING')"
              class="w-1/3"
              @click="isRiskLabelAdd = false"
              >{{ t('取消') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="" :label="t('属性标签:')">
        <el-row class="flex w-full items-center justify-between">
          <p>{{ t('每个用户最多添加20个风控标签') }}</p>
          <p
            @click="emits('onOpenRecord', form.id, 2)"
            class="text-primary text-right cursor-pointer"
          >
            {{ t('属性标签修改记录') }}>>
          </p>
        </el-row>
        <el-row :gutter="20" class="mt-2 w-full">
          <el-col
            v-for="label in userData.attributeLabelList"
            :key="label.id"
            :span="6"
          >
            <el-row :gutter="2" class="items-center">
              <el-col :span="20" class="custom">
                <el-tag
                  :style="`background-color: ${getLabelColor(
                    label.level,
                    'risk'
                  )}`"
                  closable
                  @close="handleDeleteLabel(label.id)"
                  class="rounded w-full text-white text-center"
                >
                  <p>
                    {{ label.name }}
                  </p>
                </el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="mt-2 w-full" v-if="!isAttrLabelAdd">
          <el-col class="flex justify-end">
            <el-button
              v-if="hasAuth('SETTING')"
              :icon="Plus"
              type="primary"
              @click="isAttrLabelAdd = true"
              class="text-primary"
              >{{ t('添加标签') }}</el-button
            >
          </el-col>
        </el-row>
        <el-row class="mt-2 w-full" v-else>
          <el-col :span="14">
            <el-select multiple clearable filterable v-model="labelForm.attr">
              <el-option
                v-for="label in labelList.attr"
                :key="label.id"
                :label="label.name"
                :value="label.id"
              />
            </el-select>
          </el-col>
          <el-col :span="10" class="flex justify-end">
            <el-button
              v-if="hasAuth('SETTING')"
              type="primary"
              @click="handleAddLabel(labelForm.attr)"
              class="w-1/3"
              >{{ t('添加') }}</el-button
            >
            <el-button
              v-if="hasAuth('SETTING')"
              class="w-1/3"
              @click="isAttrLabelAdd = false"
              >{{ t('取消') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="t('帐号启用: ')">
        <el-switch
          v-model="form.isFreeze"
          inline-prompt
          inactive-color="#a6a6a6"
          active-text="开"
          inactive-text="关"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item :label="t('限额等级设置：')" prop="type">
        <el-select v-model="form.limitLevel" clearable>
          <el-option
            v-for="item in limitList"
            :key="item.levelLimit"
            :label="item.levelLimit"
            :value="item.levelLimit"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <pure-table
          maxHeight="500"
          align-whole="center"
          size="small"
          border
          :data="tableData"
          :columns="limitColumns"
          :header-cell-style="tableHeaderStyleBlue"
        />
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="isSpecial">
          <el-radio class="w-full" :value="false">无</el-radio>
          <el-radio class="w-full" :value="true">例外限额</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isSpecial">
        <el-row :gutter="5" class="w-full items-center">
          <el-col :span="6" class="text-center">
            <el-text>单注投注限额</el-text>
          </el-col>
          <el-col :span="6" class="text-center">
            <el-text>单注赔付限额</el-text>
          </el-col>
          <el-col :span="6" class="text-center">
            <el-text>单场赛事累计赔付限额 (不分早盘滚球)</el-text>
          </el-col>
          <el-col :span="6" class="text-center">
            <el-text>串关单日累计赔付限额 (不分早盘滚球)</el-text>
          </el-col>
          <el-col :span="6" class="text-center">
            <el-input
              v-model="form.specialLimit.productAmountTotalLimit"
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="6" class="text-center">
            <el-input
              v-model="form.specialLimit.maxWinAmountLimit"
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="6" class="text-center">
            <el-input
              v-model="
                form.specialLimit.singleEventAccumulatedCompensationLimit
              "
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="6" class="text-center">
            <el-input
              v-model="
                form.specialLimit.seriesSingleDayCumulativeCompensationLimit
              "
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item :label="t('备注：')">
        <el-input
          :formatter="(v: string) => formatNumber(v, 13)"
          placeholder="只能输入255个字符的内容"
          v-model="form.remark"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="pr-5">
        <el-button v-if="hasAuth('SETTING')" @click="emits('onClose')">{{
          t('取消')
        }}</el-button>
        <el-button
          v-if="hasAuth('SETTING')"
          @click="handleUpdate"
          type="primary"
          >{{ t('保存') }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { t } from '@/plugins/i18n';
import { hasAuth } from '@/router/utils';
import { Plus } from '@element-plus/icons-vue';
import { message } from '@/utils/message';
import { usePublicHooks } from '@/hooks';
import { ElMessageBox } from 'element-plus';

import {
  labelListType,
  updateUserFormType,
  addLabelsType,
  specialLimitType
} from '../utils/types';
import { formatNumber } from '@/utils/formatNumber';

const props = defineProps<{
  isEditUser: boolean;
  labelList: labelListType;
  userData: UserAPI.operateUserList;
}>();

const { tableHeaderStyleBlue } = usePublicHooks();

const emits = defineEmits([
  'onClose',
  'onOpenRecord',
  'onDel',
  'onAdd',
  'onUpdateUser'
]);
const limitList = reactive<UserAPI.UserLevelLimitListRes[]>([]);

const limitColumns: TableColumnList = [
  {
    label: t('单注限额'),
    prop: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付'),
    prop: 'maxWinAmountLimit'
  },
  {
    label: t('单场赛事累计赔付限额(不分早盘滚球)'),
    prop: 'userSingleGamePay'
  },
  // {
  //   label: t('单关单日累计赔付'),
  //   prop: 'singleMatchPay'
  // },
  {
    label: t('串关单日累计赔付限额(不分早盘滚球)'),
    prop: 'bunchMatchPay'
  }
  // {
  //   label: t('冠军单日累计赔付'),
  //   prop: 'championDailyPay'
  // }
];

const isEditUser = ref(props.isEditUser);
const isRiskLabelAdd = ref(false);
const isAttrLabelAdd = ref(false);
const isSpecial = ref(false);
const form = reactive<updateUserFormType>({} as updateUserFormType);

const labelForm = reactive<addLabelsType>({} as addLabelsType);
// computed
const tableData = computed(() => {
  return limitList.filter(
    (item: UserAPI.UserLevelLimitListRes) => item.levelLimit === form.limitLevel
  );
});

const getLabelColor = (label: number, type: string) => {
  if (type === 'risk') {
    switch (label) {
      case 1:
        return 'rgba(163, 0, 20, 1)';
      case 2:
        return 'rgba(255, 92, 0, 1)';
      case 3:
        return 'rgba(255, 153, 0, 1)';
    }
  } else {
    switch (label) {
      case 1:
        return 'rgba(24, 145, 255, 1)';
      case 2:
        return 'rgba(25, 190, 107, 1)';
      case 3:
        return 'rgba(46, 64, 80, 1)';
    }
  }
};

const initLimitList = async () => {
  try {
    const res = await API.getUserLevelLimitList({ type: 0 });
    limitList.length = 0;
    limitList.push(...res.data);
  } catch (error) {
    return message(error as string, { type: 'error' });
  }
};

const handleDeleteLabel = (label: number) => {
  ElMessageBox.confirm(`${t('您确定要删除吗?')} `, '系统提示', {
    type: 'warning',
    center: true
  }).then(() => {
    emits('onDel', [form.id], [label]);
    if (labelForm.attr) labelForm.attr.length = 0;
    if (labelForm.risk) labelForm.risk.length = 0;
  });
};

const handleAddLabel = (labels: number[]) => {
  ElMessageBox.confirm(`${t('您确定要增加吗?')} `, '系统提示', {
    type: 'warning',
    center: true
  }).then(() => {
    emits('onAdd', [form.id], labels);
    if (labelForm.attr) labelForm.attr.length = 0;
    if (labelForm.risk) labelForm.risk.length = 0;
    isAttrLabelAdd.value = false;
    isRiskLabelAdd.value = false;
  });
};

const handleUpdate = () => {
  ElMessageBox.confirm(`${t('您确定要保存吗?')} `, '系统提示', {
    type: 'warning',
    center: true
  }).then(() => {
    if (isSpecial.value) {
      form.specialLimit.productAmountTotalLimit = parseInt(
        form.specialLimit.productAmountTotalLimit
      );
      form.specialLimit.maxWinAmountLimit = parseInt(
        form.specialLimit.maxWinAmountLimit
      );
      form.specialLimit.singleEventAccumulatedCompensationLimit = parseInt(
        form.specialLimit.singleEventAccumulatedCompensationLimit
      );
      form.specialLimit.seriesSingleDayCumulativeCompensationLimit = parseInt(
        form.specialLimit.seriesSingleDayCumulativeCompensationLimit
      );
      emits('onUpdateUser', form);
    } else {
      emits('onUpdateUser', { ...form, specialLimit: null });
    }
  });
};

onUpdated(() => {
  initLimitList();
  const {
    id,
    isFreeze,
    limitLevel,
    remark,
    maxWinAmountLimit,
    productAmountTotalLimit,
    seriesSingleDayCumulativeCompensationLimit,
    singleEventAccumulatedCompensationLimit
  } = props.userData;
  form.id = id;
  form.isFreeze = isFreeze;
  form.limitLevel = limitLevel;
  form.remark = remark;
  form.specialLimit = {} as specialLimitType;
  if (
    maxWinAmountLimit ||
    productAmountTotalLimit ||
    seriesSingleDayCumulativeCompensationLimit ||
    singleEventAccumulatedCompensationLimit
  ) {
    isSpecial.value = true;
    form.specialLimit.maxWinAmountLimit = maxWinAmountLimit;
    form.specialLimit.productAmountTotalLimit = productAmountTotalLimit;
    form.specialLimit.seriesSingleDayCumulativeCompensationLimit =
      seriesSingleDayCumulativeCompensationLimit;
    form.specialLimit.singleEventAccumulatedCompensationLimit =
      singleEventAccumulatedCompensationLimit;
  } else {
    isSpecial.value = false;
  }
});

watch(
  () => props.isEditUser,
  (newValue: boolean) => {
    isEditUser.value = newValue;
  }
);
</script>

<style lang="scss">
.el-dialog {
  padding-left: 0;
  padding-right: 0;
}
</style>

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
            v-if="hasAuth('GETLABELLIST')"
            class="text-primary text-right cursor-pointer"
          >
            {{ t('风控标签修改记录') }}>>
          </p>
        </el-row>

        <el-row :gutter="20" class="mt-2 w-full">
          <LabelListCom
            @onClose="handleDeleteLabel"
            :labels="updatedLabels.risk"
            type="risk"
          />
        </el-row>
        <el-row class="mt-2 w-full" v-if="!isRiskLabelAdd">
          <el-col :span="24" class="!flex justify-end">
            <el-button
              v-if="hasAuth('ADDUSERLABEL')"
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
          <el-col :span="10" class="!flex justify-end">
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
              @click="handleDelLabel('risk')"
              >{{ t('取消') }}</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="" :label="t('属性标签:')">
        <el-row class="flex w-full items-center justify-between">
          <p>{{ t('每个用户最多添加20个属性标签') }}</p>
          <p
            @click="emits('onOpenRecord', form.id, 2)"
            v-if="hasAuth('GETLABELLIST')"
            class="text-primary text-right cursor-pointer"
          >
            {{ t('属性标签修改记录') }}>>
          </p>
        </el-row>
        <el-row :gutter="20" class="mt-2 w-full">
          <LabelListCom
            @onClose="handleDeleteLabel"
            :labels="updatedLabels.attr"
            type="attr"
          />
        </el-row>
        <el-row class="mt-2 w-full" v-if="!isAttrLabelAdd">
          <el-col class="!flex justify-end">
            <el-button
              v-if="hasAuth('ADDUSERLABEL')"
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
          <el-col :span="10" class="!flex justify-end">
            <el-button
              type="primary"
              @click="handleAddLabel(labelForm.attr, 'attr')"
              class="w-1/3"
              >{{ t('添加') }}</el-button
            >
            <el-button class="w-1/3" @click="handleDelLabel('attr')">{{
              t('取消')
            }}</el-button>
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
          :active-value="0"
          :inactive-value="1"
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
      <el-form-item :label="t('特殊限额: ')">
        <el-radio-group v-model="isSpecial">
          <el-radio class="w-full" :value="false">{{ t('无') }}</el-radio>
          <el-radio class="w-full" :value="true">{{ t('例外限额') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="isSpecial">
        <el-row :gutter="5" class="w-full items-center">
          <el-col :span="5" class="text-center">
            <el-text>{{ t('单注投注限额') }}</el-text>
          </el-col>
          <el-col :span="5" class="text-center">
            <el-text>{{ t('单注赔付限额') }}</el-text>
          </el-col>
          <el-col :span="7" class="text-center">
            <el-text>{{ t('单场赛事累计赔付限额(不分早盘滚球)') }}</el-text>
          </el-col>
          <el-col :span="7" class="text-center">
            <el-text>{{ t('串关单日累计赔付限额(不分早盘滚球)') }}</el-text>
          </el-col>
          <el-col :span="5" class="text-center">
            <el-input
              v-model="form.specialLimit.productAmountTotalLimit"
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="5" class="text-center">
            <el-input
              v-model="form.specialLimit.maxWinAmountLimit"
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="7" class="text-center">
            <el-input
              v-model="
                form.specialLimit.singleEventAccumulatedCompensationLimit
              "
              :formatter="(v: string) => formatNumber(v, 13)"
            />
          </el-col>
          <el-col :span="7" class="text-center">
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
          :placeholder="t('只能输入255个字符的内容')"
          maxLength="255"
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
import LabelListCom from './LabelListCom.vue';

const props = defineProps<{
  isEditUser: boolean;
  labelList: labelListType;
  userData: UserAPI.operateUserList;
  category: number;
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
    label: t('单注投注限额'),
    prop: 'productAmountTotalLimit'
  },
  {
    label: t('单注赔付限额'),
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
const updatedLabels = reactive<labelListType>({
  attr: [],
  risk: []
});
const labelForm = reactive<addLabelsType>({
  attr: [],
  risk: []
});
// computed
const tableData = computed(() => {
  return limitList.filter(
    (item: UserAPI.UserLevelLimitListRes) => item.levelLimit === form.limitLevel
  );
});

const initLimitList = async () => {
  try {
    const res = await API.getUserLevelLimitList({ type: props.category });
    limitList.length = 0;
    limitList.push(...res.data);
  } catch (error) {
    return message(error as string, { type: 'error' });
  }
};

const handleDeleteLabel = (label: number, type = 'risk') => {
  if (type === 'risk') {
    const index = updatedLabels.risk.findIndex(
      (item: UserAPI.labelType) => item.id === label
    );
    if (index !== -1) updatedLabels.risk.splice(index, 1);
  } else {
    const index = updatedLabels.attr.findIndex(
      (item: UserAPI.labelType) => item.id === label
    );
    if (index !== -1) updatedLabels.attr.splice(index, 1);
  }
  // ElMessageBox.confirm(`${t('您确定要删除吗?')} `, '系统提示', {
  //   type: 'warning',
  //   center: true
  // }).then(() => {
  //   emits('onDel', [form.id], [label]);
  //   if (labelForm.attr) labelForm.attr.length = 0;
  //   if (labelForm.risk) labelForm.risk.length = 0;
  // });
};

const handleAddLabel = (labels: number[], type = 'risk') => {
  if (type === 'risk') {
    labels.forEach((id: number) => {
      const index = updatedLabels.risk.findIndex(
        (item: UserAPI.labelType) => item.id === id
      );
      if (index === -1) {
        const tmp = props.labelList.risk.find(
          (item: UserAPI.labelType) => item.id === id
        );
        if (tmp) updatedLabels.risk.push(tmp);
      }
    });
    labelForm.risk.length = 0;
    isRiskLabelAdd.value = false;
  } else {
    labels.forEach((id: number) => {
      const index = updatedLabels.attr.findIndex(
        (item: UserAPI.labelType) => item.id === id
      );
      if (index === -1) {
        const tmp = props.labelList.attr.find(
          (item: UserAPI.labelType) => item.id === id
        );
        if (tmp) updatedLabels.attr.push(tmp);
      }
    });
    labelForm.attr.length = 0;
    isAttrLabelAdd.value = false;
  }
};

const handleDelLabel = (type = 'risk') => {
  if (type === 'risk') {
    isRiskLabelAdd.value = false;
    labelForm.risk.length = 0;
  } else {
    isAttrLabelAdd.value = false;
    labelForm.attr.length = 0;
  }
};

const handleUpdate = () => {
  ElMessageBox.confirm(`${t('您确定要保存吗?')} `, '系统提示', {
    type: 'warning',
    center: true
  }).then(() => {
    if (!form.limitLevel)
      return message('您必须要设置限额等级。', { type: 'error' });
    const {
      productAmountTotalLimit,
      maxWinAmountLimit,
      singleEventAccumulatedCompensationLimit,
      seriesSingleDayCumulativeCompensationLimit
    } = form.specialLimit;
    if (
      isSpecial.value &&
      (!productAmountTotalLimit ||
        !maxWinAmountLimit ||
        !singleEventAccumulatedCompensationLimit ||
        !seriesSingleDayCumulativeCompensationLimit)
    ) {
      message(t('必须设置所有限额才能保存'), { type: 'error' });
      return;
    }
    if (
      isSpecial.value &&
      productAmountTotalLimit &&
      maxWinAmountLimit &&
      singleEventAccumulatedCompensationLimit &&
      seriesSingleDayCumulativeCompensationLimit
    ) {
      const {
        productAmountTotalLimit: plimit,
        maxWinAmountLimit: maxlimit,
        userSingleGamePay,
        bunchMatchPay
      } = tableData.value[0];
      if (productAmountTotalLimit > plimit) {
        message(t('单注投注限额不能大于等级限额'), { type: 'error' });
        return;
      }
      if (maxWinAmountLimit > maxlimit) {
        message(t('单注赔付限额不能大于等级限额'), { type: 'error' });
        return;
      }
      if (singleEventAccumulatedCompensationLimit > userSingleGamePay) {
        message(t('单场赛事累计赔付限额不能大于等级限额'), { type: 'error' });
        return;
      }
      if (seriesSingleDayCumulativeCompensationLimit > bunchMatchPay) {
        message(t('串关单日累计赔付限额不能大于等级限额'), { type: 'error' });
        return;
      }
    }
    const addedLabels = props.userData.riskControlLabelList
      ? updatedLabels.risk.filter(
          (item: UserAPI.labelType) =>
            !props.userData.riskControlLabelList.includes(item)
        )
      : updatedLabels.risk;
    if (updatedLabels.risk.length > 20) {
      return message('您不能添加超过20个的标签。', { type: 'error' });
    }

    if (props.userData.attributeLabelList) {
      addedLabels.push(
        ...updatedLabels.attr.filter(
          (item: UserAPI.labelType) =>
            !props.userData.attributeLabelList.includes(item)
        )
      );
    } else {
      addedLabels.push(...updatedLabels.attr);
    }
    if (updatedLabels.attr.length > 20) {
      return message('您不能添加超过20个的标签。', { type: 'error' });
    }
    const AddedIds: number[] = [];
    addedLabels.forEach((item: UserAPI.labelType) => {
      AddedIds.push(item.id);
    });
    if (AddedIds.length !== 0) emits('onAdd', [form.id], AddedIds);
    const deletedLabels = props.userData.riskControlLabelList.filter(
      (item: UserAPI.labelType) => !updatedLabels.risk.includes(item)
    );
    deletedLabels.push(
      ...props.userData.attributeLabelList.filter(
        (item: UserAPI.labelType) => !updatedLabels.attr.includes(item)
      )
    );
    const deletedIds: number[] = [];
    deletedLabels.forEach((item: UserAPI.labelType) => {
      deletedIds.push(item.id);
    });
    if (deletedIds.length !== 0) emits('onDel', [form.id], deletedIds);

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
    singleEventAccumulatedCompensationLimit,
    riskControlLabelList,
    attributeLabelList
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
  updatedLabels.risk.length = 0;
  if (riskControlLabelList) {
    updatedLabels.risk.push(...riskControlLabelList);
  }
  updatedLabels.attr.length = 0;
  if (attributeLabelList) {
    updatedLabels.attr.push(...attributeLabelList);
  }
  isRiskLabelAdd.value = false;
  labelForm.risk.length = 0;
  isAttrLabelAdd.value = false;
  labelForm.attr.length = 0;
});

watch(
  () => props.isEditUser,
  (newValue: boolean) => {
    isEditUser.value = newValue;
  }
);
</script>
3
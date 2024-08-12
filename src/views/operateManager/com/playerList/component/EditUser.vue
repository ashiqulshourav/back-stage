<template>
  <el-dialog
    v-model="isEditUser"
    class="divide-y divide-slate-200"
    width="850"
    :align-center="true"
    @close="emits('onClose')"
  >
    <template #title>
      <p class="pl-5 font-medium">{{ t('用户设置') }}</p>
    </template>
    <div class="p-5 max-h-[600px] h-[600px]">
      <el-scrollbar>
        <div class="flex items-center mt-2">
          <el-form-item :label="t('用户账号: ')" class="mr-10">
            <el-text>{{ userData.userName }}</el-text>
          </el-form-item>
          <el-form-item :label="t('帐号启用: ')" v-if="hasAuth('UPDATESTATUS')">
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
        </div>

        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template #title>
              <DialogListTitle
                :title="t('属性标签')"
                :content="t('每个用户最多添加20个属性标签')"
              />
            </template>
            <div>
              <p
                @click="emits('onOpenRecord', form.id, 2)"
                v-if="hasAuth('GETLABELLIST')"
                class="text-primary text-right cursor-pointer"
              >
                {{ t('修改记录') }}>>
              </p>
              <el-row :gutter="20" class="mt-2 w-full !ml-2">
                <LabelListCom
                  @onClose="handleDeleteLabel"
                  :labels="updatedLabels.attr"
                  type="attr"
                />
              </el-row>
              <el-row class="mt-2 mr w-full" v-if="!isAttrLabelAdd">
                <el-col class="!flex justify-end">
                  <el-button
                    v-if="hasAuth('addAttributeLabel'.toUpperCase())"
                    :icon="Plus"
                    type="primary"
                    size="small"
                    @click="isAttrLabelAdd = true"
                    class="text-primary"
                    >{{ t('添加标签') }}</el-button
                  >
                </el-col>
              </el-row>
              <el-row class="mt-2 w-full" v-else>
                <el-col :span="14">
                  <el-select
                    multiple
                    clearable
                    filterable
                    v-model="labelForm.attr"
                  >
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
                    size="small"
                    >{{ t('添加') }}</el-button
                  >
                  <el-button
                    size="small"
                    class="w-1/3"
                    @click="handleDelLabel('attr')"
                    >{{ t('取消') }}</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>

          <el-collapse-item name="2">
            <template #title>
              <DialogListTitle
                :title="t('风控标签')"
                :content="t('每个用户最多添加20个风控标签')"
              />
            </template>

            <div>
              <p
                @click="emits('onOpenRecord', form.id, 1)"
                v-if="hasAuth('GETLABELLIST')"
                class="text-primary text-right cursor-pointer"
              >
                {{ t('风控标签修改记录') }}>>
              </p>
            </div>

            <el-row :gutter="20" class="mt-2 w-full !ml-2">
              <LabelListCom
                @onClose="handleDeleteLabel"
                :labels="updatedLabels.risk"
                type="risk"
              />
            </el-row>

            <el-row class="mt-2 w-full" v-if="!isRiskLabelAdd">
              <el-col :span="24" class="!flex justify-end">
                <el-button
                  v-if="hasAuth('addRiskLabel'.toUpperCase())"
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
                <el-select
                  multiple
                  clearable
                  filterable
                  v-model="labelForm.risk"
                >
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
          </el-collapse-item>

          <!-- <el-collapse-item v-if="hasAuth('settingBetDelay'.toUpperCase())">
            <template #title>
              {{ t('投注延时') }}
            </template>
            <div>
              <p
                @click="openDelayDialog"
                v-if="hasAuth('GETLABELLIST')"
                class="text-primary text-right cursor-pointer"
              >
                {{ t('修改记录') }}>>
              </p>
              <ModifyContent
                v-model:betDelay="form.betDelay"
                v-model:betDelayDj="form.betDelayDj"
                v-model:sportIds="form.sportIds"
                v-model:sportIdsDj="form.sportIdsDj"
                :category="category"
              />
            </div>
          </el-collapse-item> -->

          <el-collapse-item
            :title="t('限额等级设置')"
            name="3"
            v-if="hasAuth('settingLimitLevel'.toUpperCase())"
          >
            <!-- <p
              @click="openLimitRecordDialog"
              v-if="hasAuth('GETLABELLIST')"
              class="text-primary text-right cursor-pointer mb-2"
            >
              {{ t('修改记录') }}>>
            </p> -->
            <div class="mb-2">
              <el-select v-model="form.limitLevel" clearable>
                <el-option
                  v-for="item in limitList"
                  :key="item.levelLimit"
                  :label="item.levelLimit"
                  :value="item.levelLimit"
                />
              </el-select>
            </div>
            <pure-table
              maxHeight="500"
              align-whole="center"
              size="small"
              border
              :data="tableData"
              :columns="limitColumns"
              :header-cell-style="tableHeaderStyleBlue"
            />
          </el-collapse-item>
          <el-collapse-item
            :title="t('特殊限额')"
            name="4"
            v-if="hasAuth('settingSepcialLimit'.toUpperCase())"
          >
            <!-- <p
              @click="openSpecialLimitDialog"
              v-if="hasAuth('GETLABELLIST')"
              class="text-primary text-right cursor-pointer mb-2"
            >
              {{ t('修改记录') }}>>
            </p> -->
            <el-radio-group v-model="isSpecial">
              <el-radio class="w-full" :value="1">{{ t('无') }}</el-radio>
              <el-radio class="w-full" :value="2">{{ t('例外限额') }}</el-radio>
              <el-radio class="w-full" :value="3">{{
                t('百分比限额')
              }}</el-radio>
            </el-radio-group>

            <el-row
              :gutter="5"
              class="w-full items-center tex-xs"
              v-if="isSpecial === 2"
            >
              <el-col :span="5" class="text-center">
                <span>{{ t('单注投注限额') }}</span>
              </el-col>
              <el-col :span="5" class="text-center">
                <span>{{ t('单注赔付限额') }}</span>
              </el-col>
              <el-col :span="7" class="text-center">
                <span>{{ t('单场赛事累计赔付限额(不分早盘滚球)') }}</span>
              </el-col>
              <el-col :span="7" class="text-center">
                <span>{{ t('串关单日累计赔付限额(不分早盘滚球)') }}</span>
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
            <el-row
              :gutter="5"
              class="items-center text-xs"
              v-if="isSpecial === 3"
            >
              <el-col class="text-center" :span="5">
                <el-input
                  v-model="form.percentageLimit"
                  :formatter="(v: string) => formatNumber0to100(v, 13)"
                />
              </el-col>
              <el-col class="text-start" :span="6">
                <span>%</span>
              </el-col>
            </el-row>
          </el-collapse-item>
          <el-collapse-item :title="t('备注')">
            <el-input
              :placeholder="t('只能输入255个字符的内容')"
              maxLength="255"
              v-model="form.remark"
              type="textarea"
            />
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>

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
import DialogListTitle from './DialogListTitle.vue';
import DelayTimeDialog from './DelayTimeDialog.vue';
import LimitRecordDialog from './LimitRecordDialog.vue';
import SpecialLimitDialog from './SpecialLimitDialog.vue';
import {
  labelListType,
  updateUserFormType,
  addLabelsType,
  specialLimitType
} from '../utils/types';
import { formatNumber0to100, formatNumber } from '@/utils/formatNumber';
import LabelListCom from './LabelListCom.vue';
import ModifyContent from './ModifyContent.vue';
import { addDialog } from '@/components/ReDialog';

const props = defineProps<{
  isEditUser: boolean;
  labelList: labelListType;
  userData: UserAPI.operateUserList;
  category: number;
}>();

const activeNames = ref(['1']);
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
const isSpecial = ref(1);
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
      isSpecial.value === 2 &&
      (!productAmountTotalLimit ||
        !maxWinAmountLimit ||
        !singleEventAccumulatedCompensationLimit ||
        !seriesSingleDayCumulativeCompensationLimit)
    ) {
      message(t('必须设置所有限额才能保存'), { type: 'error' });
      return;
    }
    if (
      isSpecial.value === 2 &&
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

    //- 添加投注延时内容
    if (
      (form.betDelay && !form.sportIds) ||
      (!form.betDelay && form.sportIds) ||
      (form.betDelayDj && !form.sportIdsDj) ||
      (!form.betDelayDj && form.sportIdsDj)
    ) {
      return message(t('投注延时时间或赛种不能为空'), { type: 'error' });
    }

    form.beforeLimit = props.userData.beforeLimit;

    if (isSpecial.value == 1) {
      form.percentageLimit = undefined;
    }
    if (
      isSpecial.value == 3 &&
      (form.percentageLimit == '' ||
        form.percentageLimit == null ||
        form.percentageLimit == undefined)
    ) {
      form.percentageLimit = '100';
    }
    if (
      isSpecial.value == 3 &&
      form.percentageLimit &&
      Number(form.percentageLimit) > 100
    ) {
      form.percentageLimit = '100';
    }
    if (isSpecial.value === 2) {
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
      form.percentageLimit = undefined;
      emits('onUpdateUser', form);
    } else {
      emits('onUpdateUser', { ...form, specialLimit: null });
    }
  });
};

//- 打开投注延时弹窗
const openDelayDialog = () => {
  addDialog({
    title: t('投注延时修改记录'),
    class: 'reset_dialog',
    width: '50%',
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: () =>
      h(DelayTimeDialog, {
        id: form.id
      })
  });
};

//- 限额等级记录弹窗
const openLimitRecordDialog = () => {
  addDialog({
    title: t('限额等级修改记录'),
    class: 'reset_dialog',
    width: '50%',
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: () =>
      h(LimitRecordDialog, {
        id: form.id,
        recordType: 1
      })
  });
};

const openSpecialLimitDialog = () => {
  addDialog({
    title: t('特殊限额'),
    class: 'reset_dialog',
    width: '50%',
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: () =>
      h(SpecialLimitDialog, {
        id: form.id,
        recordType: 2
      })
  });
};

onUpdated(() => {
  initLimitList();
  const {
    id,
    isFreeze,
    limitLevel,
    remark,
    sportIds,
    sportIdsDj,
    betDelay,
    betDelayDj,
    maxWinAmountLimit,
    productAmountTotalLimit,
    seriesSingleDayCumulativeCompensationLimit,
    singleEventAccumulatedCompensationLimit,
    riskControlLabelList,
    attributeLabelList,
    percentageLimit
  } = props.userData;

  console.log({ percentageLimit });

  form.id = id;
  form.isFreeze = isFreeze;
  form.limitLevel = limitLevel;
  form.remark = remark;
  form.specialLimit = {} as specialLimitType;
  form.sportIds = sportIds;
  form.sportIdsDj = sportIdsDj;
  form.betDelay = betDelay;
  form.betDelayDj = betDelayDj;
  form.percentageLimit = percentageLimit;
  if (
    maxWinAmountLimit ||
    productAmountTotalLimit ||
    seriesSingleDayCumulativeCompensationLimit ||
    singleEventAccumulatedCompensationLimit
  ) {
    isSpecial.value = 2;
    form.specialLimit.maxWinAmountLimit = maxWinAmountLimit;
    form.specialLimit.productAmountTotalLimit = productAmountTotalLimit;
    form.specialLimit.seriesSingleDayCumulativeCompensationLimit =
      seriesSingleDayCumulativeCompensationLimit;
    form.specialLimit.singleEventAccumulatedCompensationLimit =
      singleEventAccumulatedCompensationLimit;
  } else if (percentageLimit === null) {
    isSpecial.value = 1;
  } else {
    isSpecial.value = 3;
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

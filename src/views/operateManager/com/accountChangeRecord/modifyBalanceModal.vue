<template>
  <el-form
    class="mx-20"
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="editFrom"
    :rules="formRules"
  >
    <el-form-item :label="t('增减金额')" prop="accountChangeTypeCode">
      <el-select
       v-model="editFrom.accountChangeTypeCode"
       clearable
       :placeholder="t('选择类型')">
        <el-option
          :label="t('加钱')"
          :value="91"
          :key="1"
        />
        <el-option
          :label="t('扣钱')"
          :value="90"
          :key="0"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="amount">
      <div class="w-full flex">
        <el-input
          v-model="enteredAmount"
          clearable
          type="number"
          :placeholder="t('请输入10000元')"
        />
        <div class="pl-2">{{ t('元') }}</div>
      </div>
    </el-form-item>

    <el-form-item  :label="t('备注')" prop="remark">
      <el-input
        v-model="editFrom.remark"
        maxlength="200"
        show-word-limit
        :placeholder="t('输入内容，最多200字')"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end bg-white mt-16">
    <el-button @click="close">{{ t('取消') }}</el-button>
    <el-button :disabled="!isEditFormHasNull(editFrom)" type="primary" @click="submit(t('确认操作'))">{{ t('确定') }}</el-button>
    <!-- <el-button :disabled="!isEditFormHasNull(editFrom)" type="primary" @click="openConfirmModifyBalanceDialog(t('确认操作'), editFrom)">{{ t('确定') }}</el-button> -->

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { formRules } from './util/rule';
import { useAccountChangeRecordHook } from './util/hook';
import { t } from '@/plugins/i18n';
import { modifyBalanceFormType } from './util/types';
const emits = defineEmits(['closeDialog', 'changeBalance']);
const route = useRoute();
import ConfirmModifyBalanceForm from './confirmModifyBalanceModal.vue';
import { addDialog, closeAllDialog, closeDialog } from '@/components/ReDialog';

const {
  changeBalance,
//   editFrom,
//   openConfirmModifyBalanceDialog,
} = useAccountChangeRecordHook();

const props = withDefaults(defineProps<{
  userName: string,
}>(), {});

const editFrom = reactive<modifyBalanceFormType>({
  userId: route.query.userId,
  amount: null,
  accountChangeTypeCode: null,
  remark: ''
});
  
const name = ref(props.userName);
const enteredAmount = ref(editFrom.amount);
watch(enteredAmount, (newValue) => {
  if (newValue > 10000) {
    editFrom.amount = 10000;
    enteredAmount.value = 10000;
  } else {
    editFrom.amount = newValue;
  }
});
const isEditFormHasNull = (editFrom: modifyBalanceFormType) => {
  for (const value of Object.values(editFrom)) {
        if (!value) return false;
    }
    return true;
}
  
const submit = (title: string) => { 
  addDialog({
    title,
    width: '20%',
    alignCenter: true,
    closeOnClickModal: false,
    hideFooter: true,
    contentRenderer: ({ options, index }) =>
      h(ConfirmModifyBalanceForm, {
        data: editFrom,
        userName: name.value,
        onCloseDialog: () => {
          closeDialog(options, index);
        },
        changeBalance: (amount: number) => {
          changeBalance(amount);
        },
        onCloseAllDialog: () => {
          closeAllDialog();
          // changeBalance(editFrom.amount)
          // onSearch();
        }
      })
  });
}

const formRef = ref();
const close = () => {
  emits('closeDialog');
};
</script>

<style lang="scss">
</style>
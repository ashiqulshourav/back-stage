<template>
  <el-form
    ref="formRef"
    label-width="150px"
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

    <el-form-item :label="t('元')" prop="amount">
      <el-input
        v-model="editFrom.amount"
        clearable
        type="number"
        :placeholder="t('请输入10000元')"
      />
    </el-form-item>

    <el-form-item  :label="t('备注')" prop="remark">
      <el-input
        v-model="editFrom.remark"
        maxLength="35"
        :placeholder="t('输入内容，最多200字')"
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 4 }"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end bg-white mt-4">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="openConfirmModifyBalanceDialog(t('确认操作'), editFrom)">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { formRules } from './util/rule';
import { accountChangeRecordSearchFormType } from './util/types';
import { useAccountChangeRecordHook } from './util/hook';
import { t } from '@/plugins/i18n';
const emits = defineEmits(['closeDialog']);

const {
  editFrom,
  openConfirmModifyBalanceDialog,
} = useAccountChangeRecordHook();

const props = withDefaults(defineProps<{
  userId: string,
}>(), {});

const id = ref(props.userId);

const formRef = ref();
const closeDialog = () => {
  emits('closeDialog');
};
</script>

<style lang="scss">
</style>
<template>
  <div>{{ '确认后用户' + editFrom.userId + (editFrom.accountChangeTypeCode === 91 ? '将加钱' : '将扣钱')}}</div>
  <div class="flex justify-end bg-white mt-4">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="modifyBalance">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { modifyBalanceFormType } from './util/types';
import { useAccountChangeRecordHook } from './util/hook';
import {message} from "@/utils/message";
import { t } from '@/plugins/i18n';
import {removeEmptyStringKeys} from "@/utils/utilFn";
const emits = defineEmits(['closeDialog']);

// const {
//   editFrom,
// } = useAccountChangeRecordHook();

const props = withDefaults(defineProps<{
  data: modifyBalanceFormType,
}>(), {});

const editFrom = ref(props.data);
// console.log('####user', id)

const modifyBalance = () => {
  const param = {
    userId: editFrom.value.userId,
    amount: editFrom.value.amount,
    accountChangeTypeCode: editFrom.value.accountChangeTypeCode,
    remark: editFrom.value.remark,
  }
  const params = { ...removeEmptyStringKeys(param) }
  API.getAccountChange(params).then((res)=>{
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if(res.code===0){
      emits('closeDialog');
    }
  })
}
const closeDialog = () => {
  emits('closeDialog');
};
</script>

<style lang="scss">
</style>
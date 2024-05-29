<template>
  <div class="text-center">
    {{ '确认后用户 ' + props.userName + (editFrom.accountChangeTypeCode === 91 ? ' 将加钱 ' : ' 将扣钱 ') + editFrom.amount + '元'}}
  </div>
  <div class="flex justify-end bg-white mt-4">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="modifyBalance">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {message} from "@/utils/message";
import { t } from '@/plugins/i18n';
import {removeEmptyStringKeys} from "@/utils/utilFn";
const emits = defineEmits(['closeDialog', 'closeAllDialog', ]);
const props = withDefaults(defineProps<{
  data: modifyBalanceFormType,
  userName: string,
  confirmChangeBalance:Function
}>(), {});

const editFrom = ref(props.data);
const modifyBalance = () => {
  const param = {
    userId: editFrom.value.userId,
    amount: editFrom.value.amount,
    accountChangeTypeCode: editFrom.value.accountChangeTypeCode,
    remark: editFrom.value.remark,
  }
  const params = { ...removeEmptyStringKeys(param) }
  API.getAccountChange(params).then((res) => {
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if(res.code===0){
      props.confirmChangeBalance(param.accountChangeTypeCode === 91?param.amount:-param.amount)
      emits('closeAllDialog');
    }
  })
}
const closeDialog = () => {
  emits('closeDialog');
};
</script>

<style lang="scss">
</style>

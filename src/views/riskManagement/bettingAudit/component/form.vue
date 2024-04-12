<template>
    <el-radio-group v-model="riskType"  @change="change" class="flex flex-col">
      <el-radio
         :label="item.label"
        v-for="item in selectList"
         model-value="item.value"
      >
      </el-radio>
    </el-radio-group>
    <div class="flex justify-end">
      <el-button @click="closeDialog">{{ t('取消') }}</el-button>
      <el-button type="primary" @click="confirmClick">{{
        t('确定')
      }}</el-button>
    </div>
</template>

<script setup lang="ts">
import {t} from "@/plugins/i18n";
import {ref} from "vue";
const change = (value)=>{
  console.log(33333,value)
}
const riskType = ref('');
const emits = defineEmits(['closeDialog']);
const props = defineProps<{
  list: BetOrderAPI.Detail&BetOrderAPI.BetOrderList[];
}>();
const selectList = [
  {
    label:'进球',
    value:'goal',
  },
  {
    label:'红牌',
    value:'redCard',
  },
  {
    label:'点球',
    value:'penaltyAwarded',
  },
  {
    label:'other',
    value:'other',
  }
]

const closeDialog = () => {
  emits('closeDialog');
};

/* 传,roleName,status,comment */
const confirmClick = () => {
  console.log(3333,props.list)
  let param=[];
  props.list.map((item:any)=>{
    const details = item.combineOrderDetails.map((item)=>{
      return {detailId:item.detailId,riskTimes: item.riskTimes, riskType:riskType.value,}
    })
    param.push({
      orderId:item.id,
      details:details,
    })
  })
  console.log(4444,param)
  API.bettingAuditReject(param).then((res)=>{
    emits('closeDialog');
    console.log(555,res)
  })
};
</script>

<style lang="scss"></style>

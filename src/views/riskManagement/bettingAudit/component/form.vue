<template>
  <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      :rules="formRules"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item  prop="riskType">
        <el-radio-group :inline="true" v-model="form.riskType"  class="flex">
          <el-radio
             :label="item.label"
            v-for="item in selectList"
             model-value="item.value"
          >
          </el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item  prop="other">
      <el-input  v-if="form.riskType==='other'"
                 v-model="form.others"
                 :placeholder="t('其它原因')"
                 clearable
                 :formatter="v => formatNumber(v, 30)"
                 class="!w-[150px]"
      />
      </el-form-item>

    </el-form>
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
import {formatNumber} from "@/utils/formatNumber";
import {formRules} from '../util/rule'


const formRef = ref();
const form = ref({
  riskType:'',
  others:'',
})
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
    label:'其它',
    value:'other',
  }
]

const closeDialog = () => {
  emits('closeDialog');
};

/* 传,roleName,status,comment */
const confirmClick = () => {
  console.log(3333,props.list)
  console.log(44444,form.value.riskType)
  let param=[];
  props.list.map((item:any)=>{
    const details = item.combineOrderDetails.map((item)=>{
      return {detailId:item.detailId,riskTimes: item.riskTimes, riskType:form.value.riskType,}
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

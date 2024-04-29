<template>
  <el-form
    ref="ruleFormRef"
    :inline="true"
    :model="form"
    :rules="formRules"
    class="search-form bg-bg_color w-[99/100] pt-[12px]"
  >
    <el-form-item prop="riskType">
      <el-radio-group :inline="true" v-model="form.riskType" class="flex">
        <el-radio
          :label="item.label"
          v-for="(item, idx) in selectList"
          :key="idx"
          :value="item.value"
        >
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item prop="other" class="w-full">
      <el-input
        :row="2"
        v-model="form.others"
        :placeholder="t('其它原因')"
        clearable
        class="w-full"
        maxlength="255"
        type="textarea"
      />
    </el-form-item>
  </el-form>
  <div class="flex justify-end">
    <el-button @click="closeDialog">{{ t('取消') }}</el-button>
    <el-button type="primary" @click="confirmClick">{{ t('确定') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import { formRules } from '../util/rule';
import { FormInstance } from 'element-plus/es/components/form';
import { message } from '@/utils/message';

const ruleFormRef = ref<FormInstance>();
const form = reactive({
  riskType: '',
  others: ''
});
const emits = defineEmits(['closeDialog']);
const props = defineProps<{
  list: BetOrderAPI.Detail & BetOrderAPI.BetOrderList[];
}>();

const selectList = [
  {
    label: '进球',
    value: 'goal'
  },
  {
    label: '红牌',
    value: 'redCard'
  },
  {
    label: '点球',
    value: 'penaltyAwarded'
  },
  {
    label: '其它',
    value: 'other'
  }
];

const closeDialog = () => {
  emits('closeDialog');
};

/* 传,roleName,status,comment */
const confirmClick = () => {
  const param = props.list.map((item: any) => {
    item.details.map(item2 => {
      item2.riskType = form.riskType;
      return item2;
    });
    return item;
  });
  if (ruleFormRef.value) {
    ruleFormRef.value.validate(async v => {
      if (v) {
        API.bettingAuditReject(param).then(res => {
          res.code === 0
            ? message(res.msg, { type: 'success' })
            : message(res.msg, { type: 'error' });
          if (res.code === 0) {
            emits('closeDialog');
          }
        });
      }
    });
  }
};
</script>

<style lang="scss"></style>

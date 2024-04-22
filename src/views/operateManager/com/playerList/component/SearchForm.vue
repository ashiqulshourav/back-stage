<template>
  <div class="search-form bg-bg_color pl-8 pt-[12px]">
    <el-form
      label-width="110"
      ref="formRef"
      v-model="form"
      label-position="right"
      :inline="true"
      :model="form"
    >
      <el-row class="flex justify-between items-center">
        <el-form-item prop="ids" :label="t('用户ID： ')" class="items-center">
          <el-select
            v-model="form.ids"
            multiple
            allow-create
            filterable
            default-first-option
            :reserve-keyword="false"
            placeholder="可输入1-50个用户ID，逗号隔开"
            class="!w-[260px] customInput"
          />
        </el-form-item>
        <el-form-item prop="tenantId" :label="t('商户:')" class="items-center">
          <el-select
            v-model="form.tenantIds"
            :placeholder="t('所属商户')"
            clearable
            multiple
            class="!w-[150px]"
          >
            <el-option
              :label="item.tenantName"
              :value="item.id"
              v-for="item in tenantList"
              :key="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="" :label="t('风控标签:')" class="items-center">
          <el-select
            multiple
            clearable
            class="!w-[250px]"
            v-model="form.riskControlLabelList"
          >
            <el-option
              v-for="label in riskControlList"
              :key="label.id"
              :label="label.name"
              :value="label.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="" :label="t('属性标签:')" class="items-center">
          <el-select
            multiple
            clearable
            class="!w-[250px]"
            v-model="form.attributeLabelList"
          >
            <el-option
              v-for="label in attributeList"
              :key="label.id"
              :label="label.name"
              :value="label.id"
            />
          </el-select>
        </el-form-item>
      </el-row>
      <el-row class="flex justify-between items-center" >
        <el-form-item prop="ids" :label="t('投注额: ')" class="!w-[370px]">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ids" :label="t('平台输赢: ')" class="!w-[370px]">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ids" :label="t('盈利额: ')" class="!w-[370px]">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input
                disabled
                :placeholder="t('')"
                clearable
                class="w-full"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row class="flex justify-between">
        <el-col :span="12">
          <el-form-item prop="" label="日期范围选择:">
            <CustomDate val="form.timeVal" placeholder="" />
          </el-form-item>
          <el-form-item>
            <el-button v-if="hasAuth('QUERY')" type="primary" class="!w-[120px]" @click="search"
              >搜索</el-button
            >
            <el-button v-if="hasAuth('QUERY')" class="!w-[100px]" @click="resetForm(formRef)"
              >重置</el-button
            >
          </el-form-item>
        </el-col>
        <el-col :span="12" class="flex justify-end">
          <el-form-item>
            <el-button v-if="hasAuth('EXPORT')" type="primary">批量编辑标签</el-button>
            <el-button v-if="hasAuth('EXPORT')" type="primary">导出用户列表</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import CustomDate from '@/components/Form/Custom_date.vue';
import { hasAuth } from '@/router/utils';

import type { FormInstance } from 'element-plus';

const formRef = ref<FormInstance | undefined>();
const emits = defineEmits(['onSearch']);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  category: number;
}>();
const form = ref(props.form);

onMounted(() => {
  initTenantList();
  initRiskControlList();
});

const tenantList = reactive([]);

const initTenantList = async () => {
  const res = await API.getTenantList({category: props.category});
  if (res.code) return;
  tenantList.length = 0;
  tenantList.push(...res.data.data);
};

const riskControlList = reactive<UserAPI.labelType[]>([]);
const attributeList = reactive<UserAPI.labelType[]>([]);
const initRiskControlList = async () => {
  const res = await API.getLabelList({
    category: props.category
  });
  riskControlList.length = 0;
  riskControlList.push(...res.data.riskControlLabelList);
  attributeList.length = 0;
  attributeList.push(...res.data.attributeLabelList);
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};
</script>

<style lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.el-date-editor {
  margin: 0;
}
.el-form-item__label {
  font-weight: 700;
}
.customInput {
  .el-select-dropdown {
    display: none;
  }
  .el-select__suffix {
    display: none;
  }
}
</style>

<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" v-model="form" :inline="true" :model="form">
      <el-form-item prop="ids" :label="t('用户ID： ')">
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
      <el-form-item prop="tenantId" :label="t('商户:')">
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
      <el-form-item prop="" :label="t('风控标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
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
      <el-form-item prop="" :label="t('属性标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
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

      <el-form-item prop="" label="日期范围选择:">
        <Custom_date v-model:val="selectDate" @changeDate="changeDate" />
      </el-form-item>

      <!-- <el-form-item prop="ids" :label="t('投注额: ')" class="!w-[370px]">
        <el-row class="flex justify-between">
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
          <el-col :span="1">
            <p>{{ t('-') }}</p>
          </el-col>
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="ids" :label="t('平台输赢: ')" class="!w-[370px]">
        <el-row class="flex justify-between">
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
          <el-col :span="1">
            <p>{{ t('-') }}</p>
          </el-col>
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="ids" :label="t('盈利额: ')" class="!w-[370px]">
        <el-row class="flex justify-between">
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
          <el-col :span="1">
            <p>{{ t('-') }}</p>
          </el-col>
          <el-col :span="11">
            <el-input :placeholder="t('')" clearable class="w-full" />
          </el-col>
        </el-row>
      </el-form-item> -->

      <!-- <el-form-item>
        <el-button
          v-if="hasAuth('QUERY')"
          type="primary"
          class="!w-[120px]"
          @click="search"
          >搜索</el-button
        >
        <el-button
          v-if="hasAuth('QUERY')"
          class="!w-[100px]"
          @click="resetForm(formRef)"
          >重置</el-button
        >
      </el-form-item> -->
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button v-if="hasAuth('EXPORT')" type="primary"
          >批量编辑标签</el-button
        >
        <el-button v-if="hasAuth('EXPORT')" type="primary"
          >导出用户列表</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import Custom_date from '@/components/Form/Custom_date.vue';
import { hasAuth } from '@/router/utils';
import dayjs from 'dayjs';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';

import type { FormInstance } from 'element-plus';

const formRef = ref<FormInstance | undefined>();
const emits = defineEmits(['onSearch']);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  category: number;
}>();
const form = ref(props.form);

const selectDate = ref<string[]>(['', '']);

onMounted(() => {
  initTenantList();
  initRiskControlList();
});

const tenantList = reactive<any>([]);

const initTenantList = async () => {
  const res = await API.getTenantList({ category: props.category });
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

const changeDate = (t: string[]) => {
  if (!t) {
    form.value.beginTime = '';
    form.value.endTime = '';
  } else {
    form.value.beginTime = dayjs(t[0]).format('YYYY-MM-DD');
    form.value.endTime = dayjs(t[1]).format('YYYY-MM-DD');
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  selectDate.value = ['', ''];
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

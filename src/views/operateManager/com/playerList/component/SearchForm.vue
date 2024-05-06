<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" v-model="form" :inline="true" :model="form">
      <el-form-item prop="ids" :label="t('用户ID： ')">
        <el-input
          v-model="form.ids as string"
          :placeholder="t('可输入1-50个用户ID,用逗号进行分割')"
          clearable
          ref="buttonRef"
          :formatter="formatterTxt"
          :disabled="idList.length > 50"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          width="260px"
          virtual-triggering
        >
          <div class="flex flex-start w-full flex-wrap">
            <span
              class="el-tag mr-2 mb-1"
              v-for="item in idList.filter(_ => _ !== '')"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="usernames" :label="t('用户名： ')">
        <el-input
          v-model="form.usernames as string"
          :placeholder="t('可输入1-50个用户名,用逗号进行分割')"
          clearable
          ref="buttonRef1"
          :formatter="formatterUserNames"
          :disabled="userIds.length > 50"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef1"
          :virtual-ref="buttonRef1"
          trigger="click"
          width="260px"
          virtual-triggering
        >
          <div class="flex flex-start w-full flex-wrap">
            <span
              class="el-tag mr-2 mb-1"
              v-for="item in userIds.filter(_ => _ !== '')"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item prop="tenantIds" :label="t('商户:')">
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
      <el-form-item prop="tenantCode" :label="t('商户编码:')">
        <el-input
          v-model="form.tenantCode"
          :placeholder="t('请输入商户编码')"
          v-enter="search"
          clearable
          class="!w-[120px]"
        />
      </el-form-item>
      <el-form-item prop="riskControlLabelList" :label="t('风控标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
          v-model="form.riskControlLabelList"
        >
          <el-option
            v-for="label in labelList.risk"
            :key="label.id"
            :label="label.name"
            :value="label.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="attributeLabelList" :label="t('属性标签:')">
        <el-select
          multiple
          clearable
          class="!w-[150px]"
          v-model="form.attributeLabelList"
        >
          <el-option
            v-for="label in labelList.attr"
            :key="label.id"
            :label="label.name"
            :value="label.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="limitLevel" :label="t('限额等级:')">
        <el-select
          v-model="form.limitLevel"
          :placeholder="t('限额等级')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in sportLimmitList"
            :key="item"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item prop="" label="日期范围选择:">
        <Custom_date v-model:val="selectDate" @changeDate="changeDate" />
      </el-form-item>-->
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
          v-if="hasAuth('QUERY')"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button
          v-if="hasAuth('QUERY')"
          :icon="useRenderIcon(Refresh)"
          @click="resetForm(formRef)"
        >
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import Custom_date from '@/components/Form/Custom_date.vue';
import dayjs from 'dayjs';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import { labelListType, tenantType } from '../utils/types';
import type { FormInstance } from 'element-plus';

const formRef = ref();
const buttonRef = ref();
const buttonRef1 = ref();
const emits = defineEmits(['onSearch']);
const idList = reactive<string[]>([]);
const userIds = reactive<string[]>([]);
const sportLimmitList = reactive<string[]>([]);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  category: number;
  labelList: labelListType;
  tenantList: tenantType[];
}>();

const form = ref(props.form);
const formatterUserNames = v => {
  const l = new Set(v.split(','));
  userIds.length = 0;
  userIds.push(...(Array.from(l) as string[]));
  return v;
};
const formatterTxt = v => {
  const l = new Set(v.split(','));
  idList.length = 0;
  idList.push(...(Array.from(l) as string[]));
  return v;
};
const selectDate = ref<string[]>(['', '']);

const changeDate = (t: string[]) => {
  if (!t) {
    form.value.beginTime = '';
    form.value.endTime = '';
  } else {
    form.value.beginTime = dayjs(t[0]).format('YYYY-MM-DD');
    form.value.endTime = dayjs(t[1]).format('YYYY-MM-DD');
  }
};
const getLimmitLevelList = async () => {
  const res = await API.getLimitListDropDownBox();
  if (res.code) return;
  sportLimmitList.length = 0;
  sportLimmitList.push(...res.data);
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  selectDate.value = ['', ''];
  emits('onSearch', 'reload');
};

const search = () => {
  props.form.ids = idList.filter(item => item !== '').map(item => item.trim());
  props.form.usernames = userIds
    .filter(item => item !== '')
    .map(item => item.trim());
  emits('onSearch', 'reload');
};

onMounted(() => {
  // initTenantList();
  getLimmitLevelList();
});
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

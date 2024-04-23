<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="ids">
        <el-input
          v-model="form.ids"
          :placeholder="t('请输入用户名或用户ID')"
          clearable
          v-enter="search"
          class="!w-[260px]"
        />
      </el-form-item>

      <el-form-item prop="usernames">
        <el-input
          v-model="form.usernames"
          :placeholder="t('请输入赛事ID')"
          clearable
          v-enter="search"
          class="!w-[260px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('搜索') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';

const formRef = ref();
const emits = defineEmits(['onSearch']);
const idList = reactive<string[]>([]);
const userIds = reactive<string[]>([]);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

const resetForm = (formEl: FormInstance | undefined) => {
  props.form.ids = '';
  formEl.resetFields();
  emits('onSearch', ...['reload']);
};

const search = () => {
  props.form.ids = idList.filter(item => item !== '').map(item => item.trim());
  props.form.usernames = userIds
    .filter(item => item !== '')
    .map(item => item.trim());
  emits('onSearch', ...['reload']);
};
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

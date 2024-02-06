<template>
  <div>
    <el-button size="small" type="primary" @click="childRow.isEdit = true">{{
      t('编辑')
    }}</el-button>
    <el-button size="small" type="primary" @click="childRow.isEdit = false">{{
      t('保存')
    }}</el-button>
    <el-button size="small" type="danger">{{ t('删除') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
defineProps<{
  row;
}>();
</script>

<style scoped></style>

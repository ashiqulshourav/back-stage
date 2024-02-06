<template>
  <div>
    <template v-if="!row.updatedBy && childIndex === list.length - 1">
      <el-button size="small" type="primary" @click="row.isEdit = true">{{
        t('编辑')
      }}</el-button>
      <el-button size="small" type="primary" @click="row.isEdit = false">{{
        t('保存')
      }}</el-button>
      <el-button size="small" type="danger" @click="deleteChildItem">{{
        t('删除')
      }}</el-button>
    </template>
    <span v-else>-</span>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
defineProps<{
  row: SattleDataAPI.InningEvent;
  list: SattleDataAPI.InningEvent[];
  childIndex: number;
}>();

const emits = defineEmits(['deleteChildItem']);

const deleteChildItem = () => emits('deleteChildItem');
</script>

<style scoped></style>

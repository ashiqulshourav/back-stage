<template>
  <div>
    <el-button
      size="small"
      type="primary"
      v-if="!row.isEdit"
      @click="row.isEdit = true"
      >{{ t('编辑') }}</el-button
    >
    <el-button
      v-if="row.isEdit"
      size="small"
      type="primary"
      @click="saveCurrentMatch"
      >{{ t('保存') }}</el-button
    >
    <el-button size="small" type="danger" @click="deleteChildItem">{{
      t('删除')
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { message } from '@/utils/message';
const props = defineProps<{
  row: SattleDataAPI.InningEvent;
  list: SattleDataAPI.InningEvent[];
  childIndex: number;
}>();

const saveCurrentMatch = () => {
  if (props.row.t1 === '' || props.row.t2 === '') {
    message(t('比分不能为空'), { type: 'error' });
  } else {
    props.row.isEdit = false;
  }
};

const emits = defineEmits(['deleteChildItem']);

const deleteChildItem = () => emits('deleteChildItem');
</script>

<style scoped></style>

<template>
  <el-button
    class="reset-margin"
    link
    type="default"
    :size="size"
    :icon="useRenderIcon(EditPen)"
    @click="editChild(row)"
  >
    {{ t('编辑') }}
  </el-button>

  <el-button
    class="reset-margin"
    link
    type="primary"
    :size="size"
    :disabled="!row.isEdit"
    :icon="useRenderIcon('saveIcon')"
    @click="handleChildrenData()"
  >
    {{ t('保存') }}
  </el-button>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import EditPen from '@iconify-icons/ep/edit-pen';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';

defineProps<{
  size: any;
  row: SattleDataAPI.newBasketballEventsList;
}>();

const emites = defineEmits(['editChild', 'handleChildrenData']);

const editChild = row => emites('editChild', row);

const handleChildrenData = () => emites('handleChildrenData');
</script>

<style lang="scss" scoped></style>

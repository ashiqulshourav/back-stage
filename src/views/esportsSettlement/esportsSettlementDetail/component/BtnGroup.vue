<template>
  <el-button-group class="mt-2">
    <el-button type="primary">{{ t('全部盘口') }}</el-button>
    <el-button type="info"> {{ t('第一局') }} </el-button>
    <el-button type="info"> {{ t('一局') }} </el-button>
    <el-button type="info"> {{ t('二局') }} </el-button>
    <el-button type="info"> {{ t('三局') }} </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
</script>

<style scoped></style>

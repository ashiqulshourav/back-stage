<template>
  <el-radio-group class="mt-2" v-model="btnRef">
    <el-radio-button label="1">{{ t('全部盘口') }}</el-radio-button>
    <el-radio-button label="2"> {{ t('第一局') }} </el-radio-button>
    <el-radio-button label="3"> {{ t('第一局') }} </el-radio-button>
    <el-radio-button label="4"> {{ t('第二局') }} </el-radio-button>
    <el-radio-button label="5"> {{ t('第三局') }} </el-radio-button>
  </el-radio-group>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
const btnRef = ref(1);
</script>

<style scoped></style>

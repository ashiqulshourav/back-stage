<template>
  <TradingBase :type="t('early')" />
</template>

<script setup lang="ts">
import TradingBase from '../com/TradingBase.vue';
import { t } from '@/plugins/i18n';

defineOptions({ name: 'SPORTTRADING_PREMATCH' });
</script>

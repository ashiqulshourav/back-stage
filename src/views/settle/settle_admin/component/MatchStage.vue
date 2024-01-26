<template>
  <el-select
    :class="[row.canceled === 1 && 'canceled', '!w-[150px]']"
    :disabled="!row.isEdit"
    v-model="row.matchPeriodId"
    :placeholder="t('请选择')"
  >
    <el-option
      :label="
        row.eventCode === MatchEventType.MatchStatus
          ? t('上半场结束')
          : t('上半场')
      "
      :value="row.eventCode === MatchEventType.MatchStatus ? 31 : 6"
    />
    <el-option
      :label="
        row.eventCode === MatchEventType.MatchStatus
          ? t('下半场结束')
          : t('下半场')
      "
      :value="row.eventCode === MatchEventType.MatchStatus ? 100 : 7"
    />
  </el-select>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { MatchEventRowType, MatchEventType } from '../utils/type';

defineProps<Omit<MatchEventRowType, 'index'>>();
</script>

<style lang="scss">
.canceled {
  i {
    display: none;
  }
}
</style>

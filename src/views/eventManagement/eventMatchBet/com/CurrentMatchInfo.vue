<template>
  <div class="bg-bg_color">
    <el-descriptions :column="4" border class="px-4 pt-1 pb-4">
      <el-descriptions-item
        :label="t('主队')"
        label-align="center"
        align="center"
        label-class-name="my-label"
        width="150px"
      >
        {{ matchData.homeTeamNameCn ? matchData.homeTeamNameCn : '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('客队')" align="center">
        {{ matchData.awayTeamNameCn ? matchData.awayTeamNameCn : '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="t('开赛时间')" align="center">
        {{
          matchData?.beginTime
            ? dayjs(matchData.beginTime).format('YYYY-MM-DD HH:MM:ss')
            : '-'
        }}
      </el-descriptions-item>

      <el-descriptions-item :label="t('赛事状态')" align="center">
        {{
          matchData?.matchStatus
            ? MATCH_STATUS[matchData?.matchStatus as keyof typeof MATCH_STATUS]
            : '-'
        }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import dayjs from 'dayjs';
import { MATCH_STATUS } from '@/utils/maps/sports_map';

defineProps<{
  matchData: EventAPI.getMatchStatusticData;
}>();
</script>

<style scoped></style>

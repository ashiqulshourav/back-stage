<template>
  <div class="flex">
    <div class="flex mr-2">
      <el-button
        size="small"
        :type="
          currentMatch.status === MATCH_STATUS.nover ? 'danger' : 'primary'
        "
        >{{
          currentMatch.status === MATCH_STATUS.nover ? t('滚球') : t('早盘')
        }}</el-button
      >
      <el-button size="small" color="#337ecc">{{ t('足球') }}</el-button>
    </div>
    <div class="flex items-start">
      <div class="flex text-sm">
        <div class="flex flex-col w-full">
          <div
            v-if="currentMatch.leagueId"
            class="flex items-center cursor-pointer"
            v-copy:click="{
              val: currentMatch.leagueId,
              tip: t('联赛ID复制成功')
            }"
          >
            <span
              class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white"
            >
              <span class="scale-75">
                {{
                  currentMatch?.level === 200 ? t('未') : currentMatch?.level
                }}
              </span>
              {{}}
            </span>
            <span class="text-[#409EFF] text-xs ml-1 font-bold">
              {{ currentMatch?.leagueNameCn }}
            </span>
          </div>
          <span class="text-xs mt-1">{{ currentMatch?.beginTime }}</span>
        </div>
      </div>
      <div
        v-if="currentMatch.matchId"
        class="flex flex-col items-start pl-3 ml-3 text-sm cursor-pointer"
        v-copy:click="{
          val: currentMatch.matchId,
          tip: t('赛事ID复制成功')
        }"
      >
        <div class="flex">
          <div :class="['text-[--el-color-primary] text-xs flex items-center']">
            <span>{{ currentMatch?.homeTeamNameCn }}</span>
            <span
              class="w-4 font-bold h-4 flex items-center text-xs scale-75 justify-center bg-[--el-color-warning] text-white rounded-full leading-4"
              >{{ t('主') }}</span
            >
          </div>
          <div class="text-[--el-color-primary] !mr-1 !ml-1 text-xs">V</div>
          <div class="text-[--el-color-danger] text-xs">
            {{ currentMatch?.awayTeamNameCn }}
          </div>
        </div>
        <div class="flex mt-1 cursor-pointer text-xs">
          <IconGroup
            :closeThreeIcon="true"
            :typeNum="currentMatch?.isSale"
            @changeMatchStatus="changeMatchStatus"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import IconGroup from '../../com/IconGroup.vue';
import { MATCH_STATUS } from '../../util/playMap';

const props = defineProps<{
  currentMatch: sportTradingDataAPI.getAlarmMatchListType;
}>();

const emits = defineEmits(['changeSelectType', 'changeStatus']);

//- 修改图标类型
const changeMatchStatus = (status: number) => {
  emits('changeStatus', {
    matchId: props.currentMatch.matchId,
    status,
    classify: 'match'
  });
};
</script>

<style scoped></style>

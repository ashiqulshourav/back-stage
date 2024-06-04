<template>
  <div class="flex w-full justify-between">
    <div class="flex items-center">
      <div
        v-if="currentMatch.leagueId"
        class="flex items-center cursor-pointer 2xl:w-full xl:w-1/3"
        v-copy:click="{
          val: currentMatch.leagueId,
          tip: t('联赛ID复制成功')
        }"
      >
        <span
          class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white flex-shrink-0 mr-1"
        >
          <span class="scale-75 font-bold">
            {{ currentMatch?.level === 200 ? t('未') : currentMatch?.level }}
          </span>
        </span>
        <ReText
          class="leading-none flex-grow"
          type="primary"
          size="small"
          :tippyProps="{ content: currentMatch.leagueNameCn }"
        >
          {{ currentMatch.leagueNameCn }}
        </ReText>
      </div>

      <div
        v-if="currentMatch.matchId"
        class="flex 2xl:ml-5 xl:ml-1 cursor-pointer flex-grow"
        v-copy:click="{
          val: currentMatch.matchId,
          tip: t('赛事ID复制成功')
        }"
      >
        <div
          class="text-[--el-color-primary] flex items-center 2xl:!w-full xl:!w-[40%]"
        >
          <ReText
            class="leading-none flex-grow"
            :type="
              currentMatch.HandicapTeam?.toUpperCase() === 'HOME'
                ? 'danger'
                : 'primary'
            "
            size="small"
            :tippyProps="{ content: currentMatch.homeTeamNameCn }"
          >
            {{ currentMatch.homeTeamNameCn }}
          </ReText>
          <span
            class="w-5 font-bold h-5 flex items-center text-[12px] scale-75 justify-center bg-[--el-color-warning] flex-shrink-0 text-white rounded-full"
            >{{ t('主') }}</span
          >
        </div>
        <div :class="['text-[--el-color-primary] !mr-1 !ml-1']">V</div>
        <div class="text-[--el-color-danger] 2xl:!w-full xl:!w-[40%]">
          <ReText
            class="leading-none"
            :type="
              currentMatch.HandicapTeam?.toUpperCase() === 'AWAY'
                ? 'danger'
                : 'primary'
            "
            size="small"
            :tippyProps="{ content: currentMatch.awayTeamNameCn }"
          >
            {{ currentMatch.awayTeamNameCn }}
          </ReText>
        </div>
      </div>
    </div>
    <div class="flex flex-grow justify-end">
      <el-button
        round
        size="small"
        class="xl:!ml-1 2xl:!ml-3"
        v-for="(item, index) in handicapList"
        :key="index"
        :type="selectContentType === item.listType ? 'primary' : ''"
        @click="changeSelectType(item.listType)"
        >{{ item.val }}({{ item.amount }})</el-button
      >
    </div>
  </div>
  <div class="flex items-center pl-3 pt-1 mb-2">
    <span>{{ currentMatch?.beginTime }}</span>
    <div class="flex pl-2 cursor-pointer">
      <IconGroup
        :close-three-icon="true"
        :typeNum="currentMatch?.isSale"
        @changeMatchStatus="changeMatchStatus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import { t } from '@/plugins/i18n';
import IconGroup from './IconGroup.vue';
import { ReText } from '@/components/ReText';

defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
}>();

const emits = defineEmits(['changeSelectType', 'changeStatus']);
//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
};

//- 修改图标类型
const changeMatchStatus = (status: number) => {
  emits('changeStatus', {
    status,
    classify: 'match'
  });
};
</script>

<style scoped></style>

<template>
  <div class="flex">
    <div class="flex items-center w-full">
      <div class="flex items-center">
        <span
          class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white"
        >
          <span class="scale-75">
            {{ currentMatch?.level === 200 ? t('未') : currentMatch?.level }}
          </span>
          {{}}
        </span>
        <span class="text-[#409EFF] ml-1">{{
          currentMatch?.leagueNameCn
        }}</span>
      </div>
      <div class="flex ml-5">
        <div :class="['text-[--el-color-primary] flex items-center']">
          <span>{{ currentMatch?.homeTeamNameCn }}</span>
          <span
            class="w-4 font-bold h-4 flex items-center text-[12px] scale-75 justify-center bg-[--el-color-warning] text-white rounded-full leading-4"
            >{{ t('主') }}</span
          >
        </div>
        <div :class="['text-[--el-color-primary] !mr-1 !ml-1']">V</div>
        <div :class="['text-[--el-color-danger]']">
          {{ currentMatch?.awayTeamNameCn }}
        </div>
      </div>
    </div>
    <div class="flex ml-5">
      <el-button
        round
        size="small"
        v-for="(item, index) in handicapList"
        :key="index"
        :type="selectContentType === item.listType ? 'primary' : ''"
        >{{ item.val }}({{ item.amount }})</el-button
      >
    </div>
  </div>
  <div class="flex items-center pl-3 pt-1 mb-2">
    <span>{{ currentMatch?.beginTime }}</span>
    <div class="flex pl-2">
      <IconGroup />
    </div>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import { t } from '@/plugins/i18n';

defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
}>();
</script>

<style scoped></style>

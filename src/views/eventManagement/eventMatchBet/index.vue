<template>
  <div class="main h-full flex flex-col">
    <SearchFrom :form="form" :loading="loading" @on-search="onSearch" />
    <div class="p-t-[10px]">
      <div
        class="relative pl-20 w-full bg-[#6AA1FF] text-white dark:bg-[#3e3e3e]"
      >
        <TimeLine />
        <div>
          <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
            <LineCom />
            <EventIcon
              v-for="(item, index) in matchData.event"
              :key="index"
              :type="t('主队')"
              :data="item.home"
              :index="index"
            />
          </div>

          <BetAmount
            :renderList="matchData.bet"
            v-if="form.matchId && Object.values(matchData).length"
          />
          <el-empty
            v-else
            :description="t('请先进行赛事选择')"
            :image-size="60"
          />

          <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
            <LineCom />
            <EventIcon
              v-for="(item, index) in matchData.event"
              :key="index"
              :type="t('客队')"
              :data="item.away"
              :index="index"
            />
          </div>
        </div>

        <!-- - 左侧球队信息 -->
        <div
          :class="[
            'absolute top-[35px] flex items-center left-2 cursor-pointer',
            i === 1 && 'top-auto bottom-2'
          ]"
          v-for="i in [0, 1]"
          :key="i"
        >
          <el-tooltip
            :content="
              i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn
            "
            placement="top-start"
          >
            <el-image
              loading="lazy"
              :src="i === 0 ? homePic : awayPic"
              fit="fill"
              class="!w-[60px] h-[20px]"
            >
              <template #error>
                <span class="text-xs">{{
                  i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn
                }}</span>
              </template>
            </el-image>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchFrom from './com/SearchFrom.vue';
import { useEventMatchBet } from './util/hook';
import { t } from '@/plugins/i18n';
import EventIcon from './com/EventIcon.vue';
import LineCom from './com/LineCom.vue';
import TimeLine from './com/TimeLine.vue';
import BetAmount from './com/BetAmount.vue';

const { loading, onSearch, form, matchData } = useEventMatchBet();

const homePic = computed(() => {
  if (!matchData.homeTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${matchData.homeTeamLogo}`;
  }
});
const awayPic = computed(() => {
  if (!matchData.awayTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${matchData.awayTeamLogo}`;
  }
});
</script>

<style scoped lang="scss"></style>
<style lang="scss">
.el-scrollbar__view {
  height: calc(100% - 20px);
}
</style>

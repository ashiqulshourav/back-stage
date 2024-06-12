<template>
  <div class="pt-[20px]">
    <div class="relative pl-10 pr-5 w-full text-white dark:bg-[#3e3e3e]">
      <TimeLine />
      <div>
        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('主队')"
            :data="item.home"
            :index="index"
          />
        </div>

        <!-- - 内容部分 -->
        <BetAmount :renderList="renderList" :matchId="matchId" />

        <div class="bg-[#deedfe] dark:bg-[#676877] h-[35px] flex relative">
          <EventIcon
            v-for="(item, index) in matchData.event"
            :key="index"
            :type="t('客队')"
            :data="item.away"
            :index="index"
          />
        </div>
      </div>
      <TimeLine />

      <!-- - 左侧球队信息 -->
      <div
        :class="[
          'absolute top-[30px] flex items-center left-0 cursor-pointer justify-center',
          i === 1 && '!top-auto bottom-2'
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
          <img
            :src="i === 0 ? homePic : awayPic"
            class="h-[30px]"
            :alt="i === 0 ? matchData.homeTeamNameCn : matchData.awayTeamNameCn"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import EventIcon from './com/EventIcon.vue';
import TimeLine from './com/TimeLine.vue';
import BetAmount from './com/BetAmount.vue';

const props = defineProps<{
  matchData: EventAPI.getMatchStatusticData;
  matchId: string;
}>();

const renderList = computed(() => {
  const s = props.matchData.bet.map(item => {
    let time = item.t.split(':');
    let t = +time[1];
    t = ((t / 60) * 100) / 100;
    t = +(+time[0] + t).toFixed(2);
    return [t, item.n, item.t, item.o];
  });
  return s;
});

const homePic = computed(() => {
  if (!props.matchData.homeTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.homeTeamLogo}`;
  }
});
const awayPic = computed(() => {
  if (!props.matchData.awayTeamLogo) {
    return '';
  } else {
    return `https://awdpdownloads.domaf.com${props.matchData.awayTeamLogo}`;
  }
});
</script>

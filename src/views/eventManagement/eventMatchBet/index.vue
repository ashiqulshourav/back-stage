<template>
  <div class="main h-full flex flex-col">
    <SearchFrom :form="form" :loading="loading" @on-search="onSearch" />
    <div class="flex-grow p-t-[10px] flex items-center justify-center">
      <div
        class="relative pl-20 pr-5 w-full bg-[#409eff] text-white dark:bg-[#3e3e3e]"
      >
        <div class="relative flex h-[30px] leading-[30px]">
          <div
            v-for="i in 100"
            :key="i"
            :class="[
              'flex justify-center w-[1%]',
              (i - 1 == 45 || i - 1 === 90) && '!text-[#ec8d27]'
            ]"
          >
            {{
              i - 1 === 90
                ? 'End90'
                : i - 1 == 45
                ? 'HT'
                : (i - 1) % 15 === 0
                ? i - 1 + "'"
                : ''
            }}
          </div>
        </div>
        <div>
          <div class="bg-[#fabb37] dark:bg-[#676877] h-[35px] flex relative">
            <div
              class="h-full flex justify-center w-[1%]"
              v-for="d in 100"
              :key="d"
            >
              <div
                v-if="(d - 1) % 15 === 0 && d !== 1"
                :class="[
                  'w-[1px] h-full bg-[#dcdfe6] dark:bg-[#363536]',
                  d - 1 === 45 && 'dark:bg-[#5f5246]'
                ]"
              ></div>
            </div>
            <div
              v-for="(item, index) in matchData.event"
              :key="index"
              :class="`absolute h-full left-[${index}%]`"
            >
              <div
                class="absolute flex items-center h-full"
                v-if="item.home.length"
              >
                <img
                  class="w-4 h-4"
                  v-for="(s, l) in item.home"
                  :key="l"
                  :src="IconMap[s.type as keyof typeof IconMap]"
                />
              </div>
            </div>
          </div>

          <div
            class="relative h-[140px]"
            v-if="form.matchId && Object.values(matchData).length"
          >
            <div
              class="absolute w-[1px] h-full left-[45.45%] translate-x-[-50%] bg-[#dcdfe6] dark:bg-[#363536]"
            ></div>
            <div
              class="w-full absolute bottom-[10px] -translate-y-1/2 bg-[#00e8ff] dark:bg-[#676877] h-[1px]"
            ></div>
            <div
              :class="[
                'absolute bottom-[14px] cursor-pointer px-[2px]  w-[1%] left-0'
              ]"
            >
              <div class="bg-[#eeb683] h-[100px]"></div>
            </div>
            <div
              :class="[
                'absolute bottom-[14px] cursor-pointer px-[2px]  w-[1%] left-[2%]'
              ]"
            >
              <div class="bg-[#eeb683] h-[20px]"></div>
            </div>
          </div>

          <el-empty
            v-else
            :description="t('请先进行赛事选择')"
            :image-size="60"
          />

          <div class="bg-[#fabb37] dark:bg-[#676877] h-[35px] flex">
            <div
              class="h-full flex justify-center w-[1%]"
              v-for="d in 100"
              :key="d"
            >
              <div
                v-if="(d - 1) % 15 === 0 && d !== 1"
                :class="[
                  'w-[1px] h-full bg-[#dcdfe6] dark:bg-[#363536]',
                  d - 1 === 45 && 'bg-[#5f5246]'
                ]"
              ></div>
            </div>
          </div>
        </div>

        <!-- - 球队信息 -->
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

const { loading, onSearch, form, matchData } = useEventMatchBet();

//- 图标列表
const IconMap = {
  goal: new URL('@/assets/event_img/goal.png', import.meta.url).href
};

console.log('index.vue文件 149==============行打印=', IconMap);

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

<template>
  <div class="flex flex-col">
    <MatchTitle @changeStatus="changeStatus" :current-match="matchData" />

    <!-- - 赛事内容列表 -->
    <div class="w-ful overflow-y-auto pl-5 pt-1" @mouseleave="clearTime">
      <div
        class="ml-24 mt-2 flex"
        :name="index"
        v-for="(item, index) in matchData.renderList"
        :key="index"
      >
        <div class="flex items-center self-start w-[160px]">
          <el-button type="primary" size="small">
            {{ item.val }}
          </el-button>
          <div class="flex justify-between ml-4 text-xs cursor-pointer">
            <IconGroup
              :typeNum="item.isSale"
              @changeMatchStatus="
                status =>
                  changeStatus({
                    matchId: matchData.matchId,
                    status,
                    classify: 'category',
                    betItemsIdList: item.betItemsIdList,
                    item
                  })
              "
            />
          </div>
        </div>

        <div class="flex-grow text-xs overflow-x-hidden">
          <div
            class="ml-5 flex w-full border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] mb-2"
            v-for="(_, idx) in item.list"
            :key="idx"
          >
            <div
              class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px] pr-2"
            >
              <span class="text-[#409EFF] font-bold">{{ _.betItemsName }}</span>

              <div class="flex pl-2 cursor-pointer">
                <IconGroup
                  :typeNum="_.isSale"
                  @changeMatchStatus="
                    status =>
                      changeStatus({
                        matchId: matchData.matchId,
                        status,
                        classify: 'pan',
                        betItemsIdList: _.betItemsIdList,
                        categoryData: _
                      })
                  "
                />
              </div>
            </div>

            <div class="flex-grow text-sx">
              <div
                v-for="(d, i) in _.kindsCodeDtoList"
                :key="i"
                class="border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#503e3e]"
              >
                <div
                  @mouseleave="e => mouseEvent(e, s, 'leave')"
                  :class="[
                    'flex w-full items-center h-[35px]',
                    l === 0 && 'bg-[--el-color-primary-light-9]'
                  ]"
                  v-for="(s, l) in d.betItemsDtoList"
                  :key="`${i}-${l}`"
                >
                  <div class="text-[--el-color-primary] text-center w-1/5">
                    {{
                      PLAY_MATCH_NAME(
                        s.kindsCode,
                        s.handicap,
                        matchData.homeTeamNameCn,
                        matchData.awayTeamNameCn
                      )[s.homeOrAway ? s.homeOrAway : s.handicap] ??
                      goalScoring(
                        s.kindsCode,
                        s.handicap,
                        s.n,
                        matchData.homeTeamNameCn,
                        matchData.awayTeamNameCn,
                        s.renderName
                      )
                    }}
                  </div>
                  <div class="text-center w-1/5">
                    {{ s.odds.toFixed(2) }}
                  </div>
                  <InputCom
                    :s="s"
                    @changeMouse="
                      (e, s, type) => mouseEvent(e, s, type, d.betItemsDtoList)
                    "
                    :selectNum="selectNum"
                    :selectItem="selectItem"
                    @changeSelectNum="(n:number) => shortcutSelectNum(n,'input')"
                  />
                  <div class="text-[--el-color-primary] w-1/6 text-center">
                    {{ s.betCount }}/{{ s.betAmount }}
                  </div>
                  <div
                    class="text-[--el-color-primary] w-1/6 text-center"
                    v-if="l === 0"
                  >
                    {{ d.betAmountDiffer ?? '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- scroll滚动条 -->
      <div
        v-show="isShowScroll"
        class="fixed w-16 bg-[--el-color-primary-light-8] flex flex-col pt-2 pb-2 border-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
        :style="scrollPostitonObj"
      >
        <el-scrollbar ref="scrollRef" height="180px">
          <div class="flex flex-col">
            <span
              @click="shortcutSelectNum(item, 'shortcut')"
              v-for="item in numberList()"
              :key="item"
              :class="[
                'w-full text-[--el-color-primary] text-sm text-center cursor-pointer',
                item === 0 && 'bg-[--el-color-primary-dark-2] !text-white'
              ]"
            >
              {{ item > 0 ? '+' : '' }}{{ item }}
            </span>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MatchTitle from './MatchTitle.vue';
import { addition, subtraction } from '@pureadmin/utils';
import IconGroup from '../../com/IconGroup.vue';
import { PLAY_MATCH_NAME, goalScoring } from '../../util/playMap';
import InputCom from '../../com/InputCom.vue';

const scrollRef = ref();
const betItemsDtoList = reactive<sportTradingDataAPI.BetItemsDtoList[]>([]);
const props = defineProps<{
  matchData: sportTradingDataAPI.getAlarmMatchListType;
  matchList: sportTradingDataAPI.getAlarmMatchListType[];
}>();

watch(
  () => props.matchData,
  () => {
    nextTick(() => {
      scrollRef.value.scrollTo(0, 520);
    });
  },
  {
    deep: true
  }
);

//-快捷选择数字事件
const selectNum = ref(0);
const shortcutSelectNum = (_: number, type: string) => {
  if (_ === 0) return;
  type === 'shortcut' && (selectNum.value = _);
  const params: { betItemsId: number; dpOdds: number }[] = [];

  //- 下盘需要递减
  if (betItemsDtoList.length === 2) {
    const otherIdx = betItemsDtoList.findIndex(
      item => item.betItemsId !== selectItem.betItemsId
    );
    const d = betItemsDtoList.find(
      item => item.betItemsId !== selectItem.betItemsId
    ) as sportTradingDataAPI.BetItemsDtoList;
    if (_ > 0) {
      d.dpOdds = subtraction(d.dpOdds, Math.abs(_), 2);
    } else {
      d.dpOdds = addition(d.dpOdds, Math.abs(_), 2);
    }
    params.push(
      ...betItemsDtoList.map((d, index: number) => ({
        betItemsId: d.betItemsId,
        dpOdds: index !== otherIdx ? _ : _ * -1
      }))
    );
    emits('sendNewOdds', params);
  } else {
    //- 长度大于3的盘口
    const d = betItemsDtoList.find(
      item => item.betItemsId === selectItem.betItemsId
    ) as sportTradingDataAPI.BetItemsDtoList;
    nextTick(() => {
      params.push({
        betItemsId: d.betItemsId,
        dpOdds: _
      });
      emits('sendNewOdds', params);
    });
  }
  nextTick(() => type === 'shortcut' && (selectNum.value = 0));
};

const selectItem = reactive<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);

const emits = defineEmits([
  'changeSelectType',
  'clearMatchTime',
  'changeStatus',
  'sendNewOdds'
]);

const isShowScroll = ref(false);
const scrollPostitonObj = reactive({ left: '0px', top: '0px' });

const clearTime = () => {
  emits('clearMatchTime', -1);
  isShowScroll.value = false;
};

const numberList = (): number[] => {
  const arr = [];
  for (let i = 0.3; i >= -0.3; i = subtraction(i, 0.01, 2)) {
    arr.push(i);
  }
  return arr;
};

const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave',
  list?: sportTradingDataAPI.BetItemsDtoList[]
) => {
  props.matchList.forEach(item => {
    item.renderList.forEach(_ => {
      _.list.forEach(d => {
        d.kindsCodeDtoList.forEach(_ => {
          _.betItemsDtoList.forEach(r => {
            r.sourceBetItemsId = -1;
          });
        });
      });
    });
  });
  //- 进入之后清空所有内容
  if (type === 'enter') {
    Object.assign(selectItem, s);
    scrollPostitonObj.left = `${e.target.getBoundingClientRect().left + 70}px`;
    scrollPostitonObj.top = `${e.target.getBoundingClientRect().top - 170}px`;
    betItemsDtoList.length = 0;
    betItemsDtoList.push(...(list as sportTradingDataAPI.BetItemsDtoList[]));
  }
  isShowScroll.value = type === 'enter';
  s.sourceBetItemsId = type === 'enter' ? 1 : -1;
  emits('clearMatchTime', s.sourceBetItemsId);
};

//- 修改图标状态(包含盘，赛事，玩法)
const changeStatus = (d: {
  matchId: number;
  status: number;
  classify?: 'match' | 'category' | 'pan';
  betItemsIdList?: number[];
  categoryData?: sportTradingDataAPI.MainListType;
  item?: sportTradingDataAPI.renderListType;
}) => {
  emits('changeStatus', d);
};
</script>

<style scoped></style>

<template>
  <div class="pl-5 pr-5 text-sm flex-grow w-full">
    <ContentTitle
      :currentMatch="currentMatch"
      :handicapList="handicapList"
      :selectContentType="selectContentType"
      @changeSelectType="changeSelectType"
      @changeStatus="changeStatus"
    />
    <!-- - 赛事内容列表 -->
    <div
      class="w-full overflow-hidden pl-5 h-[calc(100%-60px)]"
      @mouseleave="clearTime"
    >
      <div
        class="flex items-center justify-center min-h-[500px]"
        v-if="panIsEmpty"
      >
        <el-empty :description="t('暂无数据')" :image-size="100" />
      </div>
      <template v-else>
        <el-scrollbar ref="contentScrollRef">
          <el-collapse ref="collapseRef" v-model="activeNames">
            <el-collapse-item
              :name="index"
              v-for="(item, index) in handicapList"
              :key="index"
            >
              <template #title>
                <div class="flex items-center">
                  <el-button type="primary" size="small">
                    {{ item.val }}
                  </el-button>
                  <div class="flex justify-between ml-4">
                    <IconGroup
                      :typeNum="item.isSale"
                      @changeMatchStatus="
                        status =>
                          changeStatus({
                            status,
                            classify: 'category',
                            betItemsIdList: item.betItemsIdList,
                            item
                          })
                      "
                    />
                  </div>
                </div>
              </template>
              <div
                class="ml-5 flex w-full border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] mb-2"
                v-for="(_, idx) in item.list"
                :key="idx"
              >
                <div
                  class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px] pr-2"
                >
                  <span class="text-[#409EFF] font-bold">{{
                    _.betItemsName
                  }}</span>
                  <div class="flex pl-2 cursor-pointer">
                    <IconGroup
                      :typeNum="_.isSale"
                      @changeMatchStatus="
                        status =>
                          changeStatus({
                            status,
                            classify: 'pan',
                            betItemsIdList: _.betItemsIdList,
                            categoryData: _
                          })
                      "
                    />
                  </div>
                </div>

                <div class="flex-grow">
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
                            currentMatch.homeTeamNameCn,
                            currentMatch.awayTeamNameCn
                          )[s.homeOrAway ? s.homeOrAway : s.handicap] ??
                          goalScoring(
                            s.kindsCode,
                            s.handicap,
                            s.n,
                            currentMatch.homeTeamNameCn,
                            currentMatch.awayTeamNameCn,
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
                          (e, s, type) =>
                            mouseEvent(e, s, type, d.betItemsDtoList)
                        "
                        :selectNum="selectNum"
                        :selectItem="selectItem"
                        @changeSelectNum="shortcutSelectNum"
                      />
                      <div class="text-[--el-color-primary] w-1/5 text-center">
                        {{ s.betCount }}/{{ s.betAmount }}
                      </div>
                      <div
                        class="text-[--el-color-primary] w-1/5 text-center"
                        v-if="l === 0"
                      >
                        {{ d.betAmountDiffer ?? '' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </template>

      <!-- scroll滚动条 -->
      <div
        v-show="isShowScroll"
        class="fixed w-16 bg-[--el-color-primary-light-8] flex flex-col pt-2 pb-2 border-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
        :style="scrollPostitonObj"
      >
        <el-scrollbar ref="scrollRef" height="180px">
          <div class="flex flex-col">
            <span
              @click="shortcutSelectNum(item)"
              v-for="item in numberList()"
              :key="item"
              :class="[
                'w-full text-[--el-color-primary] text-center cursor-pointer',
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
import { handicapListType } from '../util/type';
import IconGroup from './IconGroup.vue';
import ContentTitle from './ContentTitle.vue';
import { addition, subtraction } from '@pureadmin/utils';
import { PLAY_MATCH_NAME, goalScoring } from '../util/playMap';
import InputCom from './InputCom.vue';
import { t } from '@/plugins/i18n';

const collapseRef = ref();
const activeNames = ref([0]);
const scrollRef = ref();
const isShowScroll = ref(false);
const scrollPostitonObj = reactive({ left: '0px', top: '0px' });
const contentScrollRef = ref();
const betItemsDtoList = reactive<sportTradingDataAPI.BetItemsDtoList[]>([]);
const selectItem = reactive<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);
const props = defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
  panIsEmpty: boolean;
}>();

const numberList = (): number[] => {
  const arr = [];
  for (let i = 0.3; i >= -0.3; i = subtraction(i, 0.01, 2)) {
    arr.push(i);
  }
  return arr;
};

watch(
  () => props.handicapList,
  () => {
    nextTick(() => {
      scrollRef.value.scrollTo(0, 520);
    });
  },
  {
    deep: true
  }
);
//- 监听内容分类改变
watch(
  () => props.selectContentType,
  v => {
    const index = props.handicapList.findIndex(item => item.listType === v);
    activeNames.value = [index];
    contentScrollRef.value.scrollTo(0, 0);
  }
);

const emits = defineEmits([
  'changeSelectType',
  'clearMatchTime',
  'changeStatus',
  'sendNewOdds'
]);
//- 鼠标滑入交互处理
const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave',
  list?: sportTradingDataAPI.BetItemsDtoList[]
) => {
  //鼠标滑入之前所有为隐藏
  props.handicapList
    .find(item => item.listType === props.selectContentType)!
    .list.forEach(item => {
      item.kindsCodeDtoList.forEach(_ => {
        _.betItemsDtoList.forEach(r => {
          r.sourceBetItemsId = -1;
        });
      });
    });

  if (type === 'enter') {
    Object.assign(selectItem, s);
    scrollPostitonObj.left = `${e.target.getBoundingClientRect().left + 70}px`;
    scrollPostitonObj.top = `${e.target.getBoundingClientRect().top - 172}px`;
    betItemsDtoList.length = 0;
    betItemsDtoList.push(...(list as sportTradingDataAPI.BetItemsDtoList[]));
  }
  isShowScroll.value = type === 'enter';
  s.sourceBetItemsId = type === 'enter' ? 1 : -1;
  emits('clearMatchTime', s.sourceBetItemsId);
};

//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
};

//-快捷选择数字事件
const selectNum = ref(0);
const shortcutSelectNum = (_: number) => {
  if (_ === 0) return;
  selectNum.value = _;
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
  nextTick(() => (selectNum.value = 0));
  // isShowScroll.value = false;
};

const clearTime = () => {
  emits('clearMatchTime', -1);
  isShowScroll.value = false;
};

//- 修改图标状态(包含盘，赛事，玩法)
const changeStatus = (d: {
  status: number;
  classify?: 'match' | 'category' | 'pan';
  betItemsIdList?: number[];
  categoryData?: sportTradingDataAPI.MainBetItemsDtoList;
  item?: handicapListType;
}) => {
  emits('changeStatus', d);
};
</script>

<style scoped></style>

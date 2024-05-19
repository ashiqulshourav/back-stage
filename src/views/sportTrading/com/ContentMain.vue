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
      v-loading="handicapLoading"
    >
      <el-scrollbar ref="contentScrollRef">
        <el-collapse
          ref="collapseRef"
          v-model="activeNames"
          class=""
          :accordion="false"
        >
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
                  <IconGroup />
                </div>
              </div>
            </template>
            <div
              class="ml-5 flex w-full"
              v-for="(_, idx) in item.list"
              :key="idx"
            >
              <div
                class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px]"
              >
                <span class="text-[#409EFF] font-bold">{{
                  _.betItemsName
                }}</span>
                <div class="flex pl-2">
                  <IconGroup />
                </div>
              </div>

              <div class="flex-grow">
                <div v-for="(d, i) in _.kindsCodeDtoList" :key="i">
                  <div
                    @mouseleave="e => mouseEvent(e, s, 'leave')"
                    :class="[
                      'flex w-full items-center h-[35px]',
                      l === 0 && 'bg-[--el-color-primary-light-9]'
                    ]"
                    :key="l"
                    v-for="(s, l) in d.betItemsDtoList"
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
                    <div class="text-[--el-color-danger] text-center w-1/5">
                      {{ s.odds.toFixed(2) }}
                    </div>
                    <InputCom
                      :s="s"
                      @changeMouse="mouseEvent"
                      :selectNum="selectNum"
                      :selectItem="selectItem"
                    />

                    <div class="text-[--el-color-primary] w-1/5 text-center">
                      {{ s.betCount }}/{{ s.betAmount }}
                    </div>
                    <div class="text-[--el-color-primary] w-1/5 text-center">
                      -444
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
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
import { subtraction } from '@pureadmin/utils';
import { PLAY_MATCH_NAME, goalScoring } from '../util/playMap';
import InputCom from './InputCom.vue';

const collapseRef = ref();
const activeNames = ref([0]);
const scrollRef = ref();
const isShowScroll = ref(false);
const scrollPostitonObj = reactive({ left: '0px', top: '0px' });
const contentScrollRef = ref();
const selectItem = reactive<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);
const props = defineProps<{
  handicapLoading: boolean;
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
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
  'changeStatus'
]);
//- 鼠标滑入交互处理
const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave'
) => {
  if (type === 'enter') {
    Object.assign(selectItem, s);
    scrollPostitonObj.left = `${e.target.getBoundingClientRect().left + 70}px`;
    scrollPostitonObj.top = `${e.target.getBoundingClientRect().top - 172}px`;
  }
  isShowScroll.value = type === 'enter';
  s.sourceBetItemsId = type === 'enter' ? 1 : -1;
  emits('clearMatchTime', s.sourceBetItemsId);
};

//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
};

//快捷选择数字事件
const selectNum = ref(0);
const shortcutSelectNum = (_: number) => {
  selectNum.value = _;
  isShowScroll.value = false;
};

//- 修改图标状态
const changeStatus = (d: {
  status: number;
  classify: 'match' | 'category' | 'pan';
}) => {
  emits('changeStatus', d);
};
</script>

<style scoped></style>

<template>
  <div
    class="pl-5 pr-5 text-sm flex-grow relative w-[calc(100%-400px)]"
    ref="contentRef"
  >
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
              :class="[!item.list.length && 'collapse_empty']"
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
                class="ml-5 flex w-full mb-2"
                v-for="(_, idx) in item.list"
                :key="idx"
              >
                <div
                  class="flex items-center pl-2 self-start w-[280px] justify-between bg-[--el-color-primary-light-9] h-[35px] pr-2"
                >
                  <ReText
                    size="small"
                    :tippyProps="{ content: _.betItemsName }"
                  >
                    <span class="text-[#409EFF] font-bold leading-none">{{
                      _.betItemsName
                    }}</span>
                  </ReText>

                  <div class="flex pl-2 cursor-pointer">
                    <IconGroup
                      :typeNum="_.isSale"
                      renderType="pan"
                      @changeMatchStatus="
                        status =>
                          changeStatus({
                            status,
                            classify: 'pan',
                            betItemsIdList: _.betItemsIdList,
                            categoryData: _,
                            item
                          })
                      "
                    />
                  </div>
                </div>

                <div class="flex-grow">
                  <div v-for="(d, i) in _.kindsCodeDtoList" :key="i">
                    <div
                      :class="[
                        'flex w-full items-center h-[35px]',
                        l === 0 && 'bg-[--el-color-primary-light-9]'
                      ]"
                      v-for="(s, l) in d.betItemsDtoList"
                      :key="`${i}-${l}`"
                    >
                      <div
                        class="text-[--el-color-primary] text-center pl-2 pr-2 leading-none w-1/4"
                      >
                        <ReText size="small">
                          {{
                            PLAY_MATCH_NAME(
                              s.kindsCode,
                              s.handicap,
                              currentMatch.homeTeamNameCn,
                              currentMatch.awayTeamNameCn
                            )[
                              s.homeOrAway ? s.homeOrAway : s.handicap
                            ]?.replace('&', ' ') ??
                            goalScoring(
                              s.kindsCode,
                              s.handicap,
                              s.n,
                              currentMatch.homeTeamNameCn,
                              currentMatch.awayTeamNameCn,
                              s.renderName
                            )?.replace('&', ' ')
                          }}
                        </ReText>
                      </div>
                      <div
                        :class="[
                          'text-center w-1/6',
                          s.odds < 0 && 'translate-x-[-2px]'
                        ]"
                      >
                        {{ s.odds.toFixed(2) }}
                      </div>
                      <InputCom
                        :s="s"
                        :saleStatus="_.isSale"
                        @showShortcutContainer="showShortcutContainer"
                        @changeMouse="
                          (e, s, type) =>
                            mouseEvent(e, s, type, d.betItemsDtoList)
                        "
                        :selectNum="selectNum"
                        :selectItem="selectItem"
                        :betItemsDtoList="betItemsDtoList"
                        @hideScrollList="() => (isShowScroll = false)"
                        @changeSelectNum="(n:number) =>
                      shortcutSelectNum(n,'input')"
                      />
                      <div
                        :class="[
                          'text-[--el-color-primary] w-1/6 text-center',
                          (s.betCount > 0 || s.betAmount > 0) &&
                            'cursor-pointer'
                        ]"
                        @click="
                          goBetOroderPage(s.betCount > 0 || s.betAmount > 0, s)
                        "
                      >
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
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </template>

      <!-- scroll滚动条 -->
      <div
        :class="[
          'fixed w-16 bg-[--el-color-primary-light-8] flex flex-col pt-2 pb-2 border-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]',
          isShowScroll ? 'visible' : 'invisible'
        ]"
        :style="scrollPostitonObj"
        @mouseenter="mouseEnterScroll"
        @mousemove="mouseMoveScroll"
        @mouseleave="mouseLeaveScroll"
      >
        <el-scrollbar ref="scrollRef" height="180px">
          <div class="flex flex-col">
            <span
              @click="shortcutSelectNum(item, 'shortcut')"
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

    <el-dialog
      v-model="dialogStatus"
      :append-to="contentRef"
      :append-to-body="false"
      :align-center="true"
      width="150"
      custom-class="over_dialog"
      modal-class="over_mdal"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <MatchCountDown
        :type="type"
        :status="matchStatus"
        @closeDialog="onCloseDialog"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import IconGroup from './IconGroup.vue';
import ContentTitle from './ContentTitle.vue';
import { addition, subtraction } from '@pureadmin/utils';
import { PLAY_MATCH_NAME, goalScoring, resetDpodds } from '../util/playMap';
import InputCom from './InputCom.vue';
import { t } from '@/plugins/i18n';
import { useBetStore } from '@/store/bet';
import { ReText } from '@/components/ReText';
import MatchCountDown from './MatchCountDown.vue';

const contentRef = ref();
const collapseRef = ref();
const activeNames = ref([1]);
const scrollRef = ref();
const isShowScroll = ref(false);
const scrollPostitonObj = reactive({ left: '0px', top: '0px' });
const contentScrollRef = ref();
const betItemsDtoList = reactive<sportTradingDataAPI.BetItemsDtoList[]>([]);
const selectItem = ref<sportTradingDataAPI.BetItemsDtoList>(
  {} as sportTradingDataAPI.BetItemsDtoList
);
const props = defineProps<{
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
  panIsEmpty: boolean;
  isShowDialog: boolean;
  matchStatus: 'nobegin' | 'canceled' | 'over';
  type: string;
}>();

const dialogStatus = computed({
  get() {
    return props.isShowDialog;
  },
  set(_) {}
});

const numberList = (): number[] => {
  const arr = [];
  for (let i = 0.3; i >= -0.3; i = subtraction(i, 0.01, 2)) {
    arr.push(i);
  }
  return arr;
};

watch(
  () => props.currentMatch,
  () => {
    activeNames.value = [1];
  },
  {
    deep: true
  }
);

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
  'sendNewOdds',
  'onCloseDialog'
]);
//- 鼠标滑入交互处理
const mouseEvent = (
  e: any,
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave',
  list?: sportTradingDataAPI.BetItemsDtoList[]
) => {
  if (type === 'enter') {
    isShowScroll.value = false;
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
    selectItem.value = s;
    scrollPostitonObj.left = `${
      e.target.getBoundingClientRect().left + (s.dpOdds < 0 ? 76 : 70)
    }px`;
    scrollPostitonObj.top = `${e.target.getBoundingClientRect().top - 168}px`;
    betItemsDtoList.length = 0;
    betItemsDtoList.push(...(list as sportTradingDataAPI.BetItemsDtoList[]));
    s.sourceBetItemsId = 1;
  } else {
    if (!isShowScroll.value) s.sourceBetItemsId = -1;
  }
  emits('clearMatchTime', s.sourceBetItemsId);
};

const showShortcutContainer = () => (isShowScroll.value = true);

//- 修改选择类型
const changeSelectType = (type: string) => {
  emits('changeSelectType', type);
};

//-快捷选择数字事件
const selectNum = ref(0);
const shortcutSelectNum = (_: number, type: string) => {
  if (_ === 0) return;
  type === 'shortcut' && (selectNum.value = _);
  const params: { betItemsId: number; dpOdds: number }[] = [];
  //- 下盘需要递减
  if (betItemsDtoList.length === 2) {
    const otherIdx = betItemsDtoList.findIndex(
      item => item.betItemsId !== selectItem.value.betItemsId
    );

    //- 快捷选择单独处理
    if (type === 'shortcut') {
      const d = betItemsDtoList.find(
        item => item.betItemsId !== selectItem.value.betItemsId
      ) as sportTradingDataAPI.BetItemsDtoList;
      if (_ > 0) {
        d.dpOdds = subtraction(d.dpOdds, Math.abs(_), 2);
      } else {
        d.dpOdds = addition(d.dpOdds, Math.abs(_), 2);
      }
      if (Math.abs(d.dpOdds) >= 1) d.dpOdds = resetDpodds(d.dpOdds);
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
      item => item.betItemsId === selectItem.value.betItemsId
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

const clearTime = () => {
  isShowScroll.value = false;
  selectItem.value.sourceBetItemsId = -1;
  emits('clearMatchTime', -1);
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

//- 跳转到订单界面
const betStore = useBetStore();
const router = useRouter();
const goBetOroderPage = (
  isGo: boolean,
  s: sportTradingDataAPI.BetItemsDtoList
) => {
  if (!isGo) return;
  betStore.set_gameplay_data({
    matchId: s.matchId,
    betItemsId: s.betItemsId
  });
  router.push('/operateManager/sportBettingCenter');
};

// 快捷键鼠标事件
let lastX = ref<number>();
let direction = ref<string>('');
const mouseEnterScroll = (e: any) => {
  lastX.value = e.clientX;
};

const mouseMoveScroll = (e: any) => {
  const currentX = e.clientX;
  if (lastX !== undefined) {
    const diffX = currentX - (lastX.value as number);
    if (diffX > 0) {
      direction.value = 'right';
    } else {
      direction.value = 'left';
    }
  }
};

const mouseLeaveScroll = () => {
  if (direction.value === 'right') {
    selectItem.value.sourceBetItemsId = -1;
  }
  isShowScroll.value = false;
};

const onCloseDialog = () => emits('onCloseDialog');
</script>

<style lang="scss">
.collapse_empty {
  .el-collapse-item__wrap {
    height: 0;
  }
}

.over_mdal {
  position: absolute;
  .el-overlay-dialog {
    position: absolute;
    .el-dialog__header {
      display: none;
    }
    .el-dialog {
      background-color: transparent !important;
      box-shadow: none;
    }
  }
}
</style>

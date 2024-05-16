<template>
  <div class="pl-5 pr-5 text-sm flex-grow w-full">
    <ContentTitle
      :currentMatch="currentMatch"
      :handicapList="handicapList"
      :selectContentType="selectContentType"
    />

    <!-- - 赛事内容列表 -->
    <div class="w-full h-full overflow-hidden pl-5" v-loading="handicapLoading">
      <el-scrollbar>
        <el-collapse
          ref="collapseRef"
          v-model="activeNames"
          class=""
          :accordion="false"
          @change="handleChange"
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
                    :class="[
                      'flex w-full items-center h-[35px]',
                      l === 0 && 'bg-[--el-color-primary-light-9]'
                    ]"
                    :key="l"
                    v-for="(s, l) in d.betItemsDtoList"
                  >
                    <div class="text-[--el-color-primary] text-center w-1/5">
                      {{ s.handicap }}
                    </div>
                    <div class="text-[--el-color-danger] text-center w-1/5">
                      {{ s.odds }}
                    </div>
                    <div
                      class="w-1/5 text-center"
                      @mouseenter="mouseEvent(s, 'enter')"
                      @mouseleave="mouseEvent(s, 'leave')"
                    >
                      <div
                        v-show="s.sourceBetItemsId !== 1"
                        class="min-w-[120px] text-[--el-color-primary]"
                      >
                        {{ s.dpOdds ?? s.odds }}
                      </div>
                      <div
                        v-show="s.sourceBetItemsId === 1"
                        class="text-[--el-color-primary] flex justify-center cursor-pointer relative"
                      >
                        <div class="min-w-[120px]">
                          <el-input-number
                            size="small"
                            :step="0.01"
                            v-model="num"
                            controls-position="right"
                          />
                        </div>
                        <div
                          class="absolute w-16 right-[-33px] bg-[--el-color-primary-light-8] flex flex-col top-[0px] pt-2 pb-2 border-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
                        >
                          <el-scrollbar ref="scrollRef" height="200px">
                            <div class="flex flex-col">
                              <span
                                v-for="item in numberList()"
                                :key="item"
                                :class="[
                                  'w-full text-[--el-color-primary]',
                                  item === 0 &&
                                    'bg-[--el-color-primary-dark-2] !text-white'
                                ]"
                              >
                                {{ item > 0 ? '+' : '' }} {{ item }}
                              </span>
                            </div>
                          </el-scrollbar>
                        </div>
                      </div>
                    </div>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { handicapListType } from '../util/type';
import IconGroup from './IconGroup.vue';
import ContentTitle from './ContentTitle.vue';
const collapseRef = ref();
const activeNames = ref([0]);
import { subtraction } from '@pureadmin/utils';
const num = ref();
const scrollRef = ref();

const props = defineProps<{
  handicapLoading: boolean;
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
}>();

const handleChange = (val: string[]) => {
  console.log(val);
};

const numberList = (): number[] => {
  const arr = [];
  for (let i = 0.3; i >= -0.3; i = subtraction(i, 0.01, 2)) {
    arr.push(i);
  }
  return arr;
};

watch(
  () => props.handicapList,
  l => {
    nextTick(() => {
      scrollRef.value.forEach((item: any) => {
        item.scrollTo(0, 600);
      });
    });
  },
  {
    deep: true
  }
);

//- 鼠标滑入交互处理
const mouseEvent = (
  s: sportTradingDataAPI.BetItemsDtoList,
  type: 'enter' | 'leave'
) => {
  // scrollRef.value[0].scrollTo(0, 600);
  s.sourceBetItemsId = type === 'enter' ? 1 : -1;
};
</script>

<style scoped></style>

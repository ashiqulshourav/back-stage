<template>
  <div class="pl-5 pr-5 text-sm flex-grow w-full">
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
                class="flex items-center self-start w-[280px] justify-between"
              >
                <span>{{ _.betItemsName }}</span>
                <div class="flex pl-2">
                  <IconGroup />
                </div>
              </div>

              <div class="ml-2 flex-grow">
                <div
                  v-for="(d, i) in _.betItemsDtoList"
                  class="flex w-full justify-around pb-2 h-[35px]"
                  :key="i"
                >
                  <div class="text-[--el-color-primary]">主队</div>
                  <div class="text-[--el-color-danger]">
                    {{ d.betItemsDtoList[0].odds }}
                  </div>
                  <div @mouseenter="enterEvent" @mouseleave="levelEvent">
                    <div
                      v-if="!isShow"
                      class="bg-red-50 min-w-[120px] text-center"
                    >
                      1.234
                    </div>
                    <div
                      v-else
                      class="text-[--el-color-primary] min-w-[120px] flex justify-center cursor-pointer bg-red-50 relative"
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
                        class="absolute right-[-20px] flex flex-col top-[0px] pl-2 pr-2 border-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
                      >
                        <span v-for="item in 5">{{ item }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-[--el-color-primary]">2,123/456</div>
                  <div class="text-[--el-color-primary]">-444</div>
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
import { t } from '@/plugins/i18n';
const collapseRef = ref();
const activeNames = ref([0]);
const num = ref();
const isShow = ref(false);

const props = defineProps<{
  handicapLoading: boolean;
  currentMatch: sportTradingDataAPI.MatchDtoList;
  handicapList: handicapListType[];
  selectContentType: string;
}>();

const handleChange = (val: string[]) => {
  console.log(val);
};

const enterEvent = () => {
  isShow.value = true;
};

const levelEvent = () => {
  isShow.value = false;
};
</script>

<style scoped></style>

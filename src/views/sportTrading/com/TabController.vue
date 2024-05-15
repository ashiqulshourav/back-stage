<template>
  <el-scrollbar>
    <el-collapse
      ref="collapseRef"
      v-model="activeNames"
      class="w-[400px]"
      :accordion="false"
      @change="handleChange"
    >
      <el-collapse-item
        :name="item.type"
        v-for="item in matchList"
        :key="item.type"
      >
        <template #title> {{ item.type }} ({{ item.size }}) </template>
        <div
          :class="[
            'flex items-center border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] p-2  cursor-pointer',
            _.matchId === currentMatch?.matchId &&
              'bg-[--el-color-primary-light-9]'
          ]"
          v-for="_ in item.matchDtoList"
          :key="_.matchId"
          @click="changeSelectItem(_)"
        >
          <div class="flex">
            <el-button size="small" type="primary">{{
              getSportType(_.sportId)
            }}</el-button>

            <div class="ml-3 mr-4 flex flex-col w-[125px]">
              <div class="flex items-center">
                <span
                  class="w-4 h-4 flex flex-shrink-0 mr-1 text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white"
                >
                  <span class="scale-75">
                    {{ _.level === 200 ? t('未') : _.level }}
                  </span>
                </span>
                <ReText
                  type="primary"
                  size="small"
                  v-copy:click="{ val: _.leagueId, tip: t('联赛ID复制成功') }"
                >
                  {{ _.leagueNameCn }}
                </ReText>
              </div>
              <span class="self-start">{{ _.beginTime }}</span>
            </div>
          </div>

          <div class="pr-2 ml-6 flex-grow-1">
            <div
              class="flex mb-2 text-xs w-[150px]"
              v-copy:click="{ val: _.matchId, tip: t('赛事ID复制成功') }"
            >
              <div :class="['text-[--el-color-primary] !text-xs flex']">
                <ReText type="primary" size="small">
                  {{ _.homeTeamNameCn }}
                </ReText>
                <span
                  class="w-4 font-bold h-4 flex items-center text-[12px] justify-center scale-75 bg-[--el-color-warning] text-white rounded-full leading-4"
                >
                  <span class="">{{ t('主') }}</span>
                </span>
              </div>
              <div :class="['text-[--el-color-primary] !mr-2 !ml-2']">V</div>
              <ReText type="danger" size="small">
                {{ _.homeTeamNameCn }}
              </ReText>
            </div>
            <div class="flex cursor-pointer">
              <IconGroup :typeNum="_.isSale" />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import IconGroup from './IconGroup.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { ReText } from '@/components/ReText';

const collapseRef = ref();
const emits = defineEmits(['changeSelectMatch']);

const props = defineProps<{
  matchList: sportTradingDataAPI.getMorningSetMatchListData[];
  currentMatch: sportTradingDataAPI.MatchDtoList;
}>();

const activeNames = computed({
  get() {
    const arr = [];
    props.matchList.length && arr.push(props.matchList[0].type);
    return arr;
  },
  set(v) {
    // console.log('TabController.vue文件 103==============行打印=', v);
  }
});

const handleChange = (val: string[]) => {};

//- 切换赛事
const changeSelectItem = (_: sportTradingDataAPI.MatchDtoList) => {
  emits('changeSelectMatch', _);
};

const text = ref('自行车自行车');

//- 获取当前玩法
const getSportType = (_: number) => {
  return SPORT_ID_MAP.find(item => item.value === _)?.label;
};
</script>

<style lang="scss"></style>

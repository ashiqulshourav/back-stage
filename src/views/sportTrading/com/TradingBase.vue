<template>
  <div class="h-full flex flex-col overflow-hidden">
    <SearchFom
      :form="searchForm"
      :loading="loading"
      @onSearch="onSearch"
      :type="type"
    />
    <div
      class="bg-bg_color w-[99/100] mt-2 pl-5 pt-[12px] flex-grow flex flex-col overflow-hidden"
    >
      <div class="font-bold mb-2">{{ title }}</div>
      <div class="flex flex-grow h-full overflow-hidden max-h-full">
        <div class="w-full flex items-center justify-center" v-if="noMatchList">
          <el-empty :description="t('暂无数据')" :image-size="100" />
        </div>
        <template v-else>
          <div v-loading="loading">
            <TabController
              :matchList="matchList"
              :currentMatch="currentMatch"
              @changeSelectMatch="changeSelectMatch"
              @changeStatus="changeStatus"
              :type="type"
            />
          </div>
          <ContentMain
            :currentMatch="currentMatch"
            :handicapList="handicapList"
            :selectContentType="selectContentType"
            @changeSelectType="changeSelectType"
            @clearMatchTime="clearMatchTime"
            @changeStatus="changeStatus"
            @sendNewOdds="sendNewOdds"
            :panIsEmpty="panIsEmpty"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchFom from './SearchFom.vue';
import { useTradingHook } from '../util/trading_hook';
import TabController from './TabController.vue';
import ContentMain from './ContentMain.vue';
import { t } from '@/plugins/i18n';

const { type } = defineProps<{
  type: 'early' | 'in';
}>();

const {
  searchForm,
  loading,
  matchList,
  currentMatch,
  changeSelectMatch,
  onSearch,
  handicapList,
  selectContentType,
  changeSelectType,
  clearMatchTime,
  changeStatus,
  sendNewOdds,
  noMatchList,
  panIsEmpty
} = useTradingHook(type);

const title = computed(() =>
  type === 'early' ? t('早盘管理') : t('滚球管理')
);
</script>

<style lang="scss">
.el-scrollbar__view {
  height: calc(100% - 20px);
}
</style>

<template>
  <div class="pl-5 pr-5 text-sm flex-grow w-full">
    <div class="flex">
      <div class="flex items-center w-full">
        <div class="flex items-center">
          <span
            class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white"
            >4</span
          >
          <span class="text-[#409EFF] ml-1">{{ t('英国超级联赛') }}</span>
        </div>
        <div class="flex ml-5">
          <div :class="['text-[--el-color-primary] flex items-center']">
            <span>小明小明小明小明小明小明小明</span>
            <span
              class="w-4 font-bold h-4 flex items-center text-[12px] scale-75 justify-center bg-[--el-color-warning] text-white rounded-full leading-4"
              >{{ t('主') }}</span
            >
          </div>
          <div :class="['text-[--el-color-primary] !mr-1 !ml-1']">V</div>
          <div :class="['text-[--el-color-danger]']">销量</div>
        </div>
      </div>
      <div class="flex ml-5">
        <el-button
          type="primary"
          round
          size="small"
          v-for="item in 5"
          :key="item"
          >{{ t('全部') }}(6)</el-button
        >
      </div>
    </div>
    <div class="flex items-center pl-3 pt-1 mb-2">
      <span>2024-05-11</span>
      <div class="flex pl-2">
        <IconifyIconOffline
          :class="['text-[#409EFF] cursor-pointer']"
          icon="trading_play"
        />
        <IconifyIconOffline
          :class="['text-[#409EFF] cursor-pointer text-sm ml-2 mr-2']"
          icon="trading_switch"
        />
        <IconifyIconOffline
          :class="['text-[#409EFF] cursor-pointer text-sm mr-2']"
          icon="trading_pause"
        />
        <IconifyIconOffline
          :class="['text-[#409EFF] cursor-pointer']"
          icon="trading_lock"
        />
      </div>
    </div>
    <div class="w-full h-full overflow-hidden pl-5">
      <el-scrollbar>
        <el-collapse
          ref="collapseRef"
          v-model="activeNames"
          class=""
          :accordion="false"
          @change="handleChange"
        >
          <el-collapse-item :name="item" v-for="item in 5" :key="item">
            <template #title>
              <div class="flex items-center">
                <el-button type="primary" size="small">{{
                  t('主要玩法')
                }}</el-button>
                <div class="flex justify-between ml-4">
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer']"
                    icon="trading_play"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer text-sm ml-4 mr-4']"
                    icon="trading_switch"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer text-sm mr-4']"
                    icon="trading_pause"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer']"
                    icon="trading_lock"
                  />
                </div>
              </div>
            </template>
            <div class="ml-5 flex w-full" v-for="_ in 3" :key="_">
              <div class="flex items-center self-start">
                <span class="">全场独赢</span>
                <div class="flex pl-2">
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer']"
                    icon="trading_play"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer text-sm ml-4 mr-4']"
                    icon="trading_switch"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer text-sm mr-4']"
                    icon="trading_pause"
                  />
                  <IconifyIconOffline
                    :class="['text-[#409EFF] cursor-pointer']"
                    icon="trading_lock"
                  />
                </div>
              </div>
              <div class="ml-2 flex-grow">
                <div
                  v-for="_ in 2"
                  class="flex w-full justify-around pb-2"
                  :key="_"
                >
                  <div class="text-[--el-color-primary]">主队</div>
                  <div class="text-[--el-color-danger]">1.93</div>
                  <div class="text-[--el-color-primary]">
                    <span v-if="isShow">1.234</span>
                    <div v-else>
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        placement="right-start"
                      >
                        <template #content> 123 </template>
                        <div class="w-20">
                          <el-input-number
                            size="small"
                            :step="0.01"
                            v-model="num"
                            controls-position="right"
                          />
                        </div>
                      </el-tooltip>
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
import { t } from '@/plugins/i18n';
const collapseRef = ref();
const activeNames = ref([1]);
const num = ref();
const isShow = ref(false);

const handleChange = (val: string[]) => {
  console.log(val);
};
</script>

<style scoped></style>

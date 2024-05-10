<template>
  <el-scrollbar>
    <el-collapse
      ref="collapseRef"
      v-model="activeNames"
      class="w-[360px]"
      :accordion="false"
      @change="handleChange"
    >
      <el-collapse-item :name="item" v-for="item in 5" :key="item">
        <template #title> {{ t('今日') }}(4) </template>
        <div
          :class="[
            'flex items-center border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030] pb-2 pt-2 pl-2  cursor-pointer',
            _ === 1 && 'bg-[--el-color-primary-light-9]'
          ]"
          v-for="_ in 4"
          :key="_"
          @click="changeSelectItem"
        >
          <el-button size="small" type="primary">{{ t('足球') }}</el-button>
          <div class="ml-5 mr-8 flex flex-col">
            <div class="flex items-center">
              <span
                class="w-4 h-4 flex items-center text-[12px] justify-center bg-primary text-center rounded-full leading-4 text-white"
                >4</span
              >
              <span>{{ t('英国超级联赛') }}</span>
            </div>
            <span class="self-end">2024-05-11 15:00</span>
          </div>

          <div>
            <div class="flex mb-2 text-xs">
              <div :class="['text-[--el-color-primary] !text-xs flex']">
                <span>小明</span>
                <span
                  class="w-4 font-bold h-4 flex items-center text-[12px] justify-center scale-75 bg-[--el-color-warning] text-white rounded-full leading-4"
                >
                  <span class="scale-75">主</span>
                </span>
              </div>
              <div :class="['text-[--el-color-primary] !mr-1 !ml-1']">V</div>
              <div :class="['text-[--el-color-danger] !text-xs']">销量</div>
            </div>
            <div class="flex justify-between">
              <IconGroup />
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

defineOptions({
  name: 'Collapse'
});

const collapseRef = ref();
const activeNames = ref([1]);
const isOpen = ref(true);

function onClick() {
  isOpen.value
    ? (activeNames.value = [])
    : (activeNames.value = [1, 2, 3, 4, 5]);
  isOpen.value = !isOpen.value;
}

const handleChange = (val: string[]) => {
  console.log(val);
};

const changeSelectItem = () => {};
</script>

<style lang="scss"></style>

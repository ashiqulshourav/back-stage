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
        <span>123</span>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';

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
</script>

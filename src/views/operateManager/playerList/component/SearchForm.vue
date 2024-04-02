<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="category">
        <el-input
          v-model="form.text"
          :placeholder="t('可输入1-50个用户ID,用空格进行分割')"
          clearable
          ref="buttonRef"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          virtual-triggering
        >
          <div class="flex flex-start max-w-96">
            <span class="el-tag mr-2" v-for="item in idList" :key="item"
              >item</span
            >
          </div>
        </el-popover>

        <!-- <el-popover
          placement="bottom"
          title="标题"
          width="200"
          trigger="click"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
        >
          <el-input
            v-model="form.text"
            :placeholder="t('可输入1-50个用户ID')"
            v-enter="search"
            clearable
            class="!w-[150px]"
          />
        </el-popover> -->
      </el-form-item>

      <el-form-item :label="`${t('游戏种类')}:`" prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('游戏种类')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in gameClassify"
            :key="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="`${t('标签名称')}:`" prop="text">
        <el-input
          v-model="form.text"
          :placeholder="t('标签名称')"
          v-enter="search"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="search"
        >
          {{ t('筛选') }}
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          {{ t('重置') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import {
  ESPORT_ID_MAP,
  SPORT_ID_MAP,
  SPORT_CATEGORY
} from '@/utils/maps/sports_map';

// const time = ref('');
const formRef = ref();
const buttonRef = ref();
const emits = defineEmits(['onSearch']);
const gameClassify = ref<{ label: string; value: number }[]>(SPORT_ID_MAP);
const idList = reactive<string[]>([]);

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: searchFormType;
  }>(),
  {}
);

watch(
  () => props.form.text,
  val => {
    console.log('SearchForm.vue文件 114==============行打印=', val);
  }
);

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const changeMatchType = (type: 0 | 1 | 2) => {
  props.form.sportId = undefined;
  //- 电竞比赛 =1
  gameClassify.value = type === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
  emits('onSearch', ...['reload']);
};
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

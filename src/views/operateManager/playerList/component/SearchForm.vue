<template>
  <div class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]">
    <el-form ref="formRef" :inline="true" :model="form">
      <el-form-item prop="category">
        <el-input
          v-model="form.text"
          :placeholder="t('可输入1-50个用户ID,用空格进行分割')"
          clearable
          ref="buttonRef"
          :formatter="formatterTxt"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef"
          :virtual-ref="buttonRef"
          trigger="click"
          width="260px"
          virtual-triggering
        >
          <div class="flex flex-start w-full flex-wrap">
            <span
              class="el-tag mr-2 mb-1"
              v-for="item in idList.filter(_ => _ !== '')"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item prop="sportId">
        <el-select
          v-model="form.sportId"
          :placeholder="t('所属商户')"
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

      <el-form-item prop="text">
        <el-input
          v-model="form.text"
          :placeholder="t('可输入商户编码或ID')"
          v-enter="search"
          clearable
          class="!w-[150px]"
        />
      </el-form-item>

      <el-form-item prop="sportId">
        <el-select
          v-model="form.limitLevel"
          :placeholder="t('限额等级')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item.levelLimit"
            :value="item.levelLimit"
            v-for="item in sportLimmitList"
            :key="item.levelLimit"
          />
        </el-select>
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
const sportLimmitList = reactive<UserAPI.UserLevelLimitListRes[]>([]);

const props = withDefaults(
  defineProps<{
    loading: boolean;
    form: searchFormType;
  }>(),
  {}
);

const formatterTxt = v => {
  const l = new Set(v.split(','));
  idList.length = 0;
  idList.push(...(Array.from(l) as string[]));
  return v;
};

watch(
  () => props.form.text,
  val => {
    // console.log('SearchForm.vue文件 114==============行打印=', val);
  }
);

onMounted(() => {
  initTenantList();
  getLimmitLevelList();
});

const getLimmitLevelList = async () => {
  const res = await API.getUserLevelLimitList({ type: 0 });
  if (res.code) return;
  sportLimmitList.length = 0;
  sportLimmitList.push(...res.data);
};

const initTenantList = async () => {
  const res = await API.getTenantList();
  console.log('SearchForm.vue文件 122==============行打印=', res);
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  gameClassify.value = props.form.category === 1 ? ESPORT_ID_MAP : SPORT_ID_MAP;
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

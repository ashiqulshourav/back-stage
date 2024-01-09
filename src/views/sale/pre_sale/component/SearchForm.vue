<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('联赛')}:`" prop="leagueNameCn">
      <el-select
        v-model="form.leagueNameCn"
        filterable
        class="w-[280px]"
        :placeholder="t('请选择联赛')"
      >
        <el-option
          v-for="item in leagueList"
          :key="item.leagueId"
          :label="item.leagueNameCn"
          :value="item.leagueNameCn"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="form.matchId"
        :placeholder="t('赛事ID')"
        v-enter="search"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('比赛时间')}:`" prop="beginTime">
      <el-button
        v-for="(item, index) in nextDayArr"
        :key="index"
        :type="selectIndex === index ? 'primary' : ''"
        @click="selectIndex = index"
        >{{ item }}</el-button
      >
      <el-date-picker
        class="ml-4"
        v-model="form.beginTime"
        type="datetime"
        :placeholder="t('其他日期')"
        value-format="x"
        format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disableDate"
        @change="dateChange"
      />
    </el-form-item>

    <el-form-item :label="`${t('开售状态')}:`" prop="isSale">
      <el-select
        v-model="form.isSale"
        :placeholder="t('请选择')"
        @change="search"
      >
        <el-option :label="t('关闭')" :value="1" />
        <el-option :label="t('开售')" :value="0" />
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
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import Search from '@iconify-icons/ep/search';
import Refresh from '@iconify-icons/ep/refresh';
import type { FormInstance } from 'element-plus';
import { SearchFormType } from '../utils/types';
import dayjs from 'dayjs';
import { disableDate } from '@/utils/formmatDate';

defineProps<{
  loading: boolean;
  form: SearchFormType;
}>();
const formRef = ref();
const emits = defineEmits(['onSearch']);
const selectIndex = ref(-1);

onMounted(() => {
  getLeagueList();
});

const dateChange = t => {
  const d = dayjs(t).format('YYYY-MM-DD');
  selectIndex.value = nextDayArr.value.findIndex(_ => _ === d);
};

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const nextDayArr = computed(() => {
  const nextDayList = [];
  for (let i = 0; i < 5; i++) {
    nextDayList.push(dayjs().add(i, 'day').format('YYYY-MM-DD'));
  }
  return nextDayList;
});

const leagueList = reactive<MetadataAPI.LeagueList[]>([]);
const getLeagueList = async () => {
  const res: MetadataAPI.LeagueListRes = await API.getLeagueList({
    pageSize: 9999,
    pageNum: 1
  });
  leagueList.length = 0;
  leagueList.push(...res.data.list);
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

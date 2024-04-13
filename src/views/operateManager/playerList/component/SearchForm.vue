<template>
  <div class="search-form bg-bg_color pl-8 pt-[12px]">
    <el-form
      label-width="110"
      ref="formRef"
      label-position="right"
      :inline="true"
      :model="form"
    >
      <el-row class="flex justify-between">
        <el-form-item prop="ids" :label="t('用户ID： ')">
          <el-input
            :placeholder="t('可输入1-50个用户ID,用逗号进行分割')"
            clearable
            class="!w-[160px]"
          />
        </el-form-item>
        <el-form-item prop="" :label="t('商户:')">
          <el-select clearable class="!w-[200px]" />
        </el-form-item>
        <el-form-item prop="" :label="t('风控标签:')">
          <el-select multiple clearable class="!w-[300px]" />
        </el-form-item>
        <el-form-item prop="" :label="t('属性标签:')">
          <el-select multiple clearable class="!w-[300px]" />
        </el-form-item>
      </el-row>
      <el-row class="flex justify-between">
        <el-form-item prop="ids" :label="t('投注额: ')" class="w-1/4">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input :placeholder="t('')" clearable class="w-full" />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input :placeholder="t('')" clearable class="w-full" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ids" :label="t('平台输赢: ')" class="w-1/4">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input :placeholder="t('')" clearable class="w-full" />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input class="w-full" :placeholder="t('')" clearable />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ids" :label="t('盈利额: ')" class="w-1/4">
          <el-row class="flex justify-between">
            <el-col :span="11">
              <el-input :placeholder="t('')" clearable class="w-full" />
            </el-col>
            <el-col :span="1">
              <p>{{ t('-') }}</p>
            </el-col>
            <el-col :span="11">
              <el-input :placeholder="t('')" clearable class="w-full" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-row>
      <el-row class="flex justify-between">
        <el-col :span="12">
          <el-form-item prop="" label="日期范围选择:">
            <CustomDate placeholder="" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="!w-[120px]">搜索</el-button>
            <el-button class="!w-[100px]">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="flex justify-end">
          <el-form-item>
            <el-button type="primary">批量编辑标签</el-button>
            <el-button type="primary">导出用户列表</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item prop="usernames">
        <el-input
          v-model="form.usernames as string"
          :placeholder="t('可输入1-50个用户名,用逗号进行分割')"
          clearable
          ref="buttonRef1"
          :formatter="formatterUserNames"
          :disabled="userIds.length > 50"
          class="!w-[260px]"
        />
        <el-popover
          ref="popoverRef1"
          :virtual-ref="buttonRef1"
          trigger="click"
          width="260px"
          virtual-triggering
        >
          <div class="flex flex-start w-full flex-wrap">
            <span
              class="el-tag mr-2 mb-1"
              v-for="item in userIds.filter(_ => _ !== '')"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item prop="tenantId">
        <el-select
          v-model="form.tenantIds"
          :placeholder="t('所属商户')"
          clearable
          multiple
          class="!min-w-[150px]"
        >
          <el-option
            :label="item.tenantName"
            :value="item.id"
            v-for="item in tenantList"
            :key="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="tenantCode">
        <el-input
          v-model="form.tenantCode"
          :placeholder="t('请输入商户编码')"
          v-enter="search"
          clearable
          class="!w-[220px]"
        />
      </el-form-item>

      <el-form-item prop="limitLevel">
        <el-select
          v-model="form.limitLevel"
          :placeholder="t('限额等级')"
          clearable
          class="!w-[150px]"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in sportLimmitList"
            :key="item"
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
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { searchFormType } from '../utils/types';
import CustomDate from '@/components/Form/Custom_date.vue';

// import { useRenderIcon } from '@/components/ReIcon/src/hooks';
// import Search from '@iconify-icons/ep/search';
// import Refresh from '@iconify-icons/ep/refresh';
// import type { FormInstance } from 'element-plus';

const formRef = ref();
// const buttonRef = ref();
// const buttonRef1 = ref();
// const emits = defineEmits(['onSearch']);
// const idList = reactive<string[]>([]);
// const userIds = reactive<string[]>([]);
// const sportLimmitList = reactive<string[]>([]);

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
}>();

// const formatterTxt = v => {
//   const l = new Set(v.split(','));
//   idList.length = 0;
//   idList.push(...(Array.from(l) as string[]));
//   return v;
// };

// const formatterUserNames = v => {
//   const l = new Set(v.split(','));
//   userIds.length = 0;
//   userIds.push(...(Array.from(l) as string[]));
//   return v;
// };

// onMounted(() => {
//   initTenantList();
//   getLimmitLevelList();
// });

// const getLimmitLevelList = async () => {
//   const res = await API.getLimitListDropDownBox();
//   if (res.code) return;
//   sportLimmitList.length = 0;
//   sportLimmitList.push(...res.data);
// };

// const tenantList = reactive([]);
// const initTenantList = async () => {
//   const res = await API.getTenantList();
//   if (res.code) return;
//   tenantList.length = 0;
//   tenantList.push(...res.data.data);
// };

// const resetForm = (formEl: FormInstance | undefined) => {
//   props.form.ids = '';
//   formEl.resetFields();
//   emits('onSearch', ...['reload']);
// };

// const search = () => {
//   props.form.ids = idList.filter(item => item !== '');
//   props.form.usernames = userIds.filter(item => item !== '');
//   emits('onSearch', ...['reload']);
// };
</script>

<style lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.el-date-editor {
  margin: 0;
}
.el-form-item__label {
  font-weight: 700;
}
</style>

<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item>
      <el-button>{{ t("体育") }}</el-button>
    </el-form-item>

    <el-form-item :label="`${t('结算时间')}:`">
      <el-date-picker
        v-model="form.date"
        type="datetimerange"
        :start-placeholder="t('开始日期')"
        :end-placeholder="t('结束日期')"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="form.matchId"
        :placeholder="t('赛事ID')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
      <el-input
        v-model="form.matchName"
        :placeholder="t('赛事名称')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('结算状态')}:`" prop="isSale">
      <el-select
        class="!w-[100px]"
        v-model="form.settleStatus"
        :placeholder="t('请选择')"
      >
        <el-option label="已结算" :value="0" />
        <el-option label="未结算" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item label="数据商">
      <el-switch
        v-model="form.dataVendors"
        inline-prompt
        class="pure-datatheme"
        @change="dataVendorsChange"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(icon_serch)"
        :loading="loading"
        @click="onSearch('reload')"
      >
        {{ t("筛选") }}
      </el-button>
      <el-button
        :icon="useRenderIcon(icon_refresh)"
        @click="resetForm(formRef)"
      >
        {{ t("重置") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import icon_serch from "@iconify-icons/ep/search";
import icon_refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useLeague } from "../utils/hook";

const formRef = ref();
import { t } from "@/plugins/i18n";

defineProps<{ loading: boolean }>();

const { form, dataVendorsChange, onSearch, resetForm } = useLeague();
</script>

<style scoped></style>

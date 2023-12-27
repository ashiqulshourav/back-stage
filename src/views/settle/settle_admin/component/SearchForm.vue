<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item>
      <el-button>{{ t("common.sport") }}</el-button>
    </el-form-item>

    <el-form-item :label="`${t('settle.settlementTime')}:`">
      <el-date-picker
        v-model="form.date"
        type="datetimerange"
        :start-placeholder="t('common.startDate')"
        :end-placeholder="t('common.endDate')"
      />
    </el-form-item>

    <el-form-item :label="`${t('sell.matchId')}:`" prop="matchId">
      <el-input
        v-model="form.matchId"
        :placeholder="t('sell.matchId')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('settle.league')}:`" prop="matchName">
      <el-input
        v-model="form.matchName"
        :placeholder="t('settle.league')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('settle.settlementStatus')}:`" prop="isSale">
      <el-select
        class="!w-[100px]"
        v-model="form.settleStatus"
        :placeholder="t('common.select')"
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
        {{ t("commonTable.search") }}
      </el-button>
      <el-button
        :icon="useRenderIcon(icon_refresh)"
        @click="resetForm(formRef)"
      >
        {{ t("commonTable.reset") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import icon_serch from "@iconify-icons/ep/search";
import icon_refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useLeague } from "../utils/hook";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";

const formRef = ref();
const { t } = useTranslationLang();

defineProps<{ loading: boolean }>();

const { form, dataVendorsChange, onSearch, resetForm } = useLeague();
</script>

<style scoped></style>

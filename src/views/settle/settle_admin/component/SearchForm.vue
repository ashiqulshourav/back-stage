<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <!-- <el-form-item>
      <el-button>{{ t("体育") }}</el-button>
    </el-form-item> -->

    <!--  <el-form-item :label="`${t('结算时间')}:`">
      <el-date-picker
        v-model="form.date"
        type="datetimerange"
        :start-placeholder="t('开始日期')"
        :end-placeholder="t('结束日期')"
      />
    </el-form-item>
 -->
    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="form.matchId"
        :placeholder="t('赛事ID')"
        clearable
        class="!w-[150px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事分类')}:`" prop="sportId">
      <el-select v-model="form.sportId" :placeholder="t('请选择')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
      <el-input
        v-model="form.matchName"
        :placeholder="t('赛事名称')"
        clearable
      />
    </el-form-item>

    <el-form-item
      :label="`${t('上半场结算状态')}:`"
      prop="halfSettlementStatus"
    >
      <el-select v-model="form.halfSettlementStatus" :placeholder="t('请选择')">
        <el-option :label="t('已结算')" :value="1" />
        <el-option :label="t('未结算')" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('全场结算状态')}:`" prop="halfSettlementStatus">
      <el-select v-model="form.fullSettlementStatus" :placeholder="t('请选择')">
        <el-option :label="t('已结算')" :value="1" />
        <el-option :label="t('未结算')" :value="0" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(icon_serch)"
        :loading="loading"
        @click="searchVal"
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
import { t } from "@/plugins/i18n";
import { FormProps } from "../utils/type";
// import { useLeague } from "../utils/hook";
const formRef = ref();
const emit = defineEmits(["onSearch", "resetForm"]);
import { SPORT_ID_MAP } from "@/utils/maps/sports_map";

defineProps<{
  form: FormProps;
  loading: boolean;
}>();

const searchVal = () => {
  emit("onSearch", "reload");
};

const resetForm = formRef => {
  emit("resetForm", formRef);
};
</script>

<style scoped></style>

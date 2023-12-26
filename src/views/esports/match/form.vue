<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item :label="`${t('eMatch.leagueId')}:`" prop="leagueId" v-if="newFormInline.leagueId">
      <el-input v-model="newFormInline.leagueId" disabled :placeholder="t('eMatch.leagueId')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.leagueNameCn')}:`" prop="leagueNameCn">
      <el-input v-model="newFormInline.leagueNameCn" clearable :placeholder="t('eMatch.leagueNameCn')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.leagueNameEn')}:`" prop="leagueNameEn">
      <el-input v-model="newFormInline.leagueNameEn" clearable :placeholder="t('eMatch.leagueNameEn')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.leagueName')}:`" prop="leagueName">
      <el-input v-model="newFormInline.leagueName" clearable :placeholder="t('eMatch.leagueName')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.dataSource')}:`" prop="dataSource">
      <el-input v-model="newFormInline.dataSource" clearable :placeholder="t('eMatch.dataSource')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.dataSourceName')}:`" prop="dataSourceName">
      <el-input v-model="newFormInline.dataSourceName" clearable :placeholder="t('eMatch.dataSourceName')" />
    </el-form-item>

    <el-form-item :label="`${t('eMatch.sort')}:`" prop="sort" v-if="newFormInline.sort > -1">
      <el-input v-model="newFormInline.sort" disabled clearable />
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
const { t } = useTranslationLang();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueId: "",
    leagueNameCn: "",
    leagueNameEn: "",
    leagueName: "",
    dataSource: "",
    dataSourceName: "",
    sort: -1
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>
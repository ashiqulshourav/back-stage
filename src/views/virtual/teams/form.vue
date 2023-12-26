<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item :label="`${t('vTeam.teamId')}:`" prop="teamId" v-if="newFormInline.teamId">
      <el-input v-model="newFormInline.teamId" disabled :placeholder="t('vTeam.teamId')" />
    </el-form-item>

    <el-form-item :label="`${t('vTeam.teamNameCn')}:`" prop="teamNameCn">
      <el-input v-model="newFormInline.teamNameCn" clearable :placeholder="t('vTeam.teamNameCn')" />
    </el-form-item>

    <el-form-item :label="`${t('vTeam.teamNameEn')}:`" prop="teamNameEn">
      <el-input v-model="newFormInline.teamNameEn" clearable :placeholder="t('vTeam.teamNameEn')" />
    </el-form-item>

    <el-form-item :label="`${t('vTeam.teamName')}:`" prop="teamName">
      <el-input v-model="newFormInline.teamName" clearable :placeholder="t('vTeam.teamName')" />
    </el-form-item>

    <el-form-item :label="`${t('vTeam.dataSource')}:`" prop="dataSource">
      <el-input v-model="newFormInline.dataSource" clearable :placeholder="t('vTeam.dataSource')" />
    </el-form-item>

    <el-form-item :label="`${t('vTeam.dataSourceName')}:`" prop="dataSourceName">
      <el-input v-model="newFormInline.dataSourceName" clearable :placeholder="t('vTeam.dataSourceName')" />
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
    teamId: "",
    teamNameCn: "",
    teamNameEn: "",
    teamName: "",
    dataSource: "",
    dataSourceName: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>
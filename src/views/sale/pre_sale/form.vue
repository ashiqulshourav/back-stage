<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item :label="`${t('赛事ID')}:`" prop="matchId">
      <el-input
        v-model="newFormInline.matchId"
        clearable
        placeholder="赛事ID"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事名称')}:`" prop="matchName">
      <el-input
        v-model="newFormInline.matchName"
        :placeholder="t('赛事名称')"
      />
    </el-form-item>

    <el-form-item :label="`${t('赛事等级')}:`" prop="level">
      <el-input
        v-model="newFormInline.level"
        :placeholder="t('赛事等级')"
        v-number="5"
      />
    </el-form-item>

    <el-form-item :label="`${t('比赛时间')}:`" prop="beginTime">
      <el-date-picker
        v-model="newFormInline.beginTime"
        type="datetime"
        :placeholder="t('比赛时间')"
        value-format="x"
        format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item :label="`${'赛种'}:`" prop="sportId">
      <el-select v-model="newFormInline.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { TeamFormProps } from './utils/types';
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const props = withDefaults(defineProps<TeamFormProps>(), {
  formInline: () => ({
    matchId: 0,
    sportId: 0,
    matchName: '',
    level: 0,
    beginTime: ''
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<style lang="scss">
.avatar-uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
  }
}
</style>

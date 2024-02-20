<template>
  <div class="pr-6">
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item :label="t('分类名称')" prop="configValue">
        <el-input
          maxlength="30"
          v-model="formData.configValue"
          :placeholder="t('请输入分类名称')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="`${t('分类标签')}:`" prop="tags">
        <el-select v-model="formData.tags" :placeholder="t('请选择')" multiple>
          <el-option
            :label="item"
            :value="item"
            v-for="item in tagList"
            :key="item"
          />
        </el-select>
      </el-form-item>

      <div class="flex justify-end">
        <el-button @click="closeDialog"> {{ t('取消') }} </el-button>
        <el-button type="primary">
          {{ t('确认新增') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { t } from '@/plugins/i18n';

const props = withDefaults(
  defineProps<{
    form: { sportId: number; sportName: string; configValue: string };
  }>(),
  {}
);

const formData = reactive({ ...props.form, tags: [] });
const tagList = reactive<string[]>([]);
const ruleFormRef = ref();

onMounted(() => {
  initTag();
});

//- 获取分类标签
const initTag = async () => {
  const res = await API.getTags({ sportId: formData.sportId });
  if (res.code) return;
  tagList.length = 0;
  tagList.push(...res.data);
};

const emits = defineEmits(['closeDialog']);
const closeDialog = () => {
  emits('closeDialog');
};
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

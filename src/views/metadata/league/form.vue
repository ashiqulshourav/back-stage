<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <el-form-item label="联赛杯Logo:">
      <!-- action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" -->
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-change="onImgChange"
        :auto-upload="false"
      >
        <img v-if="imageUrl" :src="imageUrl" class="w-[200px]" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="联赛杯赛ID:" prop="leagueId">
      <el-input
        v-model="newFormInline.leagueId"
        clearable
        placeholder="联赛杯赛ID"
      />
    </el-form-item>

    <el-form-item label="国家地区ID" prop="countryId">
      <el-input
        v-model="newFormInline.countryId"
        clearable
        placeholder="国家地区ID"
      />
    </el-form-item>
    <el-form-item label="188数据源联赛杯赛">
      <el-input
        v-model="newFormInline.leagueId188Bet"
        placeholder="188数据源联赛杯赛"
      />
    </el-form-item>
    <el-form-item label="联赛杯赛名称">
      <el-input
        v-model="newFormInline.leagueId188Bet"
        placeholder="联赛杯赛名称"
      />
    </el-form-item>
    <el-form-item label="联赛杯赛英文名称">
      <el-input
        v-model="newFormInline.leagueNameEn"
        placeholder="联赛杯赛英文名称"
      />
    </el-form-item>
    <el-form-item label="赛事等级">
      <el-input v-model="newFormInline.level" placeholder="赛事等级" />
    </el-form-item>
    <el-form-item label="赛种ID">
      <el-input v-model="newFormInline.sportId" placeholder="赛种ID" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import type { UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueNameCn: "",
    level: "",
    countryId: "",
    leagueNameEn: "",
    leagueId: "",
    leagueLogo: "",
    leagueId188Bet: "",
    sportId: ""
  })
});

const beforeAvatarUpload: UploadProps["beforeUpload"] = _rawFile => {
  // if (rawFile.type !== "image/jpeg") {
  //   console.log("Avatar picture must be JPG format!");
  //   return false;
  // } else if (rawFile.size / 1024 / 1024 > 2) {
  //   console.log("Avatar picture size can not exceed 2MB!");
  //   return false;
  // }
  return true;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  _response,
  _uploadFile
) => {};

const onImgChange = respose => {
  imageUrl.value = URL.createObjectURL(respose.raw);
  console.log("form.vue文件 87==============行打印=", imageUrl.value);
};

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const imageUrl = ref<string>(newFormInline.value.leagueLogo);

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

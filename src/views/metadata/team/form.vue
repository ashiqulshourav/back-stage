<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <!-- <el-form-item :label="`${t('球队Logo')}:`" prop="teamLogo">
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
    </el-form-item> -->

    <el-form-item :label="t('国家地区')" prop="countryId">
      <el-select
        v-model="newFormInline.countryId"
        filterable
        class="w-[280px]"
        :placeholder="t('请选择国家')"
        clearable
      >
        <el-option
          v-for="item in matchStore.countryList"
          :key="item.countryId"
          :label="item.countryNameCn"
          :value="item.countryId"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('是否国家队')}:`" prop="isCountryTeam">
      <el-select
        v-model="newFormInline.isCountryTeam"
        :placeholder="t('请选择')"
      >
        <el-option :label="t('是')" :value="0" />
        <el-option :label="t('否')" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('球队等级')" prop="level">
      <el-select
        v-model="newFormInline.level"
        class="w-[280px]"
        :placeholder="t('联赛等级')"
      >
        <el-option v-for="item in 8" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>

    <el-form-item label="赛种" prop="sportId">
      <el-select v-model="newFormInline.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('主场名称')}:`" prop="stadiumName">
      <el-input
        v-model="newFormInline.stadiumName"
        maxLength="30"
        :placeholder="t('主场名称')"
      />
    </el-form-item>

    <el-form-item :label="`${t('球队中文名称')}:`" prop="teamNameCn">
      <el-input
        v-model="newFormInline.teamNameCn"
        :placeholder="t('球队中文名称')"
      />
    </el-form-item>

    <el-form-item :label="`${t('球队英文名称')}:`" prop="teamNameEn">
      <el-input
        v-model="newFormInline.teamNameEn"
        :placeholder="t('球队英文名称')"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { TeamFormProps } from './utils/types';
// import type { UploadProps } from 'element-plus';
// import { Plus } from '@element-plus/icons-vue';
import { t } from '@/plugins/i18n';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useMatchStore } from '@/store/match';

const matchStore = useMatchStore();
const props = withDefaults(defineProps<TeamFormProps>(), {
  formInline: () => ({
    teamId: 0,
    countryId: 0,
    sportId: 0,
    leagueId: 0,
    teamNameCn: '',
    teamNameEn: '',
    // teamLogo: '',
    isCountryTeam: 0,
    level: 0
  })
});

/* const beforeAvatarUpload: UploadProps['beforeUpload'] = _rawFile => {
  if (rawFile.type !== 'image/jpeg') {
    console.log('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    console.log('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
}; */

/* const handleAvatarSuccess: UploadProps['onSuccess'] = (
  _response,
  _uploadFile
) => {}; */

/* const onImgChange = respose => {
  imageUrl.value = URL.createObjectURL(respose.raw);
}; */

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

// const imageUrl = ref<string>(newFormInline.value.teamLogo);

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

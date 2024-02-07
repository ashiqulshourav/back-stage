<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="150px"
  >
    <!-- todo 自定义表单添加 -->
    <!-- <el-form-item :label="t('联赛杯Logo')">
      <CustomInput />
      <el-upload
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
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
    <el-form-item :label="t('联赛ID')" prop="leagueId">
      <el-input
        v-model="newFormInline.leagueId"
        clearable
        :placeholder="t('联赛ID')"
        :disabled="!!newFormInline.leagueId"
      />
    </el-form-item>

    <el-form-item :label="t('国家地区')" prop="countryId">
      <el-select
        v-model="newFormInline.countryId"
        filterable
        clearable
        class="!w-[280px]"
        :placeholder="t('请选择国家')"
      >
        <el-option
          v-for="item in matchStore.countryList"
          :key="item.countryId"
          :label="item.countryNameCn"
          :value="item.countryId"
        />
      </el-select>
    </el-form-item>

    <!-- <el-form-item :label="t('188数据源联赛杯赛')" prop="leagueId188Bet">
      <el-input
        v-model="newFormInline.leagueId188Bet"
        :placeholder="t('188数据源联赛杯赛')"
      />
    </el-form-item> -->
    <el-form-item :label="t('联赛杯赛中文名')" prop="leagueNameCn">
      <el-input
        v-model="newFormInline.leagueNameCn"
        maxLength="35"
        :placeholder="t('联赛杯赛中文名')"
      />
    </el-form-item>
    <el-form-item :label="t('联赛杯英文名称')" prop="leagueNameEn">
      <el-input
        v-model="newFormInline.leagueNameEn"
        :placeholder="t('联赛杯英文名称')"
        maxLength="35"
      />
    </el-form-item>
    <el-form-item :label="t('联赛等级')" prop="level">
      <el-input
        :formatter="v => inputRestrictions(v)"
        v-model="newFormInline.level"
        :placeholder="t('请输入1-200之间的数字')"
        type="number"
        clearable
        class="!w-[200px]"
      />
    </el-form-item>
    <!-- <el-form-item label="赛种" prop="sportId">
      <el-select v-model="newFormInline.sportId" :placeholder="t('赛种')">
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in SPORT_ID_MAP"
          :key="item.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item :label="t('联赛标签')" prop="tags">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >{{ t('全选') }}</el-checkbox
      >
      <el-checkbox-group
        v-model="newFormInline.tags"
        @change="handleCheckedTagIdsChange"
      >
        <el-checkbox v-for="tag in tags" :key="tag.id" :label="tag.id">{{
          tag.tagName
        }}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formRules } from './utils/rule';
import { FormProps } from './utils/types';
// import type { UploadProps } from 'element-plus';
// import { Plus } from '@element-plus/icons-vue';
import { t } from '@/plugins/i18n';
// import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useMatchStore } from '@/store/match';
import { inputRestrictions } from '@/utils/formatNumber';
// import CustomInput from '@/components/Form/CustomInput.vue';
import { useLeague } from './utils/hook';

const { form } = useLeague();

const matchStore = useMatchStore();
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    leagueNameCn: '',
    level: '',
    countryId: '',
    leagueNameEn: '',
    leagueId: '',
    // leagueLogo: '',
    // leagueId188Bet: '',
    sportId: '',
    tags: []
  })
});

const tags = ref([]);

onMounted(async () => {
  const response = await API.searchLeagueTagList({
    categoryId: parseInt(form.category),
    sportId: parseInt(newFormInline.value.sportId)
  });
  tags.value = response.data;
  console.log(response.data);
});

/* const beforeAvatarUpload: UploadProps['beforeUpload'] = _rawFile => {
  if (rawFile.type !== "image/jpeg") {
    console.log("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    console.log("Avatar picture size can not exceed 2MB!");
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

// const imageUrl = ref<string>(newFormInline.value.leagueLogo);

function getRef() {
  return ruleFormRef.value;
}

const checkAll = ref(false);
const isIndeterminate = ref(true);

const handleCheckAllChange = (val: boolean) => {
  newFormInline.value.tags = val ? tags.value.map(item => item.id) : [];
  isIndeterminate.value = false;
};
const handleCheckedTagIdsChange = (value: number[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === tags.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < tags.value.length;
};

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

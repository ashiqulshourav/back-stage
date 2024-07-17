<template>
  <el-steps class="w-full mt-3" :active="active" finish-status="success">
    <el-step title="上传文件" />
    <el-step title="数据预览" />
    <el-step title="导入数据" />
    <el-step title="导入完成" />
  </el-steps>

  <div v-if="active == 0">
    <div class="rounded my-5 border border-gray-300 flex">
      <div class="w-[100px] flex justify-center items-center bg-gray-100">
        <el-icon><Files /></el-icon>
      </div>
      <div class="p-5">
        <p class="font-bold mb-3">
          {{ t('填写导入数据信息') }}
        </p>
        <p class="text-gray-500">
          {{
            t(
              '请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除'
            )
          }}
        </p>
        <p class="text-blue-600">
          {{ t('下载模板') }}
        </p>
      </div>
    </div>
    <el-upload
      action=""
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onFileChange"
      file
    >
      <div class="rounded my-5 border border-gray-300 flex cursor-pointer">
        <div class="w-[100px] flex justify-center items-center bg-gray-100">
          <el-icon><Files /></el-icon>
        </div>
        <div class="p-5">
          <p class="font-bold mb-3">{{ t('上传填好的信息表') }}</p>
          <p class="text-gray-500">
            {{
              t(
                '文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M，最多支持导入30000条数据'
              )
            }}
          </p>
          <p class="text-blue-600" v-if="!uploadFormFile">
            {{ t('上传文件') }}
          </p>
          <div class="flex gap-2" v-else>
            <p class="text-blue-600">
              {{ uploadFormFile.name }}
            </p>
            <p class="text-gray-400">
              ({{ Math.abs(uploadFormFile.size / 1024).toFixed(0) }} KB)
            </p>
          </div>
        </div>
      </div>
    </el-upload>
  </div>
  <div v-if="active == 1">2</div>

  <!-- Note -->
  <div
    v-if="active == 0"
    class="flex items-center rounded bg-[#fff5e6] mt-5 h-[80px] px-[15px] gap-3"
  >
    <div>
      <el-icon size="30" color="orange"><WarningFilled /></el-icon>
    </div>
    <div>
      <p class="font-bold">{{ t('特别提示') }}</p>
      <p class="text-gray-500">
        {{
          t(
            '导入过程中采用增量更新方式，即导入的标签和现有匹配，没有这个标签就会添加，已经有但是导入的没有就会删除'
          )
        }}
      </p>
    </div>
  </div>

  <div class="flex justify-end mt-10">
    <el-button v-if="active != 0" @click="previous">{{
      t('上一步')
    }}</el-button>
    <el-button type="primary" @click="next">{{ t('下一步') }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from '@/plugins/i18n';
import { Files } from '@element-plus/icons-vue';
import { WarningFilled } from '@element-plus/icons-vue';
import { UploadFile } from 'element-plus';
import { message } from '@/utils/message';

const active = ref(0);
const uploadFormFile = ref();

const next = async () => {
  if (uploadFormFile) {
    if (active.value == 0) {
      let formData = new FormData();
      formData.append('file', uploadFormFile.value);
      const res = await API.operateImportExcel(formData);
      console.log(res);

      // const res2 = await API.operateExport();
      // console.log(res2);

      // const res3 = await API.operateUpload(formData);
      // console.log(res3);

      // if (active.value++ > 3) active.value = 0;
    }
  }
};

const previous = () => {
  if (active.value != 0) {
    active.value--;
  }
};

const onFileChange = (file: UploadFile) => {
  let name = file.name;
  console.log({ file, name });
  let kb = 10000 * 1024;
  if (['xls', 'xlsx'].includes(name.toLowerCase().split('.').pop() as string)) {
    if ((file.size as number) > kb) {
      message(t('文件过大，请重新上传'), { type: 'error' });
    } else {
      uploadFormFile.value = file.raw;
    }
  } else {
    message(t('上传文件格式不匹配,请上传excel格式文件'), {
      type: 'error'
    });
  }
};
</script>

<style lang="scss"></style>

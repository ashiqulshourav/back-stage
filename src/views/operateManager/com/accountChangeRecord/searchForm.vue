<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item prop="accountChangeTypeCode">
      <el-select
        v-model="form.accountChangeTypeCode"
        :placeholder="`${t('请选择账变类型')}`"
        clearable
        class="!w-[150px]"
      >
        <el-option :label="t('全部')" :value="' '" />
        <el-option
          :label="item.label"
          :value="item.value"
          v-for="item in accountChangeTypeCodeList"
          :key="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('账变时间')}:`" prop="createTimeStart">
      <el-date-picker
        type="datetimerange"
        format="YYYY-MM-DD HH:mm:ss"
        v-model="selectDate"
        :start-placeholder="dayjs().startOf('month').format('YYYY-MM-DD')"
        :end-placeholder="dayjs().endOf('day').format('YYYY-MM-DD')"
        @change="changeDate"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t("筛选") }}
      </el-button>
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t("重置") }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from "@/plugins/i18n"
import SearchIcon from "@iconify-icons/ep/search"
import RefreshIcon from "@iconify-icons/ep/refresh"
import { useRenderIcon } from "@/components/ReIcon/src/hooks"
import type { FormInstance } from "element-plus"
import dayjs from "dayjs"
import {accountChangeRecordSearchFormType} from "./util/types"
import { accountChangeTypeCodeList } from "./columns"
//accountChangeRecordSearchFormType
const props = defineProps<{
  loading: boolean
  form: accountChangeRecordSearchFormType
}>()

const formRef = ref()
const selectDate = ref()

const emits = defineEmits(["onSearch", "exportFile"])
const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
  selectDate.value = ""
  props.form.startCreatedAt = dayjs()
    .startOf("month")
    .format("YYYY-MM-DD HH:mm:ss")
  props.form.endCreatedAt = dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss")
  search()
}

const exportFile = () => {
  emits("exportFile")
}

const changeDate = t => {
  if (!t) {
    props.form.startCreatedAt = ""
    props.form.endCreatedAt = ""
  } else {
    props.form.startCreatedAt = dayjs(t[0]).format("YYYY-MM-DD HH:mm:ss")

    props.form.endCreatedAt = dayjs(t[1]).format("YYYY-MM-DD HH:mm:ss")
  }
  search()
}

const search = () => {
  emits("onSearch", ...["reload"])
}
</script>
<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.min-w100{
  min-width: 100px;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
.arrange2{
  margin-left: -25px;
}
</style>

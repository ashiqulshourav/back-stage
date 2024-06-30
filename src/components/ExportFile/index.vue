<template>
  <el-button
    type="primary"
    :icon="useRenderIcon(Download)"
    :loading="loading"
    v-if="hasAuth('EXPORT')"
    @click="exportFile"
  >
    {{ t('导出') }}
  </el-button>
</template>

<script setup lang="ts">
import { t } from "@/plugins/i18n"
import {useRenderIcon} from "@/components/ReIcon/src/hooks";
import Download from "@iconify-icons/ep/download";
import {hasAuth} from "@/router/utils";
import {ref} from "vue";
const loading = ref(false);
const props = defineProps<{
  form: any;
  exportUrl:string;
  formatParams:Function;
  privateParams?:any;
  total:number;
}>();
const emits = defineEmits(['search']);

const exportFile = async ()=>{
     emits('search');

}
// const closeDialog = () => {
//   emits("closeDialog")
// }
</script>

<style scoped>

</style>

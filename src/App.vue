<template>
  <el-config-provider :locale="currentLocale">
    <router-view />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElConfigProvider } from 'element-plus';
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
//@ts-ignore
import en from 'element-plus/dist/locale/en.mjs';
import { ReDialog } from '@/components/ReDialog';
export default defineComponent({
  name: 'app',
  components: {
    [ElConfigProvider.name as string]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === 'zh' ? zhCn : en;
    }
  }
});
</script>

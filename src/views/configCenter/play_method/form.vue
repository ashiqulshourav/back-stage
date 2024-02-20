<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item
      title="Consistency"
      :name="(index + 1).toString()"
      v-for="(item, index) in dataList"
      :key="index"
    >
      <div>
        {{ item }}
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { message } from '@/utils/message';

const props = defineProps<{
  sportId: number;
  matchId: number;
}>();

const activeName = ref('1');
const dataList = reactive<PLayMethodAPI.getKindsCodebyMatchIdData[]>([]);

onMounted(() => {
  initMethodList();
});

const initMethodList = async () => {
  const res = await API.getKindsCodeByMatchId(props);
  if (res.code) return message(res.msg, { type: 'error' });
  dataList.length = 0;
  dataList.push(...res.data);
  console.log('form.vue文件 17==============行打印=', dataList);
};
</script>

<style scoped></style>

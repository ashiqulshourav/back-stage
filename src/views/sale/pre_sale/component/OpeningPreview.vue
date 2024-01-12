<template>
  <div class="flex flex-col">
    <div>
      <span>英格兰超级联赛</span>
      <span>01/18/2024 21:00:00</span>
    </div>
    <div class="mb-3 flex justify-between">
      <span>阿森纳 VS 水晶宫</span>
      <span>{{ t('开售盘口/总盘口数:') }} 22 / 30</span>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="进球玩法" name="first">
        <el-collapse v-model="colActiveNames" @change="handleChange">
          <el-collapse-item
            :title="_"
            :name="index"
            v-for="(_, index) in playList"
            :key="index"
          >
            <div v-for="item in 3" :key="item" class="flex items-center mb-1">
              <el-button class="flex-grow text-center">大 0.5/1</el-button>
              <IconifyIconOffline
                icon="lockUnlockFill"
                class="ml-2 mr-2 cursor-pointer"
              />
              <el-button class="flex-grow text-center">小 0.5/1</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="角球玩法" name="second">角球玩法</el-tab-pane>
      <el-tab-pane label="罚球玩法" name="third">罚球玩法</el-tab-pane>
      <el-tab-pane label="其他玩法" name="fourth">其他玩法</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';

const activeName = ref('first');
const colActiveNames = ref([]);
const playList = ['进球大/小', '让球', '波胆', '进球数量'];

const props = withDefaults(
  defineProps<{
    matchId: number;
  }>(),
  {}
);

onMounted(() => {
  getBetItemsList();
  console.log('OpeningPreview.vue文件 55==============行打印=', props.matchId);
});

const getBetItemsList = async () => {
  const res = await API.getBetItemsList({ ...props });
  console.log('OpeningPreview.vue文件 61==============行打印=', res);
};

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

const handleChange = () => {};
</script>

<style lang="scss" scoped></style>

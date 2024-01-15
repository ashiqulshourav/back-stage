<template>
  <div class="flex flex-col pl-10 pr-10">
    <div class="mb-3">
      <span>{{ matchInfo.leagueNameCn }}</span>
      <span class="ml-4">
        {{ dayjs(matchInfo.beginTimeLong).format('YYYY-MM-DD HH:mm:ss') }}</span
      >
    </div>
    <div class="mb-3 flex justify-between">
      <span
        >{{ matchInfo.homeTeamNameCn }} VS {{ matchInfo.awayTeamNameCn }}</span
      >
      <span
        >{{ t('开售盘口/总盘口数:') }} {{ openLen }} /
        {{ matchInfo.allHandicaps }}</span
      >
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        :label="o.value"
        :name="index"
        v-for="(o, index) in mData"
        :key="index"
      >
        <template v-if="o.formatList.length">
          <el-collapse v-model="colActiveNames" @change="handleChange">
            <el-collapse-item
              :title="_[0][0].betItemsName"
              :name="i"
              v-for="(_, i) in o.formatList"
              :key="i"
            >
              <div
                v-for="cItem in _"
                :key="cItem.sourceBetItemsId"
                class="flex items-center mb-1"
              >
                <template
                  v-if="
                    cItem[0].sourceCode !== 'FT_CS' &&
                    cItem[0].sourceCode !== 'HT_CS'
                  "
                >
                  <el-button
                    class="flex-grow text-center flex justify-between w-1/3"
                    v-for="s in cItem"
                    :key="s.sourceBetItemsId"
                  >
                    <span>{{
                      PLAY_MATCH[s.sourceCode][s.homeOrAway || s.handicap]
                    }}</span>
                    <span v-if="!PLAY_MATCH[s.sourceCode].hideMiddle">{{
                      s.handicap
                    }}</span>
                    <span>{{ s.odds }}</span>
                  </el-button>
                </template>
                <template v-else>
                  <el-button
                    :class="[
                      'flex-grow text-center flex justify-between w-1/3',
                      s ? 'visible' : 'invisible'
                    ]"
                    v-for="(s, idx) in cItem"
                    :key="idx"
                  >
                    <template v-if="s">
                      <span>{{ s.handicap }}</span>
                      <span>{{ s.odds }}</span>
                    </template>
                  </el-button>
                </template>
                <div
                  class="h-8 flex justify-center items-center cursor-pointer ml-3"
                >
                  <el-popconfirm
                    :title="t('是否确认修改锁盘状态?')"
                    @confirm="upateLockStatus(cItem)"
                  >
                    <template #reference>
                      <IconifyIconOffline
                        :icon="cItem[0].isSale === 2 ? 'unlock' : 'lock'"
                      />
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </template>
        <template v-else>
          <div v-loading="isLoading">
            <el-empty :description="t('暂无数据')" :image-size="100" />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import { ref } from 'vue';
// import type { TabsPaneContext } from 'element-plus';
import { PLAY_MATCH, transferBoDan } from '@/utils/maps/sports_map';
import dayjs from 'dayjs';
import { message } from '@/utils/message';

const activeName = ref('0');
const colActiveNames = ref([0]);
const timer = ref();
const openLen = ref(0);
const isLoading = ref(true);

interface IMData {
  [key: number]: {
    formatList: any[];
    value: string;
  };
}
const mData = reactive<IMData>({
  0: { formatList: [], value: t('进球玩法') },
  1: { formatList: [], value: t('角球玩法') },
  2: { formatList: [], value: t('罚牌玩法') },
  3: { formatList: [], value: t('其他玩法') }
});

const props = withDefaults(
  defineProps<{ matchId: number; matchInfo: SaleDataAPI.PreSaleList }>(),
  {}
);

onMounted(() => {
  getBetItemsList();
  runGetBetItemsList();
});

const runGetBetItemsList = () => {
  timer.value = setInterval(getBetItemsList, 5000);
};

const getBetItemsList = async () => {
  isLoading.value = true;
  const res: SaleDataAPI.getBetItemsListResType = await API.getBetItemsList({
    matchId: props.matchId
  });
  if (res.code) return;
  Object.keys(mData).forEach(key => (mData[key].formatList.length = 0));
  openLen.value = 0;
  res.data.forEach(item => {
    item.isSale === 2 && (openLen.value += 1);
    if (mData[item.ctid]) mData[item.ctid].formatList.push(item);
    else mData[3].formatList.push(item);
  });

  Object.values(mData).forEach(d => {
    const o = {};
    d.formatList
      .sort((a, b) => a.displayIndex - b.displayIndex)
      .forEach(item => {
        if (!o[item.kindsCode]) o[item.kindsCode] = [];
        o[item.kindsCode].push(item);
      });
    d.formatList = Object.values(o)
      .map((_: SaleDataAPI.getBetItemsListDataType[]) => {
        const o1 = {};
        _.forEach((h: SaleDataAPI.getBetItemsListDataType) => {
          if (!o1[h.sourceBetItemsMid]) o1[h.sourceBetItemsMid] = [];
          o1[h.sourceBetItemsMid].push(h);
        });
        if (_[0].kindsCode === 'FT_CS' || _[0].kindsCode === 'HT_CS') {
          const arr = transferBoDan(_);
          const chunkSize = 3;
          const result = Array.from(
            { length: Math.ceil(arr.length / chunkSize) },
            (_, i) => arr.slice(i * chunkSize, i * chunkSize + chunkSize)
          );
          return result;
        } else {
          return Object.values(o1);
        }
      })
      .sort((a, b) => a.length - b.length);
  });
  isLoading.value = false;
};

const emits = defineEmits(['reloadTable']);
const upateLockStatus = async (
  cItem: SaleDataAPI.getBetItemsListDataType[]
) => {
  try {
    const params = {
      matchId: cItem[0].matchId,
      betItemList: cItem.filter(_ => _).map(_ => _.betItemsId)
    };
    if (cItem[0].isSale === 2) {
    } else {
    }
    const res: SaleDataAPI.saleBetItemsResType =
      cItem[0].isSale === 2
        ? await API.saleBetItems(params)
        : await API.openSaleBetItems(params);
    message(res.msg, { type: res.code ? 'error' : 'success' });
    if (res.code) return;
    getBetItemsList();
    emits('reloadTable');
  } catch (error) {
    console.log('OpeningPreview.vue文件 192==============行打印=', error);
  }
};

/* const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event);
}; */

onUnmounted(() => {
  timer.value && clearInterval(timer.value);
});

const handleChange = () => {};
</script>

<style lang="scss" scoped>
:deep() {
  .el-button {
    &:hover,
    &:focus {
      cursor: auto;
      background: transparent;
      border-color: #dcdfe6;
      color: var(--el-text-color-regular);
    }
    & > span {
      display: flex;
      justify-content: space-around;
      width: 100%;
      span {
        flex-grow: 1;
        text-align: center;
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
    }
  }
}
</style>

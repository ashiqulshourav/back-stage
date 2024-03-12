<template>
  <div class="flex mt-4 flex-wrap w-full">
    <CustomButton
      class="mb-2 !ml-0 mr-2"
      v-for="item in renderList"
      :key="item.value"
      :type="item.value === currentSportId ? 'primary' : ''"
      :btnText="item.label"
      @click="changeType(item)"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/Form/CustomButton.vue';
import { useMatchStore } from '@/store/match';
import { SPORT_LIST_MAP, SPORT_NAME_TYPE } from '../utils/map';
import { useSettingStoreHook } from '@/store/settings';
import { sport_list_map_type } from '../utils/type';
const settingStore = useSettingStoreHook();

const currentSportId = ref<number>(
  settingStore.settlePageInfo.matchType ?? SPORT_NAME_TYPE.football
);

const emits = defineEmits(['changeNavType']);
const matchStore = useMatchStore();
const renderList = computed(() => {
  return SPORT_LIST_MAP.slice(0, 9);
});

const changeType = (_: sport_list_map_type) => {
  if (_.value === currentSportId.value) return;
  matchStore.set_currentSportId(_.value);
  emits('changeNavType');
};
</script>

<style scoped></style>

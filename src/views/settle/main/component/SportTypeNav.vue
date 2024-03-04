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
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';
import { useMatchStore } from '@/store/match';
const props = defineProps<{
  currentSportId: number;
}>();

const emits = defineEmits(['changeCurrentComponentName']);
const matchStore = useMatchStore();
const renderList = computed(() => {
  return SPORT_ID_MAP.filter(_ => _.value !== 4).slice(0, 4);
});

const changeType = (_: { value: number; type: string }) => {
  if (_.value === props.currentSportId) return;
  // emits('onSearch', 'reload', val);
  matchStore.set_currentSportId(_.value);
  emits('changeCurrentComponentName', _);
};
</script>

<style scoped></style>

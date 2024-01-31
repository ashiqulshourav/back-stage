<template>
  <div class="flex mt-4">
    <CustomButton
      v-for="(item, index) in renderList"
      :key="item.value"
      :type="item.value === currentSportId ? 'primary' : ''"
      :btnText="item.label"
      :disabled="index > 0"
      @click="searchClick(item.value)"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/Form/CustomButton.vue';
import { SPORT_ID_MAP } from '@/utils/maps/sports_map';

const props = defineProps<{
  currentSportId: number;
}>();

const emites = defineEmits(['onSearch']);

const renderList = computed(() => {
  return SPORT_ID_MAP.filter(_ => _.value !== 4);
});

const searchClick = val => {
  if (val === props.currentSportId) return;
  emites('onSearch', 'reload', val);
};
</script>

<style scoped></style>

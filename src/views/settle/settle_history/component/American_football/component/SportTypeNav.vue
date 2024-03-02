<template>
  <div class="flex mt-4">
    <CustomButton
      v-for="item in SPORT_ID_MAP"
      :key="item.value"
      :type="item.value === currentSportId ? 'primary' : ''"
      :btnText="item.label"
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

const searchClick = val => {
  if (val === props.currentSportId) return;
  emites('onSearch', 'reload', val);
};
</script>

<style scoped></style>

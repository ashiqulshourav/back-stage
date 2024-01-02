<template>
  <div class="flex mt-4">
    <CustomButton
      v-for="item in SPORT_ID_MAP"
      :key="item.value"
      :type="item.value === currentSportId ? 'success' : ''"
      :btnText="item.label"
      @click="$emit('onSearch', 'reload', item.value)"
    />
  </div>
</template>

<script setup lang="ts">
import CustomButton from "@/components/Form/CustomButton.vue";
import { SPORT_ID_MAP } from "@/utils/maps/sports_map";
defineProps<{
  currentSportId: number;
}>();
</script>

<style scoped></style>

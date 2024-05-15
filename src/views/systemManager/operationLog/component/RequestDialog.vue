<template>
  <div v-html="renderData" style="white-space: pre-wrap" class="ml-5"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  requestLog: any;
}>();

const renderData = reactive<Record<string, unknown>>(
  props.requestLog as Record<string, unknown>
);
</script>

<style scoped></style>

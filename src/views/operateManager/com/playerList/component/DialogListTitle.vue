<template>
  <el-popover
    placement="right"
    :width="width"
    trigger="hover"
    :content="content"
  >
    <template #reference>
      <div class="flex items-center">
        <span class="mr-1">{{ title }}</span>
        <IconifyIconOffline
          class="cursor-pointer text-gray-400 text-sm"
          icon="infoFilled"
        />
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number;
    title: string;
    content: string;
  }>(),
  {
    width: 240
  }
);
</script>

<style scoped></style>

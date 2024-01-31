<template>
  <div>basketball</div>
</template>

<script setup lang="ts">
onMounted(() => {});

const test = () => {
  console.log('index.vue文件 9==============行打印=', 'basketball');
};

defineExpose({ test });
</script>

<style scoped></style>

<template>
  <div>
    {{ formattedTime }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  initialTime: number;
}>();

const remainingTime = ref(props.initialTime);

const padZero = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

const formattedTime = computed((): string => {
  const hours = Math.floor(remainingTime.value / 3600000);
  const minutes = Math.floor((remainingTime.value % 3600000) / 60000);
  const seconds = Math.floor((remainingTime.value % 60000) / 1000);
  return `${hours > 0 ? padZero(hours) + ':' : ''}${padZero(minutes)}:${padZero(
    seconds
  )}`;
});

const emites = defineEmits(['countdown-ended']);

const emitCountdownEnded = () => {
  emites('countdown-ended', new Date());
};

watch(
  () => remainingTime,
  ({ value }) => {
    console.log('index.vue文件 36==============行打印=', value);
    /*
     if (newVal <= 0) {
        this.emitCountdownEnded();
      }
       */
  }
);

const interval = ref<NodeJS.Timeout | null>(null);
onMounted(() => {
  if (remainingTime.value > 0) {
    interval.value = setInterval(() => {
      remainingTime.value -= 1000;
      if (remainingTime.value <= 0) {
        clearInterval(interval.value);
        emitCountdownEnded();
      }
    }, 1000);
  }
});
onUnmounted(() => {
  interval.value && clearInterval(interval.value);
});
</script>

<style scoped></style>

<template>
  <IconifyIconOffline
    :style="{ color: typeNum === SALE_STATUS.open ? '#A8ABB2' : '#409EFF' }"
    @click.stop="changeType(SALE_STATUS.open)"
    icon="trading_play"
  />
  <IconifyIconOffline
    class="text-sm ml-2 mr-2"
    icon="trading_switch"
    :style="{ color: typeNum === SALE_STATUS.close ? '#A8ABB2' : '#409EFF' }"
    @click.stop="changeType(SALE_STATUS.close)"
  />
  <IconifyIconOffline
    v-if="!closeThreeIcon"
    class="text-sm mr-2"
    :style="{ color: typeNum === SALE_STATUS.sealing ? '#A8ABB2' : '#409EFF' }"
    icon="trading_pause"
    @click.stop="changeType(SALE_STATUS.sealing)"
  />
  <IconifyIconOffline
    :style="{ color: typeNum === SALE_STATUS.lock ? '#A8ABB2' : '#409EFF' }"
    icon="trading_lock"
    @click.stop="changeType(SALE_STATUS.lock)"
  />
</template>

<script setup lang="ts">
import { SALE_STATUS } from '../util/playMap';
const props = defineProps<{
  typeNum?: number | null;
  closeThreeIcon?: boolean;
}>();

const emits = defineEmits(['changeMatchStatus']);
const changeType = (status: number) => {
  if (props.typeNum === status) return;
  emits('changeMatchStatus', status);
};
</script>

<style scoped></style>

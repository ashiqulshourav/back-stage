<template>
  <IconifyIconOffline
    :class="`text-[#${typeNum === SALE_STATUS.open ? '409EFF' : 'A8ABB2'}]`"
    @click.native.stop="changeType(SALE_STATUS.open)"
    icon="trading_play"
  />
  <IconifyIconOffline
    :class="`text-[#${
      typeNum === SALE_STATUS.close ? '409EFF' : 'A8ABB2'
    }] text-sm ml-2 mr-2`"
    icon="trading_switch"
    @click.native.stop="changeType(SALE_STATUS.close)"
  />
  <IconifyIconOffline
    :class="`text-[#${
      typeNum === SALE_STATUS.sealing ? '409EFF' : 'A8ABB2'
    }] text-sm  mr-2`"
    icon="trading_pause"
    @click.native.stop="changeType(SALE_STATUS.sealing)"
  />
  <IconifyIconOffline
    :class="`text-[#${typeNum === SALE_STATUS.lock ? '409EFF' : 'A8ABB2'}]`"
    icon="trading_lock"
    @click.native.stop="changeType(SALE_STATUS.lock)"
  />
</template>

<script setup lang="ts">
import { SALE_STATUS } from '../util/playMap';
defineProps<{
  typeNum?: number | null;
}>();

const emits = defineEmits(['changeMatchStatus']);
const changeType = (status: number) => {
  emits('changeMatchStatus', { status, classify: 'match' });
};
</script>

<style scoped></style>

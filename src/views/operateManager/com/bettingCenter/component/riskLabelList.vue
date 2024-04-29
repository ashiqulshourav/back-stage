<template>
  <div class="wrap">
      <div v-for="label in list"
        :style="`background-color: ${getLabelColor(
                        label.level,
                        'risk'
                      )}`"
        class="risk_item"
      >
        {{ label.name }}
      </div>
  </div>
</template>
<script setup lang="ts">
const {list} = defineProps<{
  list:UserAPI.labelType[]
}>();
const getLabelColor = (level: number, type: string) => {
  if (type === 'risk') {
    switch (level) {
      case 1:
        return 'rgba(163, 0, 20, 1)';
      case 2:
        return 'rgba(255, 92, 0, 1)';
      case 3:
        return 'rgba(255, 153, 0, 1)';
    }
  } else {
    switch (level) {
      case 1:
        return 'rgba(24, 145, 255, 1)';
      case 2:
        return 'rgba(25, 190, 107, 1)';
      case 3:
        return 'rgba(46, 64, 80, 1)';
    }
  }
};
</script>

<style lang="scss">
.wrap{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  justify-items: flex-start;
  .risk_item{
    border-radius: 6px;
    height: 25px;
    line-height: 25px;
    padding: 0 8px;
    margin: 5px 0;
  }
}
</style>

<template>
  <div class="h-full flex justify-center w-[1%]" v-for="d in 100" :key="d">
    <div
      v-if="(d - 1) % 15 === 0 && d !== 1"
      :class="[
        'w-[1px] h-full bg-[#dcdfe6] dark:bg-[#363536]',
        d - 1 === 45 && 'dark:bg-[#5f5246]'
      ]"
    ></div>
  </div>
</template>

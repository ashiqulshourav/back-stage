<template>
  <div class="relative flex h-[30px] leading-[30px]">
    <div
      v-for="i in 100"
      :key="i"
      :class="[
        'flex justify-center w-[1%]',
        (i - 1 == 45 || i - 1 === 90) && '!text-[#ec8d27]'
      ]"
    >
      {{
        i - 1 === 90
          ? 'End90'
          : i - 1 == 45
          ? 'HT'
          : (i - 1) % 15 === 0
          ? i - 1 + "'"
          : ''
      }}
    </div>
  </div>
</template>

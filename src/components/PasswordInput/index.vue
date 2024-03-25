<template>
  <div class="flex max-w-full">
    <input
      class="mr-1 text-center"
      v-for="(_, index) in passwordsArr"
      :key="index"
      v-model="passwordsArr[index]"
      @keyup="e => onInput(index, e)"
      maxlength="1"
    />
  </div>
</template>

<script setup lang="ts">
const passwordsArr = reactive(Array(6).fill(''));

// watch(passwords, newVal => {
//   const password = newVal.join('');
//   if (password.length === 6) {
//     // 触发密码输入完成事件，传递密码值
//     emit('input-complete', password);
//   }
// });

const onInput = (index, event) => {
  const input = event.target;
  if (!passwordsArr[index]) return;
  if (index < 5) {
    input.blur();
    const nextInput = input.nextElementSibling;
    if (nextInput) nextInput.focus();
    setTimeout(() => {}, 0);
  }
};
</script>

<style scoped lang="scss">
input {
  flex-grow: 1;
  border: 1px solid #ccc;
  width: 50px;
  text-align: center;
  height: 30px;
}
</style>

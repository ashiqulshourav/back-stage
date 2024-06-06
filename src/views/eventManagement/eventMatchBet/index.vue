<template>
  <div class="main h-full flex flex-col">
    <SearchFrom :form="form" :loading="loading" @on-search="onSearch" />
    <div class="bet_amount_container">
      <div class="main_container">
        <div class="timer_container">
          <div v-for="item in timerList" :key="item">{{ item }}</div>
        </div>
        <div class="middle_content">
          <div>
            <div v-for="d in 6" :key="d"></div>
          </div>
          <div class="main_div"></div>
          <div>
            <div v-for="d in 6" :key="d"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchFrom from './com/SearchFrom.vue';
import { useEventMatchBet } from './util/hook';

const { loading, onSearch, form } = useEventMatchBet();
/* "0'",'End90' */
const timerList = ["0'", "15'", "30'", 'HT', "60'", 'End90'];
</script>

<style scoped lang="scss">
.bet_amount_container {
  flex-grow: 1;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  .main_container {
    position: relative;
    padding-left: 80px;
    padding-right: 20px;
    background-color: #3e3e3e;
    width: 100%;
    border: 1px solid #ccc;
    .timer_container {
      position: relative;
      display: flex;
      height: 30px;
      line-height: 30px;
      & > div {
        width: 16.6%;
        color: #67595e;
        justify-content: space-around;
        text-align: left;
      }
    }
    .middle_content {
      & > div {
        &:first-child,
        &:last-child {
          height: 35px;
          background-color: #524e4b;
          display: flex;
          & > div {
            width: 16.6%;
            border-right: 1px solid #363536;
            &:not(& > div:last-child) {
              border-right: none;
            }
          }
        }
        &:nth-child(2) {
          height: 80px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-scrollbar__view {
  height: calc(100% - 20px);
}
</style>

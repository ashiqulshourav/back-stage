<template>
  <div class="main h-full flex flex-col">
    <SearchFrom :form="form" :loading="loading" @on-search="onSearch" />
    <div class="bet_amount_container">
      <div class="main_container bg-[#409eff] text-white dark:bg-[#3e3e3e]">
        <div class="timer_container">
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
        <div class="middle_content">
          <div class="bg-[#00e8ff] dark:bg-[#676877]">
            <div
              class="h-full flex justify-center w-[1px]"
              v-for="d in 100"
              :key="d"
            >
              <div
                v-if="(d - 1) % 15 === 0 && d !== 1"
                :class="[
                  'w-[1px] h-full bg-[#dcdfe6] dark:bg-[#363536]',
                  d - 1 === 45 && 'dark:bg-[#5f5246]'
                ]"
              ></div>
            </div>
          </div>
          <div class="relative h-[140px]">
            <div
              class="absolute w-[1px] h-full left-[45.45%] translate-x-[-50%] bg-[#dcdfe6] dark:bg-[#363536]"
            ></div>
            <div
              class="w-full absolute bottom-[10px] -translate-y-1/2 bg-[#00e8ff] dark:bg-[#676877] h-[1px]"
            ></div>
            <div
              :class="[
                'absolute bottom-[14px] cursor-pointer px-[2px]  w-[1%] left-0'
              ]"
            >
              <div class="bg-[#eeb683] h-[2px]"></div>
            </div>
            <div
              :class="[
                'absolute bottom-[14px] cursor-pointer px-[2px]  w-[1%] left-[2%]'
              ]"
            >
              <div class="bg-[#eeb683] h-[2px]"></div>
            </div>
          </div>
          <div class="bg-[#00e8ff] dark:bg-[#676877]">
            <div class="h-full flex justify-center" v-for="d in 100" :key="d">
              <div
                v-if="(d - 1) % 15 === 0 && d !== 1"
                :class="[
                  'w-[1px] h-full bg-[#363536]',
                  d - 1 === 45 && 'bg-[#5f5246]'
                ]"
              ></div>
            </div>
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
// const timerList = ["0'", "15'", "30'", 'HT', "60'", 'End90'];
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
    width: 100%;
    .timer_container {
      position: relative;
      display: flex;
      height: 30px;
      line-height: 30px;
      & > div {
        width: 1%;
      }
    }
    .middle_content {
      & > div {
        &:first-child,
        &:last-child {
          height: 35px;
          display: flex;
          & > div {
            width: 1%;
            // border-right: 1px solid #363536;
          }
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


// 解析当前比分
const MAX_INPUT_NUMBER_LENGTH = 15;
export const formatNumber = (val: string, len?: number) => {
  return val.replace(/\D/g, '').replace(/^0{1,}/g, '').slice(0, len ?? MAX_INPUT_NUMBER_LENGTH)
}
// 多组件库的国际化和本地项目国际化兼容
import { App, WritableComputedRef } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { type I18n, createI18n } from "vue-i18n";
import { responsiveStorageNameSpace } from "@/config";

// element-plus国际化
import enLocale from "element-plus/lib/locale/lang/en";
import zhLocale from "element-plus/lib/locale/lang/zh-cn";
import frLocale from "element-plus/lib/locale/lang/fr";
import { CRC32 as crc32 } from 'crc_32_ts';

function siphonI18n(prefix = "zh-CN") {
  return Object.fromEntries(
    Object.entries(
      import.meta.glob("../../locales/json/*.json", { eager: true })
    ).map(([key, value]: any) => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)[1];
      return [matched, value.default];
    })
  )[prefix];
}

export const localesConfigs = {
  zh: {
    ...siphonI18n("zh-CN"),
    ...zhLocale
  },
  en: {
    ...siphonI18n("en"),
    ...enLocale
  },
  fr: {
    ...siphonI18n("fr"),
    ...frLocale
  }
};

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function t(message: any = "", params: any = {}) {
  if (!message) return "";
  const hashKey = `k${crc32.str(message).toString(16)}`;
  let words = i18n.global.t.call(i18n.global.locale, hashKey, params);
  if (words === hashKey) words = message;
  return words;
}

export const i18n: I18n = createI18n({
  legacy: false,
  locale:
    storageLocal().getItem<StorageConfigs>(
      `${responsiveStorageNameSpace()}locale`
    )?.locale ?? "zh",
  fallbackLocale: "en",
  messages: localesConfigs
});

export function useI18n(app: App) {
  app.use(i18n);
}

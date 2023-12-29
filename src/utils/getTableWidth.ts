import { useNav } from "@/layout/hooks/useNav";

export const getColumnWidth = (strs: string) => {
  const { $storage } = useNav();
  if ($storage.locale.locale === 'zh') {
    return strs.length * 30;
  } else {
    return strs.length * 15;
  }
}
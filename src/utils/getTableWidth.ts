import { useNav } from "@/layout/hooks/useNav";

export const handleTableWidth = (d, label: string, type?) => {
  const { $storage } = useNav();
  if (d.column.width || (type && $storage.locale.locale === 'zh')) return label;
  d.column.width = getColumnWidth(d.column.label);
}

export const getColumnWidth = (strs: string) => {
  const { $storage } = useNav();
  if ($storage.locale.locale === 'zh') {
    return strs.length * 30;
  } else {
    return strs.length * 15;
  }
}
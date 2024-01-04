import { useEventListener } from "@vueuse/core";
import type { Directive, DirectiveBinding } from "vue";



/** 文本复制指令（默认双击复制） */
export const enter: Directive = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding) {
    useEventListener(el, 'keyup', (e) => {
      if (e.key === 'Enter') binding.value();
    });
  },
};

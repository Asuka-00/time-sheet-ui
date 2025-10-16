import type { Directive, DirectiveBinding } from 'vue';
import { watchEffect } from 'vue';
import { usePermission } from 'src/composables/usePermission';

/**
 * 扩展 HTMLElement 以存储清理函数
 */
interface PermissionElement extends HTMLElement {
  _permissionCleanup?: () => void;
}

/**
 * 权限指令
 * 用法：v-permission="'user:create'" 或 v-permission="['user:create', 'user:edit']"
 * 
 * 当用户没有指定权限时，元素将从 DOM 中移除
 */
export const permissionDirective: Directive<PermissionElement, string | string[]> = {
  mounted(el: PermissionElement, binding: DirectiveBinding<string | string[]>) {
    const { hasPermission } = usePermission();
    
    // 保存原始的父节点和下一个兄弟节点，用于可能的重新插入
    const parent = el.parentNode;
    const nextSibling = el.nextSibling;
    const comment = document.createComment('v-permission');
    
    // 使用 watchEffect 监听权限变化
    const stop = watchEffect(() => {
      const permissionValue = binding.value;
      
      // 开发环境下的调试信息
      if (process.env.DEV && permissionValue) {
        const permissions = Array.isArray(permissionValue) ? permissionValue : [permissionValue];
        console.debug('[v-permission] Checking permissions:', permissions);
      }
      
      // 检查权限
      if (!hasPermission(permissionValue)) {
        // 无权限：移除元素，插入注释节点作为占位符
        if (el.parentNode) {
          el.parentNode.replaceChild(comment, el);
        }
        
        // 开发环境下的警告
        if (process.env.DEV) {
          console.warn(
            '[v-permission] Element hidden due to insufficient permissions:',
            permissionValue
          );
        }
      } else {
        // 有权限：确保元素在 DOM 中
        if (!el.parentNode && parent) {
          if (nextSibling) {
            parent.insertBefore(el, nextSibling);
          } else {
            parent.appendChild(el);
          }
          // 移除注释节点
          if (comment.parentNode) {
            comment.parentNode.removeChild(comment);
          }
        }
      }
    });
    
    // 将 cleanup 函数保存到元素上，以便 unmounted 时清理
    el._permissionCleanup = stop;
  },

  updated() {
    // 当指令的绑定值更新时，watchEffect 会自动响应
    // 这里不需要额外处理，因为 watchEffect 已经在监听
  },

  unmounted(el: PermissionElement) {
    // 清理 watchEffect
    const cleanup = el._permissionCleanup;
    if (cleanup) {
      cleanup();
      delete el._permissionCleanup;
    }
  },
};

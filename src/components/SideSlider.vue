<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="close"
    />
  </transition>
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 flex flex-col"
    >
      <div class="p-4 border-b flex justify-between items-center">
        <h4 class="font-semibold text-textblack200">Menu</h4>
        <CloseIcon @click="close" stroke="textblack300" />
      </div>

      <nav class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-2">
          <li v-for="item in NavPaths" :key="item.path">
            <RouterLink
              :to="item.path"
              class="block px-4 py-2 rounded-md text-textblack100 hover:bg-gray-100 transition-colors"
              :class="{ 'bg-gray-100 font-medium': isActive(item.path) }"
              @click="close"
            >
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import { NavPaths } from "@/constants/constant.ts";
import { computed } from "vue";
import { useRoute } from "vue-router";

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

const props = defineProps<{
  isOpen: boolean;
  navItems?: NavItem[];
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
  (e: "close"): void;
}>();

const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const close = () => {
  emit("update:isOpen", false);
  emit("close");
};
</script>

<style scoped>
/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>

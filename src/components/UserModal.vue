<template>
  <main class="w-full rounded-2xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Settings</h2>
      <CloseIcon
        fillColor="border300"
        class="flex justify-end cursor-pointer"
        @click="handleClose"
      />
    </div>

    <!-- Tabs -->
    <nav
      aria-label="Settings tabs"
      class="h-12 flex rounded-lg bg-gray-100 text-gray-600 text-sm font-medium mb-8 select-none"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex justify-center items-center flex-1 h-10 mt-1"
        :class="{
          'rounded-l-lg': tab.id === 'general',
          'rounded-r-lg': tab.id === 'about',
          'bg-white  text-accent200 shadow-sm rounded-lg font-semibold':
            activeTab === tab.id,
          'hover:bg-gray-50': activeTab !== tab.id,
        }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Profile Tab Content -->
    <form class="space-y-6" v-if="activeTab === 'profile'">
      <!-- Profile Photo -->
      <div class="space-y-2 relative cursor-pointer">
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          class="hidden"
          ref="fileInput"
        />

        <div
          class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative"
          :class="{
            'border-2 border-accent50 border-dashed': !userData.profileImage,
            'border opacity-60': userData.profileImage,
          }"
          @click="openFileInput"
          @dragover.prevent="dragOver = true"
          @dragleave="dragOver = false"
          @drop.prevent="handleDrop"
        >
          <!-- Drag overlay state -->
          <div
            v-if="dragOver"
            class="absolute inset-0 bg-accent50 bg-opacity-20 flex items-center justify-center border-2 border-accent50 border-dashed rounded-md"
          >
            <span class="text-accent50 font-medium">Drop image here</span>
          </div>

          <!-- Image preview -->
          <img
            v-if="userData.profileImage"
            :src="userData.profileImage"
            class="rounded-md w-full h-full object-cover"
          />

          <!-- Empty state -->
          <template v-else>
            <span class="text-textblack50">Drag & drop or click to upload</span>
            <EditIcon fillColor="textblack300" size="24" />
          </template>

          <!-- Edit overlay (shown when image exists) -->
          <div
            v-if="userData.profileImage"
            class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md"
          >
            <EditIcon fillColor="white" size="30" class="opacity-90" />
          </div>
        </div>
      </div>

      <!-- Name Field -->
      <div
        class="flex justify-between items-center border-b border-gray-200 pb-3"
      >
        <label class="text-gray-700 font-medium">Name</label>
        <div class="flex items-center space-x-2">
          <span class="font-semibold text-gray-800">{{ userData.name }}</span>
          <img
            alt="Google logo"
            class="inline-block h-5 w-5"
            src="https://storage.googleapis.com/a1aa/image/fe59ea75-ae7a-49bc-e829-92e804a25f27.jpg"
          />
        </div>
      </div>

      <!-- Email Field -->
      <div
        class="flex justify-between items-center border-b border-gray-200 pb-3"
      >
        <label class="text-gray-700 font-medium">Email </label>
        <span class="font-semibold text-gray-800">{{ maskedEmail }}</span>
      </div>

      <!-- Log Out -->
      <div
        class="flex justify-between items-center border-b border-gray-200 pb-6"
      >
        <p class="text-gray-700">Log out</p>
        <ReusableButton
          class="text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none transition-colors"
          type="button"
          @click="openLogoutModal"
          label="Log Out"
        />
      </div>
      <LogoutModal
        :isOpen="showLogoutModal"
        @close="closeLogoutModal"
        @confirm="handleLogout"
      />
      <!-- Delete Account -->
      <div class="flex justify-between items-center pt-2">
        <p class="text-gray-700">Delete account</p>
        <ReusableButton
          class="bg-red-50 text-red-600 border border-red-100 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 focus:outline-none transition-colors"
          type="button"
          @click="confirmDeleteAccount"
          label="Delete Account"
        />
      </div>
    </form>

    <section class="space-y-6" v-if="activeTab === 'general'">
      <div class="flex justify-between items-center">
        <span> Theme </span>
        <select
          v-model="selectedTheme"
          class="appearance-none bg-white text-gray-800 border border-gray-300 rounded-md shadow-sm py-1 px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option
            v-bind:key="theme.value"
            v-for="theme in themeItems"
            :value="theme.value"
            class="bg-white hover:bg-gray-100"
          >
            {{ theme.label }}
          </option>
        </select>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import LogoutModal from "@/components/LogoutModal.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import { useImageUpload } from "../composables/useImageUpload";
import { UserModal } from "../utils/userModal";
import {
  userData,
  maskedEmail,
  themeItems,
  tabs,
} from "../constants/userConstant";

const { openFileInput, handleDrop, handleImageUpload, dragOver } =
  useImageUpload();

const {
  selectedTheme,
  activeTab,
  showLogoutModal,
  openLogoutModal,
  closeLogoutModal,
  handleLogout,
  confirmDeleteAccount,
} = UserModal();

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4"
      @click.self="close"
    >
      <!-- Settings Modal -->
      <div
        aria-labelledby="settings-title"
        aria-modal="true"
        class="w-full max-w-md bg-[#2c2c38] rounded-2xl p-6 text-white font-sans"
        role="dialog"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold" id="settings-title">Settings</h2>
          <button
            aria-label="Close settings"
            class="text-gray-400 hover:text-gray-300 focus:outline-none"
            @click="emit('close')"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>

        <!-- Tabs -->
        <nav
          aria-label="Settings tabs"
          class="flex rounded-lg bg-[#4b4b5a] text-white text-sm font-normal mb-6 select-none"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1 py-2"
            :class="{
              'rounded-l-lg': tab.id === 'general',
              'rounded-r-lg': tab.id === 'about',
              'bg-[#6b6b7a] rounded-lg font-semibold cursor-default':
                activeTab === tab.id,
              'hover:bg-[#5a5a6a]': activeTab !== tab.id,
            }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- Profile Tab Content -->
        <form class="space-y-6 text-sm" v-if="activeTab === 'profile'">
          <!-- Name Field -->
          <div
            class="flex justify-between items-center border-b border-[#44444f] pb-2"
          >
            <label class="text-white" for="name">Name</label>
            <div class="flex items-center space-x-1">
              <span class="font-semibold">{{ user.name }}</span>
              <img
                alt="Google logo"
                class="inline-block h-5 w-5"
                src="https://storage.googleapis.com/a1aa/image/fe59ea75-ae7a-49bc-e829-92e804a25f27.jpg"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div
            class="flex justify-between items-center border-b border-[#44444f] pb-2"
          >
            <label class="text-white" for="email">Email address</label>
            <span class="font-semibold">{{ maskedEmail }}</span>
          </div>

          <!-- Phone Field -->
          <div
            class="flex justify-between items-center border-b border-[#44444f] pb-2"
          >
            <label class="text-white" for="phone">Phone number</label>
            <span class="font-semibold">{{ user.phone || "-" }}</span>
          </div>

          <!-- Toggle Setting -->
          <div class="border-b border-[#44444f] pb-4">
            <div class="flex justify-between items-center mb-1">
              <label class="font-semibold cursor-pointer" for="improve">
                Improve the model for everyone
              </label>
              <ToggleSwitch v-model="settings.improveModel" />
            </div>
            <p class="text-gray-500 text-xs leading-tight max-w-[18rem]">
              Allow your content to be used to train our models and improve our
              services. We secure your data privacy.
            </p>
          </div>

          <!-- Export Data -->
          <div class="border-b border-[#44444f] pb-4">
            <p class="font-semibold mb-1">Export data</p>
            <p class="text-gray-500 text-xs leading-tight mb-2 max-w-[18rem]">
              This data includes your account information and all chat history.
              Exporting may take some time. The download link will be valid for
              7 days.
            </p>
            <button
              class="text-white border border-gray-500 rounded-md px-4 py-1 text-sm hover:bg-gray-700 focus:outline-none"
              type="button"
              @click="exportData"
            >
              Export
            </button>
          </div>

          <!-- Log Out -->
          <div
            class="flex justify-between items-center border-b border-[#44444f] pb-4"
          >
            <p class="font-normal">Log out of all devices</p>
            <button
              class="text-white border border-gray-500 rounded-md px-4 py-1 text-sm hover:bg-gray-700 focus:outline-none"
              type="button"
              @click="logoutAllDevices"
            >
              Log out
            </button>
          </div>

          <!-- Delete Chats -->
          <div
            class="flex justify-between items-center border-b border-[#44444f] pb-4"
          >
            <p class="font-normal">Delete all chats</p>
            <button
              class="bg-red-600 rounded-md px-4 py-1 text-sm font-semibold hover:bg-red-700 focus:outline-none"
              type="button"
              @click="confirmDeleteChats"
            >
              Delete all
            </button>
          </div>

          <!-- Delete Account -->
          <div class="flex justify-between items-center">
            <p class="font-normal">Delete account</p>
            <button
              class="bg-red-600 rounded-md px-4 py-1 text-sm font-semibold hover:bg-red-700 focus:outline-none"
              type="button"
              @click="confirmDeleteAccount"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Emits
const emit = defineEmits(["close"]);

// Tabs
const tabs = [
  { id: "general", label: "General" },
  { id: "profile", label: "Profile" },
  { id: "about", label: "About" },
];
const activeTab = ref("profile");

// User Data
interface User {
  name: string;
  email: string;
  phone?: string;
}

const user = ref<User>({
  name: "Maverick",
  email: "sukimashoujo@gmail.com",
  phone: "",
});

const maskedEmail = computed(() => {
  const [username, domain] = user.value.email.split("@");
  return `${username.substring(0, 2)}****${username.slice(-1)}@${domain}`;
});

// Settings
interface Settings {
  improveModel: boolean;
}

const settings = ref<Settings>({
  improveModel: false,
});

// Methods
const exportData = () => {
  console.log("Exporting data...");
  // Implement export logic
};

const logoutAllDevices = () => {
  console.log("Logging out from all devices...");
  // Implement logout logic
};

const confirmDeleteChats = () => {
  if (confirm("Are you sure you want to delete all chats?")) {
    console.log("Deleting all chats...");
    // Implement delete logic
  }
};

const confirmDeleteAccount = () => {
  if (
    confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    )
  ) {
    console.log("Deleting account...");
    // Implement delete logic
  }
};
</script>

<style scoped>
/* Toggle Switch Styles */
input:checked ~ .toggle-bg {
  background-color: #71717a;
}
input:checked ~ .toggle-dot {
  transform: translateX(1.25rem);
  background-color: #d4d4d8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

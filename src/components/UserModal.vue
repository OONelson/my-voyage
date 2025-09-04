<template>
  <main class="w-full rounded-2xl z-50">
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

    <div v-if="loading" class="flex justify-center items-center">
      <Spinner />
    </div>
    <form class="space-y-6" v-else-if="activeTab === 'profile' && userData">
      <!-- Profile Photo -->
      <div class="space-y-2 relative">
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
          class="hidden"
          ref="fileInput"
        />

        <div class="relative flex justify-center items-center">
          <div
            v-if="!avatarUrl"
            class="avatar-placeholder"
            :style="{ backgroundColor: placeholderColor }"
            :aria-label="`Avatar for ${username}`"
            :size="30"
          >
            {{ abbreviation }}
          </div>
          <div
            class="absolute bottom-0 right-[30%] xs:right-[33%] sm:right-[35%] cursor-pointer"
            @click="openFileInput"
          >
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden"
              ref="fileInput"
            />
            <EditIcon @click="openFileInput" />
          </div>
        </div>

        <div
          v-if="avatarUrl"
          class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative"
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
            v-if="userData.profile_image"
            :src="profileImg"
            class="rounded-md w-full h-full object-cover"
          />

          <!-- Empty state -->
          <template v-else>
            <span class="text-textblack50">Drag & drop or click to upload</span>
            <EditIcon fillColor="textblack300" size="24" />
          </template>

          <!-- Edit overlay (shown when image exists) -->
          <div
            v-if="userData.profile_image"
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
          <span
            class="font-semibold text-gray-800 underline underline-offset-2"
            >{{ userData.name || "guest " }}</span
          >
        </div>
      </div>

      <!-- Email Field -->
      <div
        v-if="userData.email"
        class="flex justify-between items-center border-b border-gray-200 pb-3"
      >
        <label class="text-gray-700 font-medium">Email </label>
        <span
          class="font-semibold text-gray-800 underline underline-offset-2"
          >{{ maskedEmail }}</span
        >
      </div>

      <div
        class="flex justify-between items-center border-b border-gray-200 pb-3"
      >
        <label class="text-gray-700 font-medium">Account Status </label>
        <span
          @click="navigateToPricing"
          class="font-semibold text-gray-800 underline underline-offset-2"
          >{{ userData.is_premium ? "Premium" : "Basic" }}</span
        >
      </div>

      <div
        v-if="userData.created_at"
        class="flex justify-between items-center border-b border-gray-200 pb-3"
      >
        <label class="text-gray-700 font-medium">Member Since </label>
        <span v-if="joinedAgo" class="font-semibold text-gray-800">{{
          joinedAgo
        }}</span>
        <span
          v-else
          class="font-semibold text-gray-800"
          title="Join date not available"
          >—</span
        >
      </div>

      <!-- Log Out -->
      <div
        class="relative flex justify-between items-center border-b border-gray-200 pb-6"
      >
        <label class="text-gray-700">Log out</label>
        <div class="relative">
          <ReusableButton
            class="text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 focus:outline-none transition-colors"
            type="button"
            @click="openLogoutModal"
            label="Log Out"
          />
        </div>
      </div>
      <LogoutModal
        :isOpen="showLogoutModal"
        @close="closeLogoutModal"
        @confirm="confirmLogout"
      />
      <!-- Delete Account -->
      <div class="flex justify-between items-center pt-2">
        <label class="text-gray-700">Delete account</label>

        <ReusableButton
          class="bg-red-50 text-red-600 border border-red-100 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-100 focus:outline-none transition-colors"
          type="button"
          @click="openDeleteAccountModal"
          label="Delete Account"
        />
      </div>
      <DeleteAccountModal
        :isOpen="showDeleteAccountModal"
        @close="closeDeleteAccountModal"
        @confirm="confirmDeleteAccount(userData.id)"
      />
    </form>

    <div v-else>
      <span>{{ error }}</span>
    </div>

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
import { useRouter } from "vue-router";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import LogoutModal from "@/components/LogoutModal.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { useImageUpload } from "@/composables/useImageUpload";
import { useUserProfile } from "@/composables/useUserProfile";
import { useAvatarAbbreviation } from "@/composables/useAvatarAbbreviation";
import { UserModal } from "@/utils/userModal";
import { dateAndTime } from "@/utils/date-and-timeUtils";
import { themeItems, tabs } from "@/constants/userConstant";
import { computed } from "vue";
import DeleteAccountModal from "./DeleteAccountModal.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";

const { joinedAgo } = dateAndTime();
const { openFileInput, handleDrop, handleImageUpload, dragOver } =
  useImageUpload();

const {
  selectedTheme,
  activeTab,
  showLogoutModal,
  showDeleteAccountModal,
  openLogoutModal,
  closeLogoutModal,
  openDeleteAccountModal,
  closeDeleteAccountModal,
  confirmLogout,
  confirmDeleteAccount,
} = UserModal();

const { maskedEmail, userData, loading, error } = useUserProfile();

const router = useRouter();

const navigateToPricing = () => {
  router.push("/pricing");
};

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

const profileImg = computed(() => {
  return userData.value.profile_image;
});

interface Props {
  avatarUrl?: string | null;
  username: string | null;
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  username: null,
  size: 100,
});

const { abbreviation } = useAvatarAbbreviation(props.username);

const placeholderColor = computed(() => {
  if (!props.username) return "#cccccc";

  let hash = 0;
  for (let i = 0; i < props.username.length; i++) {
    hash = props.username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
});
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

.avatar-placeholder,
.avatar-image {
  width: v-bind('props.size + "px"');
  height: v-bind('props.size + "px"');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.5);
}

.avatar-image {
  object-fit: cover;
}
</style>

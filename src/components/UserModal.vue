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

    <div v-else-if="activeTab === 'profile' && userData" class="space-y-6">
      <!-- Profile Photo Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">Profile Photo</h3>
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
              v-if="!userData.profile_image"
              class="avatar-placeholder"
              :style="{ backgroundColor: placeholderColor }"
              :aria-label="`Avatar for ${userData.name}`"
              :size="30"
            >
              {{ abbreviation }}
            </div>
            <div
              class="absolute bottom-0 right-[30%] xs:right-[33%] sm:right-[35%] cursor-pointer"
              @click="openFileInput"
            >
              <EditIcon @click="openFileInput" />
            </div>
          </div>

          <div
            v-if="userData.profile_image"
            class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative cursor-pointer"
            @click="openFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <!-- Drag overlay state -->
            <div
              v-if="dragOver"
              class="absolute inset-0 bg-accent50 bg-opacity-20 flex items-center justify-center border-2 border-accent50 border-dashed rounded-md"
            >
              <span class="text-accent50 font-medium">Drop image here</span>
            </div>

            <!-- Loading state -->
            <div
              v-if="isImgLoading"
              class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md"
            >
              <Spinner />
            </div>

            <!-- Image preview -->
            <img
              v-if="userData.profile_image && !isImgLoading"
              :src="userData.profile_image"
              class="rounded-md w-full h-full object-cover"
            />

            <!-- Edit overlay (shown when image exists and not loading) -->
            <div
              v-if="userData.profile_image && !isImgLoading"
              class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md"
            >
              <EditIcon fillColor="white" size="30" class="opacity-90" />
            </div>
          </div>

          <!-- Empty state with drag and drop -->
          <div
            v-if="!userData.profile_image"
            class="h-48 bg-gray-100 rounded-md flex items-center justify-center gap-2 relative cursor-pointer border-2 border-dashed border-gray-300 hover:border-accent200 transition-colors"
            @click="openFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave="handleDragLeave"
            @drop.prevent="handleDrop"
            :class="{
              'border-accent200 bg-accent50 bg-opacity-10': dragOver,
              'cursor-not-allowed opacity-50': isImgLoading,
            }"
          >
            <!-- Loading state -->
            <div
              v-if="isImgLoading"
              class="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-md"
            >
              <Spinner />
            </div>

            <!-- Drag overlay -->
            <div
              v-else-if="dragOver"
              class="absolute inset-0 flex items-center justify-center"
            >
              <span class="text-accent200 font-medium">Drop image here</span>
            </div>

            <!-- Default state -->
            <div v-else class="text-center">
              <EditIcon size="40" class="mx-auto mb-2 text-gray-400" />
              <p class="text-sm text-gray-500">
                Click to upload or drag and drop
              </p>
              <p class="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB</p>
            </div>
          </div>

          <!-- Image Actions -->
          <div v-if="userData.profile_image" class="flex justify-center gap-2">
            <ReusableButton
              class="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
              @click="openFileInput"
              :disabled="isImgLoading"
              label="Change Photo"
            />
            <ReusableButton
              class="text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100"
              @click="handleDeleteImage"
              :disabled="isImgLoading"
              label="Remove Photo"
            />
          </div>
        </div>
      </div>

      <!-- User Information Section -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">
            Personal Information
          </h3>
          <div class="flex gap-2">
            <ReusableButton
              v-if="!isEditingProfile"
              class="text-sm px-4 py-2 bg-accent200 text-white hover:bg-accent300"
              @click="startEditingProfile"
              label="Edit Profile"
            />
            <template v-else>
              <ReusableButton
                class="text-sm px-4 py-2 bg-green-600 text-white hover:bg-green-700"
                @click="saveProfileChanges"
                :disabled="isUpdating"
                label="Save"
              />
              <ReusableButton
                class="text-sm px-4 py-2 bg-gray-500 text-white hover:bg-gray-600"
                @click="cancelEditingProfile"
                label="Cancel"
              />
            </template>
          </div>
        </div>

        <!-- Name Field -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Name</label>
          <div
            v-if="!isEditingProfile"
            class="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <span class="font-semibold text-gray-800">{{
              userData.name || "Guest"
            }}</span>
          </div>
          <div v-else class="space-y-1">
            <ReusableInput
              v-model="editForm.name"
              placeholder="Enter your name"
              class="w-full"
            />
            <p v-if="editFormErrors.name" class="text-sm text-red-600">
              {{ editFormErrors.name }}
            </p>
          </div>
        </div>

        <!-- Email Field -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <div
            v-if="!isEditingProfile"
            class="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <span class="font-semibold text-gray-800">{{ maskedEmail }}</span>
            <div class="flex items-center gap-2">
              <span
                v-if="isEmailConfirmed"
                class="text-xs text-green-600 font-medium"
                >✓ Verified</span
              >
              <span v-else class="text-xs text-orange-600 font-medium"
                >⚠ Unverified</span
              >
            </div>
          </div>
          <div v-else class="space-y-1">
            <ReusableInput
              v-model="editForm.email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
            />
            <p v-if="editFormErrors.email" class="text-sm text-red-600">
              {{ editFormErrors.email }}
            </p>
            <div v-if="!isEmailConfirmed" class="flex items-center gap-2">
              <ReusableButton
                class="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
                @click="resendEmailConfirmation"
                :disabled="isUpdating"
                label="Resend Verification"
              />
            </div>
          </div>
        </div>

        <!-- Account Status -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700"
            >Account Status</label
          >
          <div
            class="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <span
              @click="navigateToPricing"
              class="font-semibold text-gray-800 underline underline-offset-2 cursor-pointer hover:text-accent200"
            >
              {{ userData.is_premium ? "Premium" : "Basic" }}
            </span>
            <span class="text-xs text-gray-500">Click to upgrade</span>
          </div>
        </div>

        <!-- Member Since -->
        <div v-if="userData.created_at" class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Member Since</label>
          <div
            class="flex justify-between items-center border-b border-gray-200 pb-2"
          >
            <span class="font-semibold text-gray-800">{{
              joinedAgo || "—"
            }}</span>
          </div>
        </div>
      </div>

      <!-- Account Actions Section -->
      <div class="space-y-4 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Account Actions</h3>

        <!-- Log Out -->
        <div class="flex justify-between items-center">
          <div>
            <label class="text-sm font-medium text-gray-700">Log out</label>
            <p class="text-xs text-gray-500">Sign out of your account</p>
          </div>
          <ReusableButton
            class="text-sm px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            @click="openLogoutModal"
            label="Log Out"
          />
        </div>

        <!-- Delete Account -->
        <div class="flex justify-between items-center">
          <div>
            <label class="text-sm font-medium text-gray-700"
              >Delete account</label
            >
            <p class="text-xs text-red-500">This action cannot be undone</p>
          </div>
          <ReusableButton
            class="text-sm px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100"
            @click="openDeleteAccountModal"
            label="Delete Account"
          />
        </div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
        <ReusableButton
          class="mt-2 text-xs px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200"
          @click="clearError"
          label="Dismiss"
        />
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="p-4 bg-green-50 border border-green-200 rounded-lg"
      >
        <p class="text-sm text-green-600">{{ successMessage }}</p>
        <ReusableButton
          class="mt-2 text-xs px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200"
          @click="successMessage = ''"
          label="Dismiss"
        />
      </div>
    </div>

    <!-- General Tab Content -->
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

    <!-- About Tab Content -->
    <section class="space-y-6" v-if="activeTab === 'about'">
      <div class="text-center space-y-4">
        <h3 class="text-lg font-semibold text-gray-800">About My Voyage</h3>
        <p class="text-gray-600">Version 1.0.0</p>
        <p class="text-sm text-gray-500">
          A travel companion app for documenting your journeys
        </p>
      </div>
    </section>

    <!-- Modals -->
    <LogoutModal
      :isOpen="showLogoutModal"
      @close="closeLogoutModal"
      @confirm="confirmLogout"
    />
    <DeleteAccountModal
      :isOpen="showDeleteAccountModal"
      @close="closeDeleteAccountModal"
      @confirm="confirmDeleteAccount(userData?.id)"
    />
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import LogoutModal from "@/components/LogoutModal.vue";
import ReusableButton from "@/components/ui/ReusableButton.vue";
import ReusableInput from "@/components/ui/ReusableInput.vue";
import Spinner from "@/components/ui/Spinner.vue";
import { useUserProfile } from "@/composables/useUserProfile";
import { useAvatarAbbreviation } from "@/composables/useAvatarAbbreviation";
import { UserModal } from "@/utils/userModal";
import { dateAndTime } from "@/utils/date-and-timeUtils";
import { themeItems, tabs } from "@/constants/userConstant";
import DeleteAccountModal from "./DeleteAccountModal.vue";
import EditIcon from "@/assets/icons/EditIcon.vue";

const { joinedAgo } = dateAndTime();

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
  isEditingProfile,
  editForm,
  editFormErrors,
  startEditingProfile,
  cancelEditingProfile,
  saveProfileChanges,
  successMessage,
  // Profile image handling
  dragOver,
  fileInput,
  isImgLoading,
  openFileInput,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleImageUpload,
  handleDeleteImage,
  resendEmailConfirmation,
} = UserModal();

const {
  maskedEmail,
  userData,
  loading,
  error,
  isUpdating,
  isEmailConfirmed,
  clearError,
} = useUserProfile();

const router = useRouter();

const navigateToPricing = () => {
  router.push("/pricing");
};

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

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

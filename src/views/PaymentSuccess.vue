<template>
    <div class="min-h-screen transition-colors duration-300"
         :class="isDarkMode ? 'dark bg-dark-background100' : 'bg-background100'">
      
      <!-- Header -->
      <header class="border-b transition-colors duration-300"
              :class="isDarkMode ? 'border-dark-border100' : 'border-border100'">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full" :class="isDarkMode ? 'bg-dark-accent100' : 'bg-accent100'"></div>
              <span class="text-lg font-semibold transition-colors duration-300"
                    :class="isDarkMode ? 'text-dark-textblack200' : 'text-textblack200'">
                YourBrand
              </span>
            </div>
            
            <!-- Theme Toggle -->
            <button @click="toggleTheme" 
                    class="p-2 rounded-lg transition-colors duration-300 hover:bg-opacity-80"
                    :class="isDarkMode ? 'bg-dark-inputColor100 text-dark-text' : 'bg-inputColor100 text-text'">
              <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="container mx-auto px-4 py-12">
        <div class="max-w-2xl mx-auto">
          
          <!-- Success Card -->
          <div class="rounded-2xl p-8 transition-all duration-300 transform hover:scale-[1.02]"
               :class="isDarkMode 
                 ? 'bg-dark-background200 border-dark-border200' 
                 : 'bg-background200 border-border200 border'">
            
            <!-- Success Icon -->
            <div class="flex justify-center mb-6">
              <div class="w-20 h-20 rounded-full flex items-center justify-center"
                   :class="isDarkMode ? 'bg-dark-accent300' : 'bg-accent300'">
                <svg class="w-10 h-10" :class="isDarkMode ? 'text-dark-textblack300' : 'text-background100'" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
  
            <!-- Success Message -->
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold mb-4 transition-colors duration-300"
                  :class="isDarkMode ? 'text-dark-textblack200' : 'text-textblack200'">
                Payment Successful!
              </h1>
              <p class="text-lg transition-colors duration-300"
                 :class="isDarkMode ? 'text-dark-text' : 'text-text'">
                Thank you for subscribing to our premium plan. Your payment has been processed successfully.
              </p>
            </div>
  
            <!-- Order Details -->
            <div class="bg-opacity-50 rounded-xl p-6 mb-8 transition-colors duration-300"
                 :class="isDarkMode 
                   ? 'bg-dark-inputColor100 border-dark-border100' 
                   : 'bg-inputColor100 border-border100 border'">
              <h3 class="text-lg font-semibold mb-4 transition-colors duration-300"
                  :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">
                Order Details
              </h3>
              
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-text' : 'text-text'">Plan:</span>
                  <span class="font-medium transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">Premium Annual</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-text' : 'text-text'">Amount Paid:</span>
                  <span class="font-medium transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">$99.00</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-text' : 'text-text'">Order ID:</span>
                  <span class="font-medium transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">#{{ orderId }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-text' : 'text-text'">Next Billing Date:</span>
                  <span class="font-medium transition-colors duration-300"
                        :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">{{ nextBillingDate }}</span>
                </div>
              </div>
            </div>
  
            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button @click="goToDashboard" 
                      class="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                      :class="isDarkMode 
                        ? 'bg-dark-accent100 text-dark-textblack300 hover:bg-dark-accent200' 
                        : 'bg-accent100 text-white hover:bg-accent200'">
                Go to Dashboard
              </button>
              
              <button @click="downloadInvoice" 
                      class="px-8 py-3 rounded-lg font-semibold border transition-all duration-300 hover:shadow-lg"
                      :class="isDarkMode 
                        ? 'border-dark-border200 text-dark-text hover:bg-dark-inputColor100' 
                        : 'border-border200 text-textblack100 hover:bg-inputColor100'">
                Download Invoice
              </button>
            </div>
  
            <!-- Additional Info -->
            <div class="mt-8 text-center">
              <p class="text-sm transition-colors duration-300"
                 :class="isDarkMode ? 'text-dark-textblack50' : 'text-textblack50'">
                Need help? <a href="#" class="underline transition-colors duration-300 hover:text-highlight"
                            :class="isDarkMode ? 'text-dark-accent200' : 'text-accent200'">Contact our support team</a>
              </p>
            </div>
          </div>
  
          <!-- Features Grid -->
          <div class="mt-12 grid md:grid-cols-3 gap-6">
            <div v-for="feature in features" :key="feature.title"
                 class="text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105"
                 :class="isDarkMode 
                   ? 'bg-dark-background200 border-dark-border100' 
                   : 'bg-background200 border-border100 border'">
              <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                   :class="isDarkMode ? 'bg-dark-accent50' : 'bg-accent50'">
                <component :is="feature.icon" class="w-6 h-6"
                          :class="isDarkMode ? 'text-dark-textblack300' : 'text-white'" />
              </div>
              <h3 class="font-semibold mb-2 transition-colors duration-300"
                  :class="isDarkMode ? 'text-dark-textblack100' : 'text-textblack100'">
                {{ feature.title }}
              </h3>
              <p class="text-sm transition-colors duration-300"
                 :class="isDarkMode ? 'text-dark-text' : 'text-text'">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  // Icons components
  const FeatureIcons = {
    support: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      `
    },
    updates: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      `
    },
    storage: {
      template: `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
        </svg>
      `
    }
  }
  
  // Reactive data
  const isDarkMode = ref(false)
  const orderId = ref('')
  const nextBillingDate = ref('')
  
  const features = [
    {
      title: 'Priority Support',
      description: 'Get help faster with our dedicated support team',
      icon: FeatureIcons.support
    },
    {
      title: 'Regular Updates',
      description: 'Access to the latest features and improvements',
      icon: FeatureIcons.updates
    },
    {
      title: 'Enhanced Storage',
      description: 'More space for your projects and files',
      icon: FeatureIcons.storage
    }
  ]
  
  const router = useRouter()
  
  // Generate random order ID and set next billing date
  const generateOrderId = (): string => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }
  
  const getNextBillingDate = (): string => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  // Methods
  const toggleTheme = (): void => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  const goToDashboard = (): void => {
    // In a real app, this would navigate to the dashboard
    alert('Navigating to dashboard...')
    router.push('/dashboard')
  }
  
  const downloadInvoice = (): void => {
    // In a real app, this would download the invoice
    alert('Downloading invoice...')
  }
  
  // Lifecycle
  onMounted(() => {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    isDarkMode.value = savedTheme ? JSON.parse(savedTheme) : prefersDark
    
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    }
  
    // Generate order details
    orderId.value = generateOrderId()
    nextBillingDate.value = getNextBillingDate()
  })
  </script>
  
  <style scoped>
  /* Smooth transitions for all interactive elements */
  button, a {
    transition: all 0.3s ease;
  }
  
  /* Custom hover effects */
  .hover-scale {
    transition: transform 0.3s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  </style>
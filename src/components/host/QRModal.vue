<template>
  <BaseModal title="掃描加入場次" @close="$emit('close')">
    <div class="qr-container">
      <img :src="qrCodeUrl" alt="QR Code" class="qr-image" />
      <p class="mt-4 text-center font-semibold text-gray-500">{{ roomId }}</p>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue'
import BaseModal from '../base/BaseModal.vue'

const props = defineProps({
  roomId: String,
  joinUrl: String
})
defineEmits(['close'])

const qrCodeUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(props.joinUrl)}`)
</script>

<style scoped>
.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.qr-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}
</style>

<template>
  <LoadingAnimation v-model="isLoading" />
  <router-view />
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const isLoading = ref(true);
    
    return {
      isLoading
    };
  }
}
</script>

<style>
@import './assets/style.css';
</style>
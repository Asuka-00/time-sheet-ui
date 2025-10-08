<template>
  <q-inner-loading 
    :showing="loadingStore.isLoading"
    color="primary"
    size="50px"
    class="global-loading"
  >
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>

<script setup lang="ts">
import { useLoadingStore } from 'src/stores/loading';

const loadingStore = useLoadingStore();
</script>

<style scoped>
.global-loading {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

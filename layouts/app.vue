<script setup lang="ts">
const drawerIsOpened = ref(null)
</script>

<template>
  <div class="bg-grey-lighten-5">
    <CommonsNavDrawer v-model="drawerIsOpened" />
    <CommonsAppHeader v-model="drawerIsOpened" show-toggle-drawer />

    <v-main>
      <div class="pa-6">
        <slot />
      </div>
    </v-main>

    <CommonsAppFooter />

    <DialogsAuthDialog />
    <ToastMessage />
  </div>
</template>

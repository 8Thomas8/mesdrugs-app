<script setup lang="ts">
const drawerIsOpened = defineModel<boolean>({ default: false })
</script>

<template>
  <v-navigation-drawer v-model="drawerIsOpened">
    <v-list>
      <v-list-item title="Services" />
    </v-list>
    <v-divider />
    <v-list color="transparent">
      <v-list-item prepend-icon="mdi-pill-multiple" title="Médicaments" />
    </v-list>
  </v-navigation-drawer>
</template>

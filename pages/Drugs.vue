<script setup lang="ts">
import { ItemPerPage } from '~/type/constants'
import AddDrugDialog from '~/components/dialogs/AddDrugDialog.vue'

definePageMeta({ layout: 'app' })

const addDrugDialogIsOpened = defineModel({ default: false, type: Boolean })

const updateAddDrugDialogIsOpened = (value: boolean) => {
  addDrugDialogIsOpened.value = value
}
</script>

<template>
  <div>
    <h1 class="pb-4">Gestion du stock de médicaments</h1>
    <v-card class="pa-4">
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn prepend-icon="mdi-plus" @click="addDrugDialogIsOpened = true">Ajouter</v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table :items-per-page="ItemPerPage" />
        </v-col>
      </v-row>
    </v-card>

    <AddDrugDialog
      v-model="addDrugDialogIsOpened"
      @update:add-drug-dialog-is-opened="updateAddDrugDialogIsOpened"
    />
  </div>
</template>

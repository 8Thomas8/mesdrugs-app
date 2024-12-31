<script setup lang="ts">
import { useFormValidation } from '~/composables/formValidation'
import { useDrugBrandStore } from '~/store/drugBrand'
import { useDrugNameStore } from '~/store/drugName'
import { DrugForm, DrugFormTranslations, DrugUnit } from '~/type/constants'
import { useUserDrugStore } from '~/store/userDrug'
import { plainToInstance } from 'class-transformer'
import UserDrug from '~/type/dto/UserDrug'
import { capitalize } from 'vue'

defineModel('addDrugDialogIsOpened', {
  type: Boolean,
  default: false,
})

const emits = defineEmits(['update:addDrugDialogIsOpened'])

const { required, isFloat, isDate } = useFormValidation()
const drugBrandStore = useDrugBrandStore()
const drugNameStore = useDrugNameStore()
const userDrugStore = useUserDrugStore()

const drugBrandIsLoading = ref(false)
const drugNameIsLoading = ref(false)
const userDrugIsLoading = ref(false)
const formIsValid = ref(false)
const addDrugForm = ref<HTMLFormElement | null>(null)
const searchDrugBrandInput = ref<string | null>(null)
const searchDrugNameInput = ref<string | null>(null)

const form = ref<{
  drugBrandId: number | null
  drugNameId: number | null
  form: DrugForm | null
  dose: string | null
  note: string | null
  unit: DrugUnit | null
  expirationDateTime: string | null
}>({
  drugBrandId: null,
  drugNameId: null,
  form: null,
  dose: null,
  note: null,
  unit: null,
  expirationDateTime: null,
})

const onSubmit = async () => {
  if (!formIsValid.value) return

  userDrugIsLoading.value = true

  await userDrugStore.create(plainToInstance(UserDrug, form.value))
  await userDrugStore.fetchAll()

  userDrugIsLoading.value = false
}

const resetForm = () => {
  form.value = {
    drugBrandId: null,
    drugNameId: null,
    form: null,
    dose: null,
    note: null,
    unit: null,
    expirationDateTime: null,
  }
  addDrugForm.value?.resetValidation()
}

const drugFormItems = Object.entries(DrugForm).map(([_, value]) => ({
  label: DrugFormTranslations[value],
  value,
}))

watch(
  () => form.value.drugBrandId,
  () => {
    form.value.drugNameId = null
    searchDrugNameInput.value = null
  },
)

const closeDialog = () => {
  emits('update:addDrugDialogIsOpened', false)
  resetForm()
}

const onFocusBrandField = async () => {
  drugBrandIsLoading.value = true
  await drugBrandStore.fetchAll()
  drugBrandIsLoading.value = false
}

const onFocusNameField = async () => {
  drugNameIsLoading.value = true
  await drugNameStore.fetchAll(form.value.drugBrandId)
  drugNameIsLoading.value = false
}

const createDrugBrand = async (name: string) => {
  drugBrandIsLoading.value = true
  await drugBrandStore.create(capitalize(name))
  drugBrandIsLoading.value = false
}

const createDrugName = async (name: string) => {
  drugNameIsLoading.value = true
  await drugNameStore.create(capitalize(name), form.value.drugBrandId)
  await drugNameStore.fetchAll(form.value.drugBrandId)
  drugNameIsLoading.value = false
}

const replaceNonFloatCharacters = (value: string) => {
  return value.replace(/[^\d.]/g, '')
}
</script>

<template>
  <v-dialog :value="addDrugDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Ajout d'un médicament
        <v-btn color="grey" variant="text" @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-form ref="addDrugForm" v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          {{ form }}
          <v-row>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.drugBrandId"
                v-model:search="searchDrugBrandInput"
                :hide-no-data="!searchDrugBrandInput"
                :loading="drugBrandIsLoading"
                label="Marque *"
                :rules="[required]"
                :items="drugBrandStore.drugBrands"
                item-title="name"
                item-value="id"
                @focus="onFocusBrandField"
              >
                <template #no-data>
                  <v-list-item
                    prepend-icon="mdi-plus"
                    @click="createDrugBrand(searchDrugBrandInput)"
                  >
                    Créer la marque: {{ searchDrugBrandInput }}
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                v-model="form.drugNameId"
                v-model:search="searchDrugNameInput"
                :hide-no-data="!searchDrugNameInput"
                :disabled="!form.drugBrandId"
                :loading="drugNameIsLoading"
                label="Nom *"
                :rules="[required]"
                :items="drugNameStore.drugNames"
                item-title="name"
                item-value="id"
                @focus="onFocusNameField"
              >
                <template #no-data>
                  <v-list-item prepend-icon="mdi-plus" @click="createDrugName(searchDrugNameInput)">
                    Créer le nom: {{ searchDrugNameInput }}
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" lg="5">
              <v-select
                v-model="form.form"
                :items="drugFormItems"
                :rules="[required]"
                label="Forme *"
                item-title="label"
                item-value="value"
              />
            </v-col>
            <v-col cols="6" lg="4">
              <v-text-field
                v-model="form.dose"
                :rules="[required, isFloat]"
                label="Dose *"
                hint="Exemple: 1.5 ou 2"
                persistent-hint
                @input="form.dose = replaceNonFloatCharacters(form.dose)"
              />
            </v-col>
            <v-col cols="6" lg="3">
              <v-select
                v-model="form.unit"
                :items="Object.values(DrugUnit)"
                :rules="[required]"
                label="Unité *"
                item-title="label"
                item-value="value"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <!--  Formater ce field pendant le remplissage-->
              <v-text-field
                v-model="form.expirationDateTime"
                :rules="[required, isDate]"
                label="Date d'expiration *"
                hint="Exemple: 31/12/2022"
                persistent-hint
                maxlength="10"
                @input="form.expirationDateTime = formatDateInput(form.expirationDateTime)"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.note" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn type="submit" :loading="userDrugIsLoading"> Ajouter </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

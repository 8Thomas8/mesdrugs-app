<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthStore } from '~/store/auth'
import { useFormValidation } from '~/composables/formValidation'

const { authDialogIsOpened, toggleAuthDialog } = useAuth()
const { required, email, password } = useFormValidation()
const authStore = useAuthStore()
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: '',
})

const formIsValid = ref(false)

watch(authDialogIsOpened, (isOpened: boolean) => {
  if (!isOpened) {
    resetForm()
  }
})

const onSubmit = async () => {
  if (!formIsValid.value) return

  const { email, password } = loginForm.value
  isLoading.value = true
  await authStore.login(email, password)
  isLoading.value = false
}

const resetForm = () => {
  loginForm.value.email = ''
  loginForm.value.password = ''
}
</script>

<template>
  <v-dialog v-model="authDialogIsOpened" max-width="600px">
    <v-card>
      <v-card-title>Connexion</v-card-title>
      <v-form v-model="formIsValid" @submit.prevent="onSubmit">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model.trim="loginForm.email"
                placeholder="Email *"
                type="email"
                :rules="[required, email]"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="loginForm.password"
                placeholder="Mot de passe *"
                type="password"
                :rules="[required, password]"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="toggleAuthDialog(false)">Annuler</v-btn>
          <v-btn type="submit" :loading="isLoading">Connexion</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

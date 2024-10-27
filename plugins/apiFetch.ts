import { HttpError } from '~/type/constants'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.provide('apiFetch', async (request: string, options = {}) => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    try {
      return await $fetch(`${config.public.apiBase}${request}`, options)
    } catch (error: never) {
      if (error?.statusCode) {
        console.error(`Erreur lors de l'appel à ${request}: ${error.statusMessage}`)
        if (error.statusCode === HttpError.Forbidden) {
          await authStore.logout()
        }
      } else {
        console.error('Erreur réseau ou autre:', error)
      }

      throw createError({
        statusCode: error?.statusCode || 500,
        statusMessage: error?.statusMessage || 'Une erreur inconnue est survenue',
      })
    }
  })
})
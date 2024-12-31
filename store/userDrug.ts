import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import type UserDrug from '~/type/dto/UserDrug'

export const useUserDrugStore = defineStore('userDrugStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const userDrugs = ref<UserDrug[]>([])

  // Actions
  const fetchAll = async () => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/api/v1/user-drug', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
      })

      userDrugs.value = res.map((userDrug: unknown) => plainToInstance(UserDrug, userDrug))
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer vos médicaments')
    }
  }

  const create = async (userDrug: UserDrug) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/api/v1/user-drug', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: userDrug,
      })
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de créer votre médicament')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/api/v1/user-drug/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Suppression impossible')
    }
  }

  return {
    userDrugs,
    fetchAll,
    create,
    deleteOne,
  }
})

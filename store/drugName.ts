import { ToastMessageType } from '~/type/constants'
import { useAuthStore } from '~/store/auth'
import { useToastMessage } from '~/composables/useToastMessage'
import { plainToInstance } from 'class-transformer'
import DrugName from '~/type/dto/DrugName'

export const useDrugNameStore = defineStore('drugNameStore', () => {
  const { setToastMessage } = useToastMessage()
  const authStore = useAuthStore()
  const { $apiFetch } = useNuxtApp()

  // State
  const drugNames = ref<DrugName[]>([])

  // Actions
  const fetchAll = async (drugBrandId: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      const res = await $apiFetch('/api/v1/drug-name', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'GET',
        params: { drugBrandId },
      })

      drugNames.value = res.map((drugName: unknown) => plainToInstance(DrugName, drugName))
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Impossible de récupérer les noms de médicaments')
    }
  }

  const create = async (name: string, drugBrandId: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch('/api/v1/drug-name', {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'POST',
        body: { name, drugBrandId },
      })
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Création du nom de médicament impossible')
    }
  }

  const deleteOne = async (id: number) => {
    authStore.getToken()

    if (!authStore.token) return

    try {
      await $apiFetch(`/api/v1/drug-name/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
        method: 'DELETE',
      })
    } catch (e) {
      setToastMessage(ToastMessageType.TypeError, 'Suppression du nom de médicament impossible')
    }
  }

  return {
    drugNames,
    fetchAll,
    create,
    deleteOne,
  }
})

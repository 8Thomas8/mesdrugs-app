import { Expose, Transform } from 'class-transformer'
import type DrugName from '~/type/dto/DrugName'
import type { DrugForm, DrugUnit } from '~/type/constants'
import type DrugBrand from '~/type/dto/DrugBrand'

export default class UserDrug {
  @Expose()
  id!: number

  @Expose()
  drugBrand!: DrugBrand

  @Expose()
  drugName!: DrugName

  @Expose()
  form!: DrugForm

  @Expose()
  dose!: number

  @Expose()
  note!: string | null

  @Expose()
  unit!: DrugUnit

  @Expose()
  expirationDateTime!: Date

  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}

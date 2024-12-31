import { Expose, Transform } from 'class-transformer'
import type DrugBrand from '~/type/dto/DrugBrand'

export default class DrugName {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  drugBrand!: DrugBrand

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}

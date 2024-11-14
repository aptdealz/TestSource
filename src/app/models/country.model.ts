export type CountryResponse = Country[]

export interface Country {
  countryId: number
  name: string
  iso: string
  phoneCode: number
}

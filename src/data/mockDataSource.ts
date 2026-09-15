import type { EpidemiologyDataSource } from '../types/epidemiology'
import { municipalities } from './coverage'
// Only the documented synthetic fixture has records. Other filters are empty,
// never extrapolated or silently converted into zero cases.
export const mockDataSource: EpidemiologyDataSource = {
  async listDiseases() { return ['DENG'] },
  async getMunicipalityCases(filters) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return { ...filters, items: filters.disease === 'DENG' && filters.year === 2026 && filters.month === 1
      ? municipalities.map(item => ({ ...item, cdUf: '33', nmUf: 'Rio de Janeiro' })) : [] }
  },
}

import { mockDataSource } from './mockDataSource'
export const isDemo = import.meta.env.VITE_USE_MOCKS !== 'false'
export const dataSource = mockDataSource

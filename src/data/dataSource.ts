import { mockDataSource } from "./mockDataSource";
import { apiDataSource } from "./apiDataSource";
export const isDemo = import.meta.env.VITE_USE_MOCKS !== "false";
export const dataSource = isDemo ? mockDataSource : apiDataSource;

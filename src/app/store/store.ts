import { baseApi } from '@/shared/api';
import { configureStore } from '@reduxjs/toolkit';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

declare global {
  type AppStore = ReturnType<typeof makeStore>;
  type RootState = ReturnType<AppStore['getState']>;
  type AppDispatch = AppStore['dispatch'];
}

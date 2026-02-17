import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
  return configureStore({
    reducer: {},
  });
};

declare global {
  type AppStore = ReturnType<typeof makeStore>;
  type RootState = ReturnType<AppStore["getState"]>;
  type AppDispatch = AppStore["dispatch"];
}

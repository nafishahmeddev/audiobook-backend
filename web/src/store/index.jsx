
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import AuthReducer from './slices/auth';
import AppReducer from './slices/app';
import ObjectDialog from './slices/objectDialog';
import customizationReducer from './customizationReducer';
import ChapterQueueReduces from "./slices/chapters-queue";
import * as rp from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
}
const reducers = persistReducer(persistConfig, combineReducers({
  auth: AuthReducer,
  app: AppReducer,
  objectDialog: ObjectDialog,
  customization: customizationReducer,
  chapterQueue: ChapterQueueReduces
}))

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          rp.FLUSH,
          rp.REHYDRATE,
          rp.PAUSE,
          rp.PERSIST,
          rp.PURGE,
          rp.REGISTER
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});


export const persistor = persistStore(store);
export default store;
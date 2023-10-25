import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './slices/auth';
import AppReducer from './slices/app';
import ObjectDialog from './slices/objectDialog';
import PreloaderReducer from './slices/preloader';

export default configureStore({
  reducer: {
    auth: AuthReducer,
    app: AppReducer,
    objectDialog: ObjectDialog,
    preloader: PreloaderReducer
  },
  devTools: import.meta.env.DEV,
})
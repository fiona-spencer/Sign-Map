import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This is for localStorage

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  version: 1, // Version number (helps when changing structure of persisted state)
  blacklist: [], // You can blacklist reducers from being persisted
  whitelist: ['user', 'theme'], // Optionally whitelist reducers to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions for serializable check
      },
    }), // Optionally add a logger for debugging (can be removed in production)
});

export const persistor = persistStore(store);

export { store };

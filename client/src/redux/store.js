import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';
import globalReducer from './global/globalSlice'; // Import your global slice
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // This is for localStorage

// Combine all reducers including the globalReducer
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  global: globalReducer, // Add global reducer here
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  version: 1, // Version number (helps when changing structure of persisted state)
  blacklist: [], // You can blacklist reducers from being persisted
  whitelist: ['user', 'theme', 'global'], // Whitelist global to persist it as well
};

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions for serializable check
      },
    }),
});

// Create the persistor to manage persistence
export const persistor = persistStore(store);

// Export the store
export { store };

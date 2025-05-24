

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // other environment variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly VITE_GEOCODING_API_KEY: string;
    readonly VITE_SERVICE_CENTER_LAT: string;
    readonly VITE_SERVICE_CENTER_LNG: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
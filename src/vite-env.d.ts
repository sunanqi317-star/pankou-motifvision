/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUD_SD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID?: string;
}

interface Window {
  dataLayer: Record<string, unknown>[];
}

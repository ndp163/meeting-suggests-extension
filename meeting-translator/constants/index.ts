export interface Transcript {
  origin: string;
  translated: string;
  avatar: string;
  name: string;
  suggest?: string;
}

export const STORAGE_KEY = "meetings";

export enum LANG_CODE {
  ENGLISH = "en-US",
  VIETNAMESE =" vi-VN",
  JAPANESE = "ja-JP"
}
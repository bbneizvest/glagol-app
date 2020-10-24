import { RecordMeta } from "../object";

export interface PageData {
  header: string;
  body: string;
}

export interface Page {
  meta: RecordMeta;
  data: PageData;
}

// export function isPage(obj: any): obj is Page {
//   return true;
// }

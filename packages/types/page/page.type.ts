import { RecordMeta } from "../object";

export interface PageData {
  header: string;
  body: string;
}

export interface Page {
  meta: RecordMeta;
  data: PageData;
}

export function isPage(obj: any): obj is Page {
  if (!(Object.entries(obj).length == 2)) return false;

  if ("meta" in obj) {
    if (
      "oid" in obj.meta &&
      "createdOn" in obj.meta &&
      "updatedOn" in obj.meta &&
      Object.entries(obj.meta).length == 3
    ) {
      // skip to checking data
    } else {
      return false;
    }
  } else {
    return false;
  }

  if ("data" in obj && isPageData(obj.data)) {
    return true;
  } else {
    return false;
  }
}

export function isPageData(obj: object): obj is PageData {
  if ("header" in obj && "body" in obj && Object.entries(obj).length == 2) {
    return true;
  } else {
    return false;
  }
}

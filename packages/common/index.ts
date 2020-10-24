import errors from "./error.types";

export function isValidUuid(oid: string): boolean {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  if (!oid.match(pattern)) {
    return false;
  }
  return true;
}

export const errorTypes = errors;

export function toQueryString(passedObject: any): string {
  const searchParams = new URLSearchParams(passedObject);
  return searchParams.toString();
}

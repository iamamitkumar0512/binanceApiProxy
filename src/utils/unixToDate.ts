export function convertUnixToDateTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp);
  return date.toISOString(); // Format as "YYYY-MM-DDTHH:mm:ss.sssZ"
}

export function toLocalISOString(date: Date): string {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = (n: number) => (n < 10 ? '0' : '') + n;

  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    diff + pad(Math.floor(Math.abs(tzOffset) / 60)) +
    ':' + pad(Math.abs(tzOffset) % 60);
}

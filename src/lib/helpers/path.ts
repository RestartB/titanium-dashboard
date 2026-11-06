// check whether id is within the expected range
export function isGuildId(value: string | undefined): value is string {
  return typeof value === 'string' && /^\d{15,20}$/.test(value);
}

// keep url characters and % out of backend path segments
export function isSafePathSegment(value: string | undefined): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value !== '.' &&
    value !== '..' &&
    !/[/\\%?#]/.test(value) &&
    Array.from(value).every((character) => character.charCodeAt(0) > 32 && character.charCodeAt(0) !== 127)
  );
}

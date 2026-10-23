const MAX_VALUE_LENGTH = 200;

function formatValue(value) {
  let text;
  try {
    text = JSON.stringify(value);
  } catch {
    text = String(value);
  }
  if (text === undefined) text = String(value);
  if (text.length > MAX_VALUE_LENGTH) {
    text = `${text.slice(0, MAX_VALUE_LENGTH)}...(truncated ${text.length} chars)`;
  }
  return text;
}

export function logDataFlow(scope, event, fields = {}) {
  const pairs = Object.entries(fields)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ');
  console.log(`[${scope}] ${event} ${pairs}`.trimEnd());
}

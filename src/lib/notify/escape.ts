const entity = (name: string) => "&" + name + ";";

export function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, entity("amp"))
    .replace(/</g, entity("lt"))
    .replace(/>/g, entity("gt"))
    .replace(/"/g, entity("quot"));
}

export function escapeHtml(value: string) {
  return escapeXml(value);
}

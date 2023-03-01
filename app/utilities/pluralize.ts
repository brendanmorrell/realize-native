export function pluralize<Item, ItemsOrCount extends Array<Item> | number>(
  singular: string,
  itemsOrCount: ItemsOrCount
) {
  const count = Array.isArray(itemsOrCount) ? itemsOrCount.length : itemsOrCount || 0
  return `${singular}${count !== 1 ? 's' : ''}`
}

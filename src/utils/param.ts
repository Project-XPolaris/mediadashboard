export const getOrderQueryParam = (order: string): string | undefined => {
  return {
    "idasc": "id asc",
    "iddesc": "id desc",
    "nameasc": "name asc",
    "namedesc": "name desc",
    "createdasc": "created_at asc",
    "createddesc": "created_at desc",
  }[order]
}

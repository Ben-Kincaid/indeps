import { useMemo } from "react";

function useQueryFilter<T extends { [key: string]: any }>(
  query: string,
  items: Array<T>,
  searchKey: string
): { items: T[] } {
  const filteredItems = useMemo(
    () =>
      items.filter(obj => {
        if (String(obj[searchKey]).includes(query)) {
          return true;
        }
        return false;
      }),
    [query, items, searchKey]
  );

  return { items: filteredItems };
}

export default useQueryFilter;

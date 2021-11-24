import { useMemo } from "react";

function useQueryFilter<T extends object>(
  query: string,
  items: Array<T>,
  searchKey: string
): { items: T[] } {
  const filteredItems = useMemo(
    () =>
      items.filter(obj => {
        if (
          String((obj as { [key: string]: unknown })[searchKey]).includes(query)
        ) {
          return true;
        }
        return false;
      }),
    [query, items, searchKey]
  );

  return { items: filteredItems };
}

export default useQueryFilter;

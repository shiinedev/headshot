import { useQueryStates, parseAsInteger, parseAsString } from "nuqs";

export const useSearch = () => {
  return useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
      status:parseAsString.withDefault(""),
      platform: parseAsString.withDefault(""),
    },
    {
      history: "push",
    },
  );
};

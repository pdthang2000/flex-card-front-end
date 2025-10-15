import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import type { TagListResponse } from "@/types";

type ListTagsParams = {
  page?: number;
  size?: number;
  name?: string;
};

export function useListTags(params: ListTagsParams = {}) {
  const {
    page = 1,
    size = 50,
    name,
  } = params;

  return useQuery({
    queryKey: qk.tags({ page, size, name }),
    queryFn: () => get<TagListResponse>("/tag", { page, size, name }),
    placeholderData: (prev) => prev,
  });
}

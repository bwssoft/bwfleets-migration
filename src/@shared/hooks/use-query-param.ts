"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Params {
  key: string;
}

export function useQueryParam<TData>({ key }: Params) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function push(value: TData) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, formatQueryParamValue(value));
    router.push(`${pathname}?${params}`);
  }

  function replace(value: TData) {
    router.push(`${pathname}?${key}=${formatQueryParamValue(value)}`);
  }

  return {
    state: searchParams.get(key),
    push,
    replace,
  };
}

function formatQueryParamValue<TData>(value: TData) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

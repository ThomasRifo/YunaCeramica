
import { router as inertiaRouter, usePage } from '@inertiajs/react';

export default function useInertiaRouter() {
  const { url } = usePage();

  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  return {
    pathname: url,
    searchParams,
    navigate: (href) => inertiaRouter.visit(href),
  };
}
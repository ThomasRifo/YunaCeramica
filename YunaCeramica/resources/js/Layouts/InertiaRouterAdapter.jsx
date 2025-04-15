
import { router as inertiaRouter, usePage } from '@inertiajs/react';

export default function useInertiaRouter() {
  const { url } = usePage();

  return {
    pathname: url,
    navigate: (href) => inertiaRouter.visit(href),
  };
}
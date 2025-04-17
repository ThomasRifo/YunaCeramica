import React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { usePage, Link as InertiaLink } from '@inertiajs/react';

export default function BreadcrumbsNavigation() {
  const { props } = usePage();
  const breadcrumbs = props.breadcrumbs || [];

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast || !item.href) {
          return (
            <Typography key={index} sx={{ color: 'text.primary' }}>
              {item.label}
            </Typography>
          );
        }

        return (
          <InertiaLink
            key={index}
            href={item.href}
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            {item.label}
          </InertiaLink>
        );
      })}
    </Breadcrumbs>
  );
}
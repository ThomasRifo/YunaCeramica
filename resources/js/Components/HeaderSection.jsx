import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { usePage, Link as InertiaLink } from '@inertiajs/react';

export default function HeaderSection() {
  const { props } = usePage();
  const breadcrumbs = props.breadcrumbs || [];
  const title = props.title || '';

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1, fontSize: '0.875rem' }}>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast || !item.href) {
              return (
                <Typography key={index} color="text.primary">
                  {item.label}
                </Typography>
              );
            }

            return (
              <InertiaLink
                key={index}
                href={item.href}
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </InertiaLink>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Título principal */}
      {title && (
        <Typography variant="h5" fontWeight="bold" className="MuiTypography-root MuiTypography-h4 css-f84ov1-MuiTypography-root">
          {title}
        </Typography>
      )}
    </Box>
  );
}
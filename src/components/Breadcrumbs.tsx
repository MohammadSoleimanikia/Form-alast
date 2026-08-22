import type { BreadCrumbsProps } from '@/_types/_breadcrumbs';
import { Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }: BreadCrumbsProps) {
  return (
    <MuiBreadcrumbs
      separator={<span className="h-2 text-2xl leading-3">&#8226;</span>}
      aria-label="breadcrumb">
      {items.map((item, index) =>
        items.length - 1 !== index && item.link ? (
          <Link
            key={item.title}
            color="inherit"
            to={item.link}
            className="text-secondary-main hover:text-secondary-dark no-underline">
            {item.title}
          </Link>
        ) : (
          <Typography noWrap maxWidth={200} className="text-text-disabled">
            {item.title}
          </Typography>
        )
      )}
    </MuiBreadcrumbs>
  );
}

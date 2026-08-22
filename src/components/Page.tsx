// import { Helmet } from 'react-helmet-async';
import type { BreadCrumbsProps } from '@/_types/_breadcrumbs';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Fade, Typography } from '@mui/material';
import { type HTMLProps, type ReactNode } from 'react';

// ----------------------------------------------------------------------

interface Props extends HTMLProps<HTMLDivElement> {
  meta?: ReactNode;
  title: string;
  breadcrumbs?: BreadCrumbsProps;
  disableHeaderTitle?: boolean;
}

export default function Page({
  title,
  meta,
  breadcrumbs,
  disableHeaderTitle,
  ...other
}: Props) {
  return (
    <div>
      {/* <Helmet> */}
      <title>{`${title} | پنل مدیریت آپ تک`}</title>
      {meta}
      {/* </Helmet> */}

      {!disableHeaderTitle || breadcrumbs ? (
        <div className="mb-6 mr-1 mt-3 flex flex-wrap items-center justify-between gap-5 lg:mb-5 lg:mt-0">
          {!disableHeaderTitle && (
            <Typography component={'h1'} variant="h6">
              {title}
            </Typography>
          )}
          {breadcrumbs && <Breadcrumbs {...breadcrumbs} />}
        </div>
      ) : null}

      <Fade in timeout={500}>
        <div {...other}>{other.children}</div>
      </Fade>
    </div>
  );
}

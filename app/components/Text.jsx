import clsx from 'clsx';

import {missingClass, formatText} from '~/lib/utils';

export function Text({
  as: Component = 'span',
  className,
  color = 'default',
  format,
  size = 'copy',
  width = 'default',
  children,
  ...props
}) {
  const colors = {
    default: 'inherit',
    primary: 'text-primary/90',
    subtle: 'text-primary/50',
    notice: 'text-notice',
    contrast: 'text-contrast/90',
  };

  const sizes = {
    lead: 'text-lead font-medium',
    copy: 'text-copy',
    fine: 'text-fine subpixel-antialiased',
  };

  const widths = {
    default: 'max-w-prose',
    narrow: 'max-w-prose-narrow',
    wide: 'max-w-prose-wide',
  };

  const styles = clsx(
    missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    missingClass(className, 'text-') && colors[color],
    sizes[size],
    className,
  );

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}

export function Heading({
  as: Component = 'h2',
  children,
  center,
  className = '',
  format,
  size = 'heading',
  width = 'default',
  ...props
}) {
  const sizes = {
    display: 'font-bold text-display',
    heading: 'font-bold text-heading',
    lead: 'font-bold text-lead',
    copy: 'font-medium text-copy',
  };

  
  const styles = clsx(
    missingClass(className, 'whitespace-') && 'whitespace-pre-wrap',
    // missingClass(className, 'max-w-') && widths[width],
    missingClass(className, 'font-') && sizes[size],
    className,
  );

  return (
    <Component {...props} className={styles+`${center?' text-center':''}`}>
      {format ? formatText(children) : children}
    </Component>
  );
}

export function Section({
  as: Component = 'section',
  children,
  className,
  center,
  divider = 'none',
  display = center?'flex':'grid',
  heading,
  bg,
  padding = 'all',
  ...props
}) {
  const paddings = {
    x: 'px-6 md:px-8 lg:px-12',
    y: 'py-6 md:py-8 lg:py-12',
    swimlane: 'pt-4 md:pt-8 lg:pt-12 md:pb-4 lg:pb-8',
    all: 'p-6 md:p-8 lg:p-12',
  };

  const dividers = {
    none: 'border-none',
    top: 'border-t border-primary/05',
    bottom: 'border-b border-primary/05',
    both: 'border-y border-primary/05',
  };

  const displays = {
    flex: 'flex',
    grid: 'grid',
  };

  const styles = clsx(
    'w-full gap-4 md:gap-8',
    displays[display],
    missingClass(className, '\\mp[xy]?-') && paddings[padding],
    // dividers[divider],
    className,
  );

  return (
    <Component  className={`${bg?bg:''} donfred flex-col `}>
      <div {...props} className={styles+'  flex-col donfred container mx-auto '}>
        {heading && (
          <Heading center={center}  className={padding === 'y' ? paddings['x'] : ''}>
            {heading}
          </Heading>
        )}
        
        {children}
      </div>
    </Component>
  );
}

export function PageHeader({
  children,
  className,
  heading,
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'grid w-full gap-8 p-6 py-8 md:p-8 lg:p-12 justify-items-start',
    blogPost:
      'grid md:text-center w-full gap-4 p-6 py-8 md:p-8 lg:p-12 md:justify-items-center',
    allCollections:
      'flex justify-between items-baseline gap-8 p-6 md:p-8 lg:p-12',
  };

  const styles = clsx(variants[variant], className);

  return (
    <header >
      <div {...props} className={styles+' flex-col donfred container mx-auto '}>
        {heading && (
          <Heading as="h1" width="narrow" size="heading" className="inline-block">
            {heading}
          </Heading>
        )}
        {children}
      </div>
    </header>
  );
}

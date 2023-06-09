import clsx from 'clsx';
import {MediaFile} from '@shopify/hydrogen';
import {Heading, Text, Link} from '~/components';

/**
 * Hero component that renders metafields attached to collection resources
 **/
export function Hero({
  byline,
  cta,
  handle,
  heading,
  height,
  loading,
  spread,
  spreadSecondary,
  top,
}) {
  
  // const annoucement = document.querySelector('.donfred-annoucement')
  // const navbar = document.querySelector('.donfred-nav');
  // const navbarHeight = navbar.offsetHeight;
  // const annoucementHeight = annoucement.offsetHeight;
  const heroStyle = {
    height: `calc(100vh - 10.5rem)`,
  };
  return (
    <Link to={`/collections/${handle}`}>
      <section
        className={clsx(
          'relative justify-end flex flex-col w-full donfred',
          
          // top && '-mt-nav',
          // height === 'full' 
          //   ? 'h-screen'
          //   : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]',
        )}
        style={heroStyle}
      >
        <div className="absolute    inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-1 content-stretch overflow-clip">
          {spread?.reference && (
            <div >
              <SpreadMedia
                sizes={
                  spreadSecondary?.reference
                    ? '(min-width: 48em) 50vw, 100vw'
                    : '100vw'
                }
                data={spread.reference}
                loading={loading}
              />
            </div>
          )}
          {spreadSecondary?.reference && (
            <div className="hidden md:block">
              <SpreadMedia
                sizes="50vw"
                data={spreadSecondary.reference}
                loading={loading}
                c
              />
            </div>
          )}
        </div>
        <div className="z-10  bg-gradient-to-t dark:from-contrast/60 dark:text-primary from-primary/100 text-contrast ">
          <div className='donfred  container mx-auto px-6 md:px-8 lg:px-12  flex flex-col items-baseline justify-between gap-4  py-8  '>
            {heading?.value && (
              <Heading format as="h2" size="heading" className="max-w-md">
                {heading.value}
              </Heading>
            )}
            {byline?.value && (
              <Text format width="narrow" as="p" size="copy">
                {byline.value}
              </Text>
            )}
            { cta?.value && <button className='px-4 py-2 border border-white'><Text size="copy">{cta.value}</Text></button>}
          </div>
        </div>
      </section>
    </Link>
  );
}

function SpreadMedia({data, loading, sizes}) {
  return (
    <MediaFile
      data={data}
      className="block object-cover w-full h-full "
      mediaOptions={{
        video: {
          controls: false,
          muted: true,
          loop: true,
          playsInline: true,
          autoPlay: true,
          previewImageOptions: {src: data.previewImage?.url ?? ''},
        },
        image: {
          loading,
          crop: 'center',
          sizes,
          alt: data.alt || '',
        },
      }}
    />
  );
}

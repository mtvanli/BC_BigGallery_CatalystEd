import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { PropsWithChildren, Suspense } from 'react';
import Script from 'next/script'


import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Footer, FooterFragment } from '~/components/footer/footer';
import { Header, HeaderFragment } from '~/components/header';
import { ProductSheet } from '~/components/product-sheet';
import { LocaleType } from '~/i18n';



interface Props extends PropsWithChildren {
  params: { locale: LocaleType };
}

const LayoutQuery = graphql(
  `
    query LayoutQuery {
      site {
        ...HeaderFragment
        ...FooterFragment
      }
    }
  `,
  [HeaderFragment, FooterFragment],
);

export default async function DefaultLayout({ children, params: { locale } }: Props) {
  const customerId = await getSessionCustomerId();

  const { data } = await client.fetch({
    document: LayoutQuery,
    fetchOptions: {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['layout'] // Tag for manual revalidation if needed
      }
    },
  });

  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <>
      <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse" />}>
        <Header data={data.site} />
      </Suspense>

      <main className="flex-1 px-4 2xl:container sm:px-10 lg:px-12 2xl:mx-auto 2xl:px-0">
        {children}
      </main>

      <Suspense fallback={null}>
        <NextIntlClientProvider
          locale={locale}
          messages={{ Product: messages.Product ?? {}, AddToCart: messages.AddToCart ?? {} }}
        >
          <ProductSheet />
        </NextIntlClientProvider>
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
        <Footer data={data.site} />
      </Suspense>

      {/* Microsoft Clarity - Placed at the end to minimize impact on initial page load */}
      {/*  <Script
        id="microsoft-clarity"
        strategy="lazyOnload"
      >
        {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "nu9pyk7mrw");
          `}
      </Script> */}


    </>
  );
}

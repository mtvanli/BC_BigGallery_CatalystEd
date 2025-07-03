import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Hero } from '~/components/hero';
import {
  ProductCardCarousel,
  ProductCardCarouselFragment,
} from '~/components/product-card-carousel';
import { LocaleType } from '~/i18n';
import { Suspense } from "react"

interface Props {
  params: {
    locale: LocaleType;
  };
}

const HomePageQuery = graphql(
  `
    query HomePageQuery {
      site {
        newestProducts(first: 20) {
          edges {
            node {
              ...ProductCardCarouselFragment
                metafields ( 
                namespace: "newestProducts", 
                keys: ["newLaunch"] 
                ){
                  edges {
                  node {
                    key
                    value
                    }
                  }
                }
              }
            }
        }
        featuredProducts(first: 12) {
          edges {
            node {
              ...ProductCardCarouselFragment
            }
          }
        }
      }
    }
  `,
  [ProductCardCarouselFragment],
);

export default async function Home({ params: { locale } }: Props) {
  const customerId = await getSessionCustomerId();

  unstable_setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Home' });
  const messages = await getMessages({ locale });

  const { data } = await client.fetch({
    document: HomePageQuery,
    customerId,
    fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
  });

  const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);

  // Remove edges and nodes from newestProducts
  const newestProductsRaw = removeEdgesAndNodes(data.site.newestProducts);

  // Filter out products where the metafield 'display' is 'No'
  const filteredNewestProducts = newestProductsRaw.filter((product: any) => {
    const displayMetafield = product.metafields.edges.find(
      (metafieldEdge: any) => metafieldEdge.node.key === 'newLaunch'
    );
    return !displayMetafield || displayMetafield.node.value !== 'No';
  });

  // Get the first 12 filtered products
  const newestProducts = filteredNewestProducts.slice(0, 12);

  return (
    <>
      <Hero />

      <div className="my-10">
        <NextIntlClientProvider locale={locale} messages={{ Product: messages.Product ?? {} }}>
          <Suspense fallback={<div className="h-64 w-full animate-pulse bg-gray-100 rounded-md"></div>}>
            <ProductCardCarousel
              products={featuredProducts}
              showCart={false}
              showCompare={false}
              showReviews={false}
              title={t("Carousel.featuredProducts")}
            />
          </Suspense>
          <Suspense fallback={<div className="h-64 w-full animate-pulse bg-gray-100 rounded-md mt-8"></div>}>
            <ProductCardCarousel
              products={newestProducts}
              showCart={false}
              showCompare={false}
              showReviews={false}
              title={t("Carousel.newestProducts")}
            />
          </Suspense>
        </NextIntlClientProvider>
      </div>
    </>
  );
}

export const runtime = 'edge';
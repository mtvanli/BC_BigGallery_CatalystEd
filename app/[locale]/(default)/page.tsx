import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import dynamic from "next/dynamic"
import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { Hero } from '~/components/hero';
import {

  ProductCardCarouselFragment,
} from '~/components/product-card-carousel';
import { LocaleType } from '~/i18n';
import { Suspense } from "react"

const ProductCardCarousel = dynamic(
  () =>
    import("~/components/product-card-carousel").then((mod) => ({
      default: mod.ProductCardCarousel,
    })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64 h-80 bg-gray-100 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    ),
    ssr: true,
  },
)


interface Props {
  params: {
    locale: LocaleType;
  };
}

const HomePageQuery = graphql(
  `
    query HomePageQuery {
      site {
        newestProducts(first: 35) {
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

// Separate data fetching functions for better caching and organization
async function fetchTranslationData(locale: LocaleType) {
  return Promise.all([getTranslations({ locale, namespace: "Home" }), getMessages({ locale })])
}

async function fetchProductData(customerId: string | undefined) {
  const { data } = await client.fetch({
    document: HomePageQuery,
    customerId,
    fetchOptions: customerId ? { cache: "no-store" } : { next: { revalidate } },
  })

  const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts)
  const newestProductsRaw = removeEdgesAndNodes(data.site.newestProducts)

  // Filter products efficiently
  const filteredNewestProducts = newestProductsRaw.filter((product: any) => {
    const displayMetafield = product.metafields.edges.find(
      (metafieldEdge: any) => metafieldEdge.node.key === "newLaunch",
    )
    return !displayMetafield || displayMetafield.node.value !== "No"
  })

  return {
    featuredProducts,
    newestProducts: filteredNewestProducts.slice(0, 12),
  }
}

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale)

  // Get customerId first
  const customerId = await getSessionCustomerId()

  // Run translation and product data fetching in parallel
  const [[t, messages], { featuredProducts, newestProducts }] = await Promise.all([
    fetchTranslationData(locale),
    fetchProductData(customerId),
  ])

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
  )
}

// export const runtime = "edge"

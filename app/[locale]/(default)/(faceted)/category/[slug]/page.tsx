import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, unstable_setRequestLocale } from "next-intl/server"
import dynamic from "next/dynamic"
import { ProductCard } from "~/components/product-card"
import type { LocaleType } from "~/i18n"

import { fetchFacetedSearch } from "../../fetch-faceted-search"
import { getCategoryPageData } from "./page-data"

// DYNAMIC IMPORTS - These load only when needed
const FacetedSearch = dynamic(
  () => import("../../_components/faceted-search").then((mod) => ({ default: mod.FacetedSearch })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    ),
    ssr: true,
  },
)

const MobileSideNav = dynamic(
  () => import("../../_components/mobile-side-nav").then((mod) => ({ default: mod.MobileSideNav })),
  {
    loading: () => <div className="h-10 w-20 bg-gray-200 animate-pulse rounded md:hidden" />,
    ssr: false, // Mobile-only, no need for SSR
  },
)

const SortBy = dynamic(() => import("../../_components/sort-by").then((mod) => ({ default: mod.SortBy })), {
  loading: () => <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />,
  ssr: true,
})

const Pagination = dynamic(() => import("../../_components/pagination").then((mod) => ({ default: mod.Pagination })), {
  loading: () => (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-10 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  ),
  ssr: true,
})

const SubCategories = dynamic(
  () => import("./_components/sub-categories").then((mod) => ({ default: mod.SubCategories })),
  {
    loading: () => (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    ),
    ssr: true,
  },
)

interface Props {
  params: {
    slug: string
    locale: LocaleType
  }
  searchParams: Record<string, string | string[] | undefined>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryId = Number(params.slug)

  const data = await getCategoryPageData({
    categoryId,
  })

  const title = data.category?.name

  return {
    title,
  }
}

export default async function Category({ params: { locale, slug }, searchParams }: Props) {
  unstable_setRequestLocale(locale)

  const categoryId = Number(slug)

  // PARALLEL DATA FETCHING 
  const [t, tPagination, messages, { category, categoryTree }, search] = await Promise.all([
    getTranslations({ locale, namespace: "Category" }),
    getTranslations({ locale, namespace: "Pagination" }),
    getMessages({ locale }),
    getCategoryPageData({ categoryId }),
    fetchFacetedSearch({ ...searchParams, category: categoryId }),
  ])

  if (!category) {
    return notFound()
  }

  const productsCollection = search.products
  const products = productsCollection.items
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = productsCollection.pageInfo

  return (
    <div className="group">
      <div className="md:mb-8 " />
      {/* <Breadcrumbs category={category} /> */}
      <NextIntlClientProvider
        locale={locale}
        messages={{
          FacetedGroup: messages.FacetedGroup ?? {},
          Product: messages.Product ?? {},
          AddToCart: messages.AddToCart ?? {},
        }}
      >
        <div className="md:mb-8 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <h1 className="mb-4 text-4xl font-black lg:mb-0 lg:text-5xl">{category.name}</h1>

          <div className="flex flex-col items-center gap-3 whitespace-nowrap md:flex-row">
            <MobileSideNav>
              <FacetedSearch facets={search.facets.items} headingId="mobile-filter-heading" pageType="category">
                <SubCategories categoryTree={categoryTree} />
              </FacetedSearch>
            </MobileSideNav>
            <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-end md:gap-6">
              <SortBy />
              <div className="order-3 py-4 text-base font-semibold md:order-2 md:py-0">
                {/* {t('sortBy', { items: productsCollection.collectionInfo?.totalItems ?? 0 })} */}
                {`${productsCollection.collectionInfo?.totalItems ?? 0} stores`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <FacetedSearch
            className="mb-8 hidden lg:block"
            facets={search.facets.items}
            headingId="desktop-filter-heading"
            pageType="category"
          >
            <SubCategories categoryTree={categoryTree} />
          </FacetedSearch>

          <section
            aria-labelledby="product-heading"
            className="col-span-4 group-has-[[data-pending]]:animate-pulse lg:col-span-3"
          >
            <h2 className="sr-only" id="product-heading">
              {t("products")}
            </h2>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
              {products.map((product, index) => (
                <ProductCard imagePriority={index <= 3} imageSize="tall" key={product.entityId} product={product} />
              ))}
            </div>

            <Pagination
              endCursor={endCursor}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              nextLabel={tPagination("next")}
              prevLabel={tPagination("prev")}
              startCursor={startCursor}
            />
          </section>
        </div>
      </NextIntlClientProvider>
    </div>
  )
}

export const runtime = "edge"

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useFormatter, useTranslations } from 'next-intl';

import { FragmentOf, graphql } from '~/client/graphql';
import { ProductForm } from '~/components/product-form';
import { ProductFormFragment } from '~/components/product-form/fragment';

import { ProductSchema, ProductSchemaFragment } from './product-schema';
import { ReviewSummary, ReviewSummaryFragment } from './review-summary';

import Link from 'next/link';
import { OpenInNewIcon } from 'components/custom-icons/open-in-new'
import { ExternalLink } from 'lucide-react';

export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
      ...ReviewSummaryFragment
      ...ProductSchemaFragment
      ...ProductFormFragment
      entityId
      name
      sku
      upc
      minPurchaseQuantity
      maxPurchaseQuantity
      condition
      weight {
        value
        unit
      }
      availabilityV2 {
        description
      }
      customFields {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      brand {
        name
      }
      prices {
        priceRange {
          min {
            value
          }
          max {
            value
          }
        }
        retailPrice {
          value
        }
        salePrice {
          value
        }
        basePrice {
          value
        }
        price {
          value
          currencyCode
        }
      }
    }
  `,
  [ReviewSummaryFragment, ProductSchemaFragment, ProductFormFragment],
);

interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const Details = ({ product }: Props) => {
  const t = useTranslations('Product.Details');
  const format = useFormatter();

  const customFields = removeEdgesAndNodes(product.customFields);

  const showPriceRange =
    product.prices?.priceRange.min.value !== product.prices?.priceRange.max.value;

  return (
    <div>
      {product.brand && (
        <p className="mb-2 font-semibold uppercase text-gray-500">{product.brand.name}</p>
      )}
      <div className='flex flew-row align-baseline'>
        <h1 className="mb-4 text-4xl font-black lg:text-5xl">{product.name}</h1>
        {
          customFields.map((customField) =>
            customField.name == 'Store' ? (
              <div key={customField.entityId} className='pl-2 '>
                <Link href={customField.value} target="_blank">  <ExternalLink className="lg:mt-2 ml-7 stroke-slate-500 size-7 md:size-9" /> </Link>
                {/* {customField.name == 'Store'? <p>{customField.value}</p>: null } */}
              </div>
            ) : "")}
      </div>
      {/* <ReviewSummary data={product} /> */}

      {/*  {product.prices && (
        <div className="my-6 text-2xl font-bold lg:text-3xl">
          {showPriceRange ? (
            <span>
              {format.number(product.prices.priceRange.min.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}{' '}
              -{' '}
              {format.number(product.prices.priceRange.max.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}
            </span>
          ) : (
            <>
              {product.prices.retailPrice?.value !== undefined && (
                <span>
                  {t('Prices.msrp')}:{' '}
                  <span className="line-through">
                    {format.number(product.prices.retailPrice.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                  <br />
                </span>
              )}
              {product.prices.salePrice?.value !== undefined &&
              product.prices.basePrice?.value !== undefined ? (
                <>
                  <span>
                    {t('Prices.was')}:{' '}
                    <span className="line-through">
                      {format.number(product.prices.basePrice.value, {
                        style: 'currency',
                        currency: product.prices.price.currencyCode,
                      })}
                    </span>
                  </span>
                  <br />
                  <span>
                    {t('Prices.now')}:{' '}
                    {format.number(product.prices.salePrice.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                </>
              ) : (
                product.prices.price.value && (
                  <span>
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                )
              )}
            </>
          )}
        </div>
      )} */}

      {/* <ProductForm data={product} /> */}

      <div className="mb-12 mt-4">
        {/* <h2 className="mb-4 text-xl font-bold md:text-2xl">{t('additionalDetails')}</h2> */}
        <div className="grid gap-3 sm:grid-cols-2 rounded-2xl px-12 py-10 border border-gray-100 bg-slate-100">
          {/*  {Boolean(product.sku) && (
            <div>
              <h3 className="font-semibold">{t('sku')}</h3>
              <p>{product.sku}</p>
            </div>
          )}
          {Boolean(product.upc) && (
            <div>
              <h3 className="font-semibold">{t('upc')}</h3>
              <p>{product.upc}</p>
            </div>
          )}
          {Boolean(product.minPurchaseQuantity) && (
            <div>
              <h3 className="font-semibold">{t('minPurchase')}</h3>
              <p>{product.minPurchaseQuantity}</p>
            </div>
          )}
          {Boolean(product.maxPurchaseQuantity) && (
            <div>
              <h3 className="font-semibold">{t('maxPurchase')}</h3>
              <p>{product.maxPurchaseQuantity}</p>
            </div>
          )}
          {Boolean(product.availabilityV2.description) && (
            <div>
              <h3 className="font-semibold">{t('availability')}</h3>
              <p>{product.availabilityV2.description}</p>
            </div>
          )}
          {Boolean(product.condition) && (
            <div>
              <h3 className="font-semibold">{t('condition')}</h3>
              <p>{product.condition}</p>
            </div>
          )}
          {Boolean(product.weight) && (
            <div>
              <h3 className="font-semibold">{t('weight')}</h3>
              <p>
                {product.weight?.value} {product.weight?.unit}
              </p>
            </div>
          )} */}
          {Boolean(customFields) && (
            <>
              {/* Display non-Misc fields */}
              {customFields
                .filter(field => field.name !== 'Misc' && field.name !== 'Store' && field.value !== 'na' && field.value !== 'na_')
                .map((customField) => (
                  <div key={customField.entityId}>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <h3 className="font-semibold">{customField.name === 'Presentation'
                        ? 'Build'
                        : customField.name === 'HealthScore'
                          ? 'Account Health Score'
                          :
                          customField.name}</h3>
                    </div>
                    <p className="ml-3.5">{customField.value}</p>
                  </div>
                ))
              }

              {/* Display Misc fields grouped together */}
              {customFields.some(field => field.name === 'Misc' && field.value !== 'na' && field.value !== 'na_') && (
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    <h3 className="font-semibold">Misc</h3>
                  </div>
                  {customFields
                    .filter(field => field.name === 'Misc' && field.value !== 'na' && field.value !== 'na_')
                    .map((miscField) => (
                      <p className="ml-3.5" key={miscField.entityId}>{miscField.value}</p>
                    ))
                  }
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ProductSchema product={product} />
    </div>
  );
};

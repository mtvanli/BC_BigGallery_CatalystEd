import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { graphql, ResultOf } from '~/client/graphql';
import { Link } from '~/components/link';
import {
  ProductCard as ComponentsProductCard,
  ProductCardImage,
  ProductCardInfo,
  ProductCardInfoBrandName,
  ProductCardInfoPrice,
  ProductCardInfoProductName,
} from '~/components/ui/product-card';
import { Rating } from '~/components/ui/rating';
import { cn } from '~/lib/utils';

import { BcImage } from '../bc-image';
import { Pricing, PricingFragment } from '../pricing';

import { AddToCart } from './add-to-cart';
import { AddToCartFragment } from './add-to-cart/fragment';
import { Compare } from './compare';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image'

import { contentImageUrl, imageManagerImageUrl } from '~/lib/store-assets';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate
      }
      path
      brand {
        name
        path
      }
      reviewSummary {
        numberOfReviews
        averageRating
      }
      ...AddToCartFragment
      ...PricingFragment
      customFields(names: ["Store","Segment", "Presentation","Channel","Region","Misc","HealthScore"]) {
      edges {
        node {
          entityId
          name
          value
        }
      }
    }
    }
  `,
  [PricingFragment, AddToCartFragment],
);



interface Props {
  product: ResultOf<typeof ProductCardFragment>;
  imageSize?: 'tall' | 'wide' | 'square';
  imagePriority?: boolean;
  showCart?: boolean;
  showCompare?: boolean;
  showReviews?: boolean;
}

export const ProductCard = ({
  product,
  imageSize = 'square',
  imagePriority = false,
  showCart = true,
  showCompare = true,
  showReviews = true,
}: Props) => {
  const summaryId = useId();
  const t = useTranslations('Product.ProductSheet');

  // Find the store custom field if it exists
  const storeField = product.customFields?.edges?.find(
    edge => edge?.node.name === "Store"
  );
  const storeUrl = storeField?.node.value;

  // Find the region custom field if it exists
  const regionField = product.customFields?.edges?.find(
    edge => edge?.node.name === "Region"
  );
  const regionValue = regionField?.node.value;

  if (!product.entityId) {
    return null;
  }

  // Function to render region flag or label
  {/* 
  const renderRegionIndicator = () => {
    if (!regionValue) return null;

    // First we'll add a white strip that runs along the bottom of the image
    return (
      <>
        {regionValue.length === 2 ? (
          <>
            <div className="absolute bottom-0 left-0 z-1 w-[34px] h-[30px] md:w-[39px] md:h-[33px] bg-white border-1 rounded-tr-lg bg-opacity-95"></div>
            <div className="absolute bottom-1 left-1 z-2 w-[25px] h-[22px] md:w-[27px] md:h-[23px] lg:w-[29px] lg:h-[24px] overflow-hidden border-1 rounded-full border-white shadow-lg">
              <img
                src={`https://flagcdn.com/${regionValue === 'UK' ? 'gb' : regionValue.toLowerCase()}.svg`}
                alt={`${regionValue} flag`}
                width={100}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </>
        ) : (
          <div className="absolute bottom-1 left-1 z-2 px-3 py-1 border-2 border-white rounded-full bg-violet-100 text-xs font-medium shadow-lg">
            {regionValue === 'APAC - Other' ? 'APAC' : regionValue === 'EMEA - Other' ? 'EMEA' : regionValue}
          </div>
        )}
      </>
    );
  };
  */}

  // Function to get the appropriate background color class based on health score
  const getHealthScoreBackgroundColor = (value) => {
    switch (value) {
      case 'Excellent':
        return 'bg-lime-100';
      case 'Very Good':
        return 'bg-lime-50';
      case 'Good':
        return 'bg-lime-50';
      case 'Bad':
        return 'bg-red-50';
      case 'Churn Risk':
        return 'bg-red-50';
      case 'Churning':
        return 'bg-red-100';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <ComponentsProductCard key={product.entityId}>
      <ProductCardImage>
        <div
          className={cn('relative flex-auto', {
            'aspect-square': imageSize === 'square',
            'aspect-[4/5]': imageSize === 'tall',
            'aspect-[7/5]': imageSize === 'wide',
          })}
        >
          {product.defaultImage ? (
            <>
              <BcImage
                alt={product.defaultImage.altText || product.name}
                className="object-cover object-top rounded-t-lg"
                fill
                priority={imagePriority}
                sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
                src={product.defaultImage.url}
              />
              {/* {renderRegionIndicator()} */}
            </>
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
      </ProductCardImage>
      <ProductCardInfo className={cn(showCart && 'justify-end')}>
        {product.brand && <ProductCardInfoBrandName>{product.brand.name}</ProductCardInfoBrandName>}

        <div className='flex flew-row justify-center items-center relative'>
          <ProductCardInfoProductName>
            {product.path ? (
              <Link
                className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary/20 focus-visible:ring-0"
                href={product.path}
              >
                <span aria-hidden="true" className="absolute inset-0 bottom-20 z-10" />
                {product.name}
              </Link>
            ) : (
              product.name
            )}
          </ProductCardInfoProductName>

          <div className='pt-3.5 pr-2 md:px-3 relative'>
            {
              product.customFields?.edges?.map((edge) =>
                edge && (
                  (edge.node.name === "Store" && (
                    <div key={edge.node.name}  >
                      <Link href={edge.node.value} target="_blank" className="relative z-0">
                        <ExternalLink className="mb-1.5 md:mb-2 ml-2 stroke-slate-500 size-4 md:size-5" />
                      </Link>
                    </div>)
                  )
                )
              )}
          </div>

        </div>

        <div className='flex flex-row flex-wrap gap-1 justify-center items-center lg:text-sm  text-xs mt-0.5 xl:mt-2 mb-3 md:mb-4 xl:mb-6 mx-1 md:mx-2'>
          {product.customFields?.edges?.sort((a, b) => {
            const order = {
              'Region': 1,
              'Segment': 2,
              'Presentation': 3,
              'Misc': 4,
              'HealthScore': 6,
              'Channel': 5
            };
            return (order[a.node.name] || 99) - (order[b.node.name] || 99);
          }).map((edge) => {
            if (!edge) return null;

            switch (edge.node.name) {
              /* case "Region":
                return (
                  <div key={edge.node.value}>
                    {edge.node.value.length === 2 ? (
                      <div className="w-[25px] h-[22px] md:w-[27px] md:h-[23px] lg:w-[30px] lg:h-[25px] xl:w-[31px] xl:h-[26px] overflow-hidden border rounded-full border-gray-100">
                        <img
                          src={`https://flagcdn.com/${edge.node.value === 'UK' ? 'gb' : edge.node.value.toLowerCase()}.svg`}
                          alt={`${edge.node.value} flag`}
                          width={100}
                          className="h-full object-cover object-center opacity-80"
                        />
                      </div>
                    ) : (
                      <p className='px-2 py-1 border-transparent rounded-full bg-violet-50'>
                        {edge.node.value === 'APAC - Other' ? 'APAC' : edge.node.value === 'EMEA - Other' ? 'EMEA' : edge.node.value}
                      </p>
                    )}
                  </div>
                ); */

              case "Segment":
                return (
                  <p key={edge.node.value} className='px-[6px] py-0.5 md:px-2 md:py-1 border-transparent rounded-full bg-sky-100'>
                    {edge.node.value}
                  </p>
                );

              case "Presentation":
                return (
                  <p key={edge.node.value} className='px-[6px] py-0.5 md:px-2 md:py-1 border-transparent rounded-full bg-slate-100'>
                    {edge.node.value === "Headless - Catalyst" ? (
                      <>
                        <span className="block xl:hidden">Catalyst</span>
                        <span className="hidden xl:block">{edge.node.value}</span>
                      </>) : edge.node.value}
                  </p>
                );

              case "Channel":
                return edge.node.value !== "Marketplaces" && edge.node.value !== "na" ? (
                  <p key={edge.node.value} className='px-[6px] py-0.5 md:px-2 md:py-1 border-transparent rounded-full bg-purple-50'>
                    {edge.node.value === "Multi Storefront" ? (
                      <>
                        <span className="block xl:hidden">MSF</span>
                        <span className="hidden xl:block">{edge.node.value}</span>
                      </>
                    ) : edge.node.value === "Multiple Stores" ? (
                      <>
                        <span className="block xl:hidden">Multi. Stores</span>
                        <span className="hidden xl:block">{edge.node.value}</span>
                      </>
                    ) : (
                      edge.node.value
                    )}
                  </p>
                ) : null;

              case "HealthScore":
                // Function to get emoji for HealthScore values
                const getHealthScoreEmoji = (value) => {
                  const emojis = {
                    'Unmanaged': ' 🤷‍♂️',
                    'Churning': ' 🚨',
                    'Churn Risk': ' ⚠️',
                    'Bad': ' ☹️',
                    'Good': ' 😊',
                    'Very Good': ' 😀',
                    'Excellent': ' 🏆'
                  };
                  return emojis[value] || value; // Fallback to text if no emoji mapping exists
                };
                return edge.node.value !== "Unmanaged" ? (
                  <p
                    key={edge.node.value}
                    className={`px-2 py-1 text-md border-transparent rounded-full ${getHealthScoreBackgroundColor(edge.node.value)}`}
                    title={`Health Score: ${edge.node.value}`}
                  >
                    {`Health: ${getHealthScoreEmoji(edge.node.value)}`}
                  </p>
                ) : null;

              case "Misc":
                return edge.node.value === "B2B Edition" ? (
                  <>
                    <div
                      className='px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 border rounded-full bg-white'
                      title="B2B Edition"
                    >
                      <BcImage
                        src={imageManagerImageUrl("b2b-ed.jpg")}
                        width={10}
                        height={10}
                        className="w-3 h-3 md:w-3 md:h-[13px] lg:w-[17px] lg:h-[16px]"
                        alt="B2B Edition"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  </>
                ) : null;

              default:
                return null;
            }
          })}
        </div>

        {/* {showReviews && (
          <div className="flex items-center gap-3">
            <p
              aria-describedby={summaryId}
              className={cn(
                'flex flex-nowrap text-primary',
                product.reviewSummary.numberOfReviews === 0 && 'text-gray-400',
              )}
            >
              <Rating size={16} value={product.reviewSummary.averageRating || 0} />
            </p>

            <div className="text-xs font-normal text-gray-500" id={summaryId}>
              {product.reviewSummary.averageRating !== 0 && (
                <>
                  {t.rich('productRating', {
                    currentRating: product.reviewSummary.averageRating,
                    rating: (chunks) => <span className="sr-only">{chunks}</span>,
                    stars: (chunks) => <span className="sr-only">{chunks}</span>,
                  })}
                </>
              )}
              <span className="sr-only">{t('numberReviews')}</span>(
              {product.reviewSummary.numberOfReviews})
            </div>
          </div>
        )} */}

        {/*  <div className="flex flex-wrap items-end justify-between pt-2">
          <ProductCardInfoPrice>
            <Pricing data={product} />
          </ProductCardInfoPrice>

        {showCompare && (
            <Compare
              productId={product.entityId}
              productImage={product.defaultImage}
              productName={product.name}
            />
          )} 
        </div> */}
      </ProductCardInfo>
      {/* {showCart && <AddToCart data={product} />} */}
    </ComponentsProductCard>
  );
};

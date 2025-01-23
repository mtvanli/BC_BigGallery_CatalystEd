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

import { OpenInNewIcon } from 'components/custom-icons/open-in-new';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image'

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
      customFields(names: ["Store","Segment", "Presentation","Channel","Region"]) {
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

  if (!product.entityId) {
    return null;
  }

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
            <BcImage
              alt={product.defaultImage.altText || product.name}
              className="object-fill rounded-t-lg"
              fill
              priority={imagePriority}
              sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
              src={product.defaultImage.url}

            />
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

          <div className='pt-3.5 px-3 relative'>
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

        <div className='flex flew-row flex-wrap justify-center items-center lg:text-sm text-xs '>
          <div>
            {
              product.customFields?.edges?.map((edge) =>
                edge && (
                  (edge.node.name === "Region" ?
                    <div key={edge.node.value}>
                      {edge.node.value.length === 2 ? (
                        <div className="w-8 h-5 lg:w-9 lg:h-[25px]  overflow-hidden shadow rounded-full mt-1 mr-1 ml-3 " >
                          <Image
                            src={`https://flagcdn.com/w2560/${edge.node.value === 'UK' ? 'gb' : edge.node.value.toLowerCase()}.png`}
                            alt={`${edge.node.value} flag`}
                            width={128}
                            height={80}
                            className="h-full object-fill object-left-top opacity-80"
                            quality={100}
                            unoptimized={true}
                            priority={true}
                          />
                        </div>
                      ) : <p className=' px-2 py-1 mt-1 mr-1 border-transparent  rounded-full bg-violet-50'>
                        {edge.node.value === 'APAC - Other' ? 'APAC' : edge.node.value === 'EMEA - Other' ? 'EMEA' : edge.node.value}
                      </p>}
                    </div> : "")
                )
              )
            }
          </div>

          <div>
            {
              product.customFields?.edges?.map((edge) =>
                edge && (
                  (edge.node.name === "Segment" ?
                    <div>
                      <p className=' px-2 py-1 mt-1 mr-1 border-transparent  rounded-full bg-sky-100'>{edge.node.value} </p>
                    </div> : "")
                )
              )
            }
          </div>

          <div>
            {
              product.customFields?.edges?.map((edge) =>
                edge && (
                  (edge.node.name === "Presentation" ?
                    <div>
                      <p className='px-2 py-1 mt-1 mr-1 border-transparent  rounded-full bg-slate-100'>{edge.node.value} </p>
                    </div> : "")
                )
              )
            }
          </div>
          <div>
            {
              product.customFields?.edges?.map((edge) =>
                edge && (
                  (edge.node.name === "Channel" && edge.node.value !== "Marketplaces" && edge.node.value !== "na" ?
                    <div>
                      <p className='px-2 py-1 mt-1 mr-2 border-transparent rounded-full bg-lime-100'>{edge.node.value}</p>
                    </div> : "")
                )
              )
            }
          </div>



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
        <div className="flex flex-wrap items-end justify-between pt-2">
          <ProductCardInfoPrice>
            <Pricing data={product} />
          </ProductCardInfoPrice>

          {/*  {showCompare && (
            <Compare
              productId={product.entityId}
              productImage={product.defaultImage}
              productName={product.name}
            />
          )} */}
        </div>
      </ProductCardInfo>
      {/* {showCart && <AddToCart data={product} />} */}
    </ComponentsProductCard>
  );
};

import { FragmentOf, graphql } from '~/client/graphql';

import { BcImage } from '../bc-image';
import Logo from '~/components/custom-icons/custom_logo';


export const StoreLogoFragment = graphql(`
  fragment StoreLogoFragment on Settings {
    storeName
    logoV2 {
      __typename
      ... on StoreTextLogo {
        text
      }
      ... on StoreImageLogo {
        image {
          url: urlTemplate
          altText
        }
      }
    }
  }
`);

interface Props {
  data: FragmentOf<typeof StoreLogoFragment>;
}

export const StoreLogo = ({ data }: Props) => {
  const { logoV2: logo, storeName } = data;

  if (logo.__typename === 'StoreTextLogo') {
    return <span className="truncate text-2xl font-black">{logo.text}</span>;
  }

  return (

    /* <BcImage
     alt={logo.image.altText ? logo.image.altText : storeName}
     className="max-h-16 object-contain"
     height={50}
     priority
     src={logo.image.url}
     width={210}
   />  */

    //for custom logo use below
    <Logo width="180" height="70" />
  );
};

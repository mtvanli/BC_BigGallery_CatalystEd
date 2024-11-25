// this is not in use -yet - I initially thought getting merchant details using GraphQL. 
// GraphQL is not returning back search keywords , at leaast at the time when I was building this

'use server'

import { graphql } from '~/client/graphql'
import { client } from '~/client'
import { revalidate } from '~/client/revalidate-target'

const GetMerchantsQuery = graphql(`
  query GetProductNames($after: String) {
    site {
      products(first: 50, after: $after) {
        edges {
          node {
            name
            description
            customFields {
            edges {
              node{
                name
                value
              }
            }
          }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`);

export async function getMerchantsData() {
  let allProducts = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const response = await client.fetch({
      document: GetMerchantsQuery,
      variables: { after: cursor },
      fetchOptions: { next: { revalidate } },
    });

    const productsData = response?.data?.site?.products;

    if (!productsData) {
      console.error("Unexpected response structure:", response);
      return { products: { edges: [] } }; // Return a consistent fallback structure
    }

    const { edges, pageInfo } = productsData;

    allProducts = [...allProducts, ...edges.map((edge) => edge.node)];
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

   // Sort all products alphabetically by name, case-insensitively
    allProducts.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.toLowerCase()));

  return { products: { edges: allProducts.map((product) => ({ node: product })) } };
}
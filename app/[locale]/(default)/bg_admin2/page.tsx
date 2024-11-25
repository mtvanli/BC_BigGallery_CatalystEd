import { NextIntlClientProvider } from 'next-intl';
import { revalidate } from '~/client/revalidate-target';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { cache } from 'react';
import { getSessionCustomerId } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import BG_AdminPage from '~/app/[locale]/(default)/bg_admin/page'
import BG_Admin from '~/app/[locale]/(default)/bg_admin2/admin_main'

const GetCustomerGroup = graphql(`
  query GetCustomerGroup {
    customer{
      customerGroupId
    }
  }
`);

const getCustomerGroup = async () => {
    const customerId = await getSessionCustomerId();
    
    console.log(customerId)
    
      // Ensure we have a valid customer ID before proceeding
    if (!customerId) {
    console.error("Customer ID not found");
    return <p>You don't have access to the admin page</p>;
    }

    try {

        const {data}  = await client.fetch({
            document: GetCustomerGroup,
            fetchOptions: customerId ? { cache: 'no-store' } : { next: { revalidate } },
            customerId,
          });
        
        // Check if data.customer exists and if customerGroupId is 1
        if (data?.customer && data.customer.customerGroupId === 1) {
          return <BG_Admin />;
        } else {
          return <p>You don't have access to the admin page</p>;
        }


    } catch (error) {
    console.error("Error fetching customer group:", error);
    return <p>Error retrieving customer group information</p>;
    }
  
} 

export default getCustomerGroup
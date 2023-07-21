import getCurrentUser from '@/app/actions/getCurrentUser';
import getListingById from '@/app/actions/getListingById'
import EmptyState from '@/app/components/EmptyState';
import React from 'react'
import ListingClient from './ListingClient';
interface Iparams{
    listingId?:string;
}
const ListingPage = async ({params}:{params:Iparams}) => {
    const listing = await getListingById(params);
    const currentUser = await getCurrentUser();

    if(!listing){
        return (
            <EmptyState />
        );
    }
  return (
    <div>
        <ListingClient listing={listing} currentUser={currentUser} />    
    </div>
  )
}

export default ListingPage
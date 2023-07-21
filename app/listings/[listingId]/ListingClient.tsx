'use client'
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import { categories } from "@/app/components/navbar/Categories";
import { SafeUser } from "@/app/types";
import { Reservation, Listing } from "@prisma/client";
import { useMemo } from "react";
interface ListingClientProps {
  reservation?: Reservation[];
  listing: Listing & { user: SafeUser };
  currentUser: SafeUser | null;
}
const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  currentUser,
}) => {
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-6">
        <ListingHead
          title={listing.title}
          imageSrc={listing.imageSrc}
          locationValue={listing.locationValue}
          id={listing.id}
          currentUser={currentUser}
        />

        <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
          <ListingInfo 
            user={listing.user}
            category={category}
            guestCount={listing.guestCount}
            description={listing.description}
            roomCount={listing.roomCount}
            bathroomCount={listing.bathroomCount}
            locationValue={listing.locationValue}

          />
        </div>
      </div>
    </div>
  );
};
export default ListingClient;

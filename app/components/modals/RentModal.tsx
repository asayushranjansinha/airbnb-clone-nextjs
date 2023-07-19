"use client";
import { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import useRentModal from "@/app/hooks/useRentModal";
import CountrySelect from "../inputs/CountrySelect";
import Map from "../Map";
import dynamic from "next/dynamic";

// Steps in listing the property for rent
enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

// Rent Modal functional Component
const RentModal = () => {
  const rentModal = useRentModal();

  // current currentStep in registering rent property
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imgSrc: "",
      price: 1,
      title: "",
      description: "",
    },
  });
  const selectedCategory = watch("category");
  const selectedLocation = watch("location");

  // Takes to previous step
  const handleBackNavigation = () => {
    setCurrentStep((currStep) => currStep - 1);
  };
  // Takes to next step
  const handleNextNavigation = () => {
    setCurrentStep((currStep) => currStep + 1);
  };

  const actionLabel = useMemo(() => {
    if (currentStep === STEPS.PRICE) {
      return "Create";
    }
    return "Next";
  }, [currentStep]);

  const secondaryActionLabel = useMemo(() => {
    if (currentStep === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [currentStep]);

  const setFormValue = (field: keyof FieldValues, value: any) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const Map = useMemo(
    () => dynamic(() => import("../Map"), { ssr: false }),
    [selectedLocation]
  );

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-3 md:max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(selectedCategory) =>
                setFormValue("category", selectedCategory)
              }
              selected={selectedCategory === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (currentStep === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          onChange={(selectedLocation) =>
            setFormValue("location", selectedLocation)
          }
          value={selectedLocation}
        />
        <Map center={selectedLocation?.latlng} />
      </div>
    );
  }
  return (
    <Modal
      isOpen={rentModal.isOpen}
      title="Airbnb Your Home"
      onClose={rentModal.onClose}
      onSubmit={handleNextNavigation}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={
        currentStep === STEPS.CATEGORY ? undefined : handleBackNavigation
      }
      body={bodyContent}
    />
  );
};

export default RentModal;

"use client";
import { useMemo, useState } from "react";
import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import useRentModal from "@/app/hooks/useRentModal";
import CountrySelect from "../inputs/CountrySelect";
import Counter from "../inputs/Counter";
import dynamic from "next/dynamic";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  // current currentStep in registering rent property
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

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
  const guestCount = watch("guestCount");
  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const imageSrc = watch("imageSrc");

  // Takes to previous step
  const handleBackNavigation = () => {
    setCurrentStep((currStep) => currStep - 1);
  };
  // Takes to next step
  const handleNextNavigation = () => {
    setCurrentStep((currStep) => currStep + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (currentStep !== STEPS.PRICE) {
      return handleNextNavigation();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Listing created!");
        router.refresh();
        reset();
        setCurrentStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (currentStep === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />

        <hr />

        <Counter
          title="Guests"
          subtitle="How many Guests allowed?"
          value={guestCount}
          onChange={(value) => setFormValue("guestCount", value)}
        />

        <hr />

        <Counter
          title="Rooms"
          subtitle="How many Rooms do you have?"
          value={roomCount}
          onChange={(value) => setFormValue("roomCount", value)}
        />

        <hr />

        <Counter
          title="Bathrooms"
          subtitle="How many Bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setFormValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (currentStep === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          onChange={(value) => setFormValue("imageSrc", value)}
          value={imageSrc}
        />
      </div>
    );
  }

  if (currentStep === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (currentStep === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }
  return (
    <Modal
      isOpen={rentModal.isOpen}
      title="Airbnb Your Home"
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
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

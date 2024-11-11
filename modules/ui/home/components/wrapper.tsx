"use client"
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import OfferCard from "./OfferCard";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MiddleCards from "./middle-cards";
import PrescriptionUploader, { Prescription } from "./middle-cards/Prescription";
import OrderCard from "./recent-orders";
import { PageSkeleton } from "@/common/Skelaton/PageSkeleton";

interface Props {
    offerData: any[];
    filterData: any[];
    selectedFilter: string;
    handleFilterSelect: (filter: string) => void;
    filterComponents: { [key: string]: React.ComponentType<any> };
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    openModal: (prescription: Prescription) => void;
    closeModal: () => void;
    updatePrescriptionNotes: (id: string, notes: string) => void;
    isUploading: boolean;
    uploadProgress: number;
    prescriptions: Prescription[];
    selectedPrescription: Prescription | null;
    deletePrescription: (id: string) => void;
    orders: any[];
    isLoading: boolean;
}

const HomeWrapper: React.FC<Props> = (props) => {
    const { offerData, filterData, handleFilterSelect, orders, isLoading } = props;
    if(isLoading) return <PageSkeleton />
    return (
        <div className="flex flex-col gap-3 w-full px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
            <section className="w-full">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={8}
                    slidesPerView={1}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    className="rounded-md overflow-hidden shadow-sm"
                >
                    {offerData.map((offer) => (
                        <SwiperSlide key={offer.id} className="flex justify-center items-center">
                            <OfferCard {...offer} gradientStart={offer?.gradientStart} gradientEnd={offer?.gradientEnd} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            <section className="mt-3">
                <PrescriptionUploader {...props} orderFromPrescription={() => {}} />
            </section>

            <section className="mt-3">
                <MiddleCards filters={filterData} onFilterSelect={handleFilterSelect} {...props} />
            </section>

            <section className="mt-4">
                <h2 className="text-lg font-bold flex items-center mb-2">
                    Your Orders 
                    <span className="ml-2 text-xs text-white bg-blue-600 px-1.5 py-0.5 rounded-full">
                        {orders.length}
                    </span>
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">   
                    {orders.map((order: any, index: number) => (
                        <OrderCard key={index} order={order} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeWrapper;

"use client"
import React, { useState } from 'react';
import PrescriptionSwiper from './PreviousPresciption';
import AllOrders from './AllOrders';
import { Button } from "@/components/ui/button";
import { Filter, FileText, ShoppingBag } from 'lucide-react';
import FilterModal from './FilterModal';

const OrderWrapper = () => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleApplyFilter = (startDate: Date | undefined, endDate: Date | undefined) => {
        // Pass this function to AllOrders component
        console.log('Applying filter:', { startDate, endDate });
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-8">
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-800">
                    <FileText className="mr-2 h-6 w-6 text-blue-600" />
                    Recent Prescriptions
                </h2>
                <PrescriptionSwiper />
            </section>
            
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold flex items-center text-gray-800">
                        <ShoppingBag className="mr-2 h-6 w-6 text-green-600" />
                        Order History
                    </h2>
                    <Button
                        onClick={() => setIsFilterModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                    >
                        <Filter className="mr-2 h-4 w-4" />
                        Filter Orders
                    </Button>
                </div>
                <AllOrders onApplyFilter={handleApplyFilter} />
            </section>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilter={handleApplyFilter}
            />
        </div>
    );
};

export default OrderWrapper;
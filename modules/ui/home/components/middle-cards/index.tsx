import Consultation from "./Consultation";
import React from "react";
import Filters from "./Filters";
import { Prescription } from "./Prescription";

interface FiltersProps {
    filters: any[];
    selectedFilter: string;
    onFilterSelect: (filter: string) => void;
    filterComponents: { [key: string]: React.ComponentType<any> };
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    openModal: (prescription: Prescription) => void;
    closeModal: () => void;
    updatePrescriptionNotes: (id: string, notes: string) => void;
    isUploading: boolean;
    uploadProgress: number;
    prescriptions: Prescription[];
    selectedPrescription: Prescription | null;
}

const MiddleCards: React.FC<FiltersProps> = (props) => {
    const { filters, selectedFilter, onFilterSelect, filterComponents } = props;
    return (
        <div className="w-full h-auto flex flex-col gap-2">
            <Filters
                filters={filters}
                selectedFilter={selectedFilter}
                onFilterSelect={onFilterSelect}
            />
            <h1 className="text-xl font-semibold capitalize">{selectedFilter}</h1>
            {React.createElement(filterComponents[selectedFilter], props)}
        </div>
    )
}

export default MiddleCards;
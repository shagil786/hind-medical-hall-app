"use client"
import React from "react";
import { offerData, filterData, orders } from "@/public/assets/data";
import Consultation from "../components/middle-cards/Consultation";
import PrescriptionUploader, { Prescription } from "../components/middle-cards/Prescription";
import RecentPrescription from "../components/middle-cards/RecentPrescription";
import Medicine from "../components/middle-cards/Medicine";

const HomeController = (props: any) => {
    const { children, ...rest } = props;
    const [selectedFilter, setSelectedFilter] = React.useState<string>(filterData[0].id);
    const [isUploading, setIsUploading] = React.useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = React.useState<number>(0);
    const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
    const [selectedPrescription, setSelectedPrescription] = React.useState<Prescription | null>(null);


    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
    }

    const filterComponents: { [key: string]: React.ComponentType<any> } = {
        consultation: Consultation,
        prescription: RecentPrescription,
        medicine: Medicine,
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        console.log(files, "files")
        if (files) {
            setIsUploading(true);
            // Simulate file upload
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    const newPrescriptions = Array.from(files).map(file => ({
                        id: Math.random().toString(36).substr(2, 9),
                        file
                    }));
                    setPrescriptions(prev => [...prev, ...newPrescriptions]);
                    setUploadProgress(0);
                }
            }, 200);
        }
    };

    const openModal = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
    };

    const closeModal = () => {
        setSelectedPrescription(null);
    };

    const updatePrescriptionNotes = (id: string, notes: string) => {
        setPrescriptions(prev =>
            prev.map(p => p.id === id ? { ...p, notes } : p)
        );
        closeModal();
    };

    const deletePrescription = (id: string) => {
        setPrescriptions(prev => prev.filter(p => p.id !== id));
    };

    const viewProps = {
        offerData,
        filterData,
        selectedFilter,
        handleFilterSelect,
        filterComponents,
        handleFileChange,
        openModal,
        closeModal,
        updatePrescriptionNotes,
        isUploading,
        uploadProgress,
        prescriptions,
        selectedPrescription,
        deletePrescription,
        orders,
        isLoading: false
    }

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { ...rest, ...viewProps });
        }
        return child;
    });

    return <>{childrenWithProps}</>;
};

export { HomeController };
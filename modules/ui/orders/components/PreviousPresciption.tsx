"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Eye, Download, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
}

const generateFakePrescription = (id: number): Prescription => {
  const medicines: Medicine[] = [
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily' },
    { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for pain' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
  ];

  return {
    id: `prescription-${id}`,
    doctorName: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    medicines: medicines.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
  };
};

const PrescriptionCard: React.FC<{ 
  prescription: Prescription; 
  index: number;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
  onPreview: (prescription: Prescription) => void;
}> = ({ prescription, index, onDelete, onDownload, onPreview }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <Card className="h-[220px] bg-white shadow-md hover:shadow-xl transition-all duration-300 relative rounded-xl overflow-hidden border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Prescription
          </span>
          <Badge variant="secondary" className="text-xs bg-white/20 text-white">
            {prescription.doctorName}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2 h-[130px] overflow-y-auto">
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="mr-2 h-3 w-3" />
          <span>{prescription.date}</span>
        </div>
        <h3 className="font-semibold text-sm mb-1 text-indigo-700">Medicines:</h3>
        <ul className="list-disc pl-4 space-y-1 text-xs">
          {prescription.medicines.slice(0, 2).map((medicine, idx) => (
            <li key={idx} className="text-gray-700">
              <span className="font-medium">{medicine.name}</span> - {medicine.dosage}
            </li>
          ))}
          {prescription.medicines.length > 2 && (
            <li className="text-indigo-500 font-medium">+ {prescription.medicines.length - 2} more</li>
          )}
        </ul>
      </CardContent>
      <div className="absolute bottom-3 right-3 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-blue-500 hover:bg-blue-600 text-white p-0 w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => onPreview(prescription)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-green-500 hover:bg-green-600 text-white p-0 w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => onDownload(prescription.id)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-red-500 hover:bg-red-600 text-white p-0 w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => onDelete(prescription.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  </motion.div>
);

const PrescriptionCardSkeleton: React.FC = () => (
  <Card className="h-[220px] bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 py-2 px-3">
      <CardTitle className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </CardTitle>
    </CardHeader>
    <CardContent className="p-3 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-gradient-to-t from-white via-white to-transparent pt-4">
      {[1, 2, 3].map((_, index) => (
        <Skeleton key={index} className="w-8 h-8 rounded-full" />
      ))}
    </div>
  </Card>
);

const PrescriptionSwiper: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);

  const fetchPrescriptions = async (offset: number) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newPrescriptions = Array.from({ length: 10 }, (_, i) => generateFakePrescription(offset + i));
    setLoading(false);
    return newPrescriptions;
  };

  useEffect(() => {
    fetchPrescriptions(0).then(setPrescriptions);
  }, []);

  const handleReachEnd = async () => {
    if (!loading) {
      const newPrescriptions = await fetchPrescriptions(prescriptions.length);
      setPrescriptions(prev => [...prev, ...newPrescriptions]);
    }
  };

  const handleDelete = (id: string) => {
    setPrescriptions(prev => prev.filter(p => p.id !== id));
    // Here you would typically make an API call to delete the prescription
    console.log(`Deleting prescription ${id}`);
  };

  const handleDownload = (id: string) => {
    // Here you would typically trigger the download of the prescription
    console.log(`Downloading prescription ${id}`);
  };

  const handlePreview = (prescription: Prescription) => {
    setPreviewPrescription(prescription);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg"
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        onReachEnd={handleReachEnd}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
        }}
      >
        {loading && prescriptions.length === 0 ? (
          // Show skeletons when initially loading
          Array.from({ length: 3 }).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
              <PrescriptionCardSkeleton />
            </SwiperSlide>
          ))
        ) : (
          // Show actual prescription cards
          prescriptions.map((prescription, index) => (
            <SwiperSlide key={prescription.id}>
              <PrescriptionCard 
                prescription={prescription} 
                index={index} 
                onDelete={handleDelete}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            </SwiperSlide>
          ))
        )}
        {loading && prescriptions.length > 0 && (
          // Show a single skeleton card when loading more
          <SwiperSlide>
            <PrescriptionCardSkeleton />
          </SwiperSlide>
        )}
      </Swiper>

      {/* Prescription Preview Modal */}
      <Dialog open={!!previewPrescription} onOpenChange={() => setPreviewPrescription(null)}>
        <DialogContent className="w-11/12 rounded-xl p-4 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <DialogHeader className="border-b border-gray-200 py-2">
            <DialogTitle>Prescription Preview</DialogTitle>
          </DialogHeader>
          {previewPrescription && (
            <div>
              <p>Doctor: {previewPrescription.doctorName}</p>
              <p>Date: {previewPrescription.date}</p>
              <h3>Medicines:</h3>
              <ul>
                {previewPrescription.medicines.map((medicine, index) => (
                  <li key={index}>
                    {medicine.name} - {medicine.dosage} ({medicine.frequency})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PrescriptionSwiper;
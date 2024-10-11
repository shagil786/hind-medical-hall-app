import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Eye, Download, Trash2, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  imageUrl: string;
  medicines: Medicine[];
}

const RecentPrescriptions: React.FC = () => {

  const prescriptions: Prescription[] = [
    {
      id: '1',
      doctorName: 'Dr. Smith',
      date: '2023-05-15',
      imageUrl: '/prescriptions/prescription1.jpg',
      medicines: [
        { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily' },
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed for pain' },
      ]
    },
    {
      id: '2',
      doctorName: 'Dr. Johnson',
      date: '2023-06-02',
      imageUrl: '/prescriptions/prescription2.jpg',
      medicines: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime' },
      ]
    },
    // Add more prescriptions as needed
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl"
    >
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="w-full max-w-md mx-auto"
      >
        {prescriptions.map((prescription, index) => (
          <SwiperSlide key={prescription.id}>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> 
                    Prescription
                  </span>
                  <Badge variant="secondary" className="text-xs bg-white/30 text-white px-2 py-1">
                    {prescription.doctorName}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                  <span>{prescription.date}</span>
                </div>
                <h3 className="font-semibold text-md text-indigo-700">Medicines:</h3>
                <ul className="space-y-2">
                  {prescription.medicines.slice(0, 2).map((medicine, idx) => (
                    <li key={idx} className="bg-indigo-50 rounded-lg p-2 text-sm">
                      <span className="font-medium text-indigo-700">{medicine.name}</span>
                      <div className="text-gray-600 mt-1">
                        <span className="mr-2">{medicine.dosage}</span>•
                        <span className="ml-2">{medicine.frequency}</span>
                      </div>
                    </li>
                  ))}
                  {prescription.medicines.length > 2 && (
                    <li className="text-indigo-500 font-medium text-sm flex items-center">
                      + {prescription.medicines.length - 2} more
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default RecentPrescriptions;
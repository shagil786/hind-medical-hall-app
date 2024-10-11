import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Edit2, Trash2, File, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import PrescriptionModal from './PrescriptionModal';

export interface Prescription {
  id: string;
  file: File;
  notes?: string;
}

interface Props {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openModal: (prescription: Prescription) => void;
  closeModal: () => void;
  updatePrescriptionNotes: (id: string, notes: string) => void;
  isUploading: boolean;
  uploadProgress: number;
  prescriptions: Prescription[];
  selectedPrescription: Prescription | null;
  deletePrescription: (id: string) => void;
  orderFromPrescription: (id: string) => void;
}

const PrescriptionUploader: React.FC<Props> = (props) => {
  const { handleFileChange, openModal, closeModal, updatePrescriptionNotes, isUploading, uploadProgress, prescriptions, selectedPrescription, deletePrescription, orderFromPrescription } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 flex flex-col space-y-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-indigo-800">Prescriptions</h3>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*,.pdf"
        />
        <Button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>

      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Progress value={uploadProgress} className="w-full h-2 bg-indigo-100" />
            <p className="text-xs text-indigo-600 mt-1">Uploading: {uploadProgress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!!prescriptions?.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {prescriptions?.map(prescription => (
            <motion.div
              key={prescription.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-indigo-500" />
                      <p className="text-sm font-medium truncate max-w-[120px]">{prescription.file.name}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openModal(prescription)} className="p-1 hover:bg-indigo-100">
                        <Edit2 className="h-4 w-4 text-indigo-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePrescription(prescription.id)} className="p-1 hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {prescription.notes && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 truncate">{prescription.notes}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => orderFromPrescription(prescription.id)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Order
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedPrescription && (
        <PrescriptionModal
          prescription={selectedPrescription}
          onClose={closeModal}
          onSave={updatePrescriptionNotes}
        />
      )}
    </div>
  );
};

export default PrescriptionUploader;

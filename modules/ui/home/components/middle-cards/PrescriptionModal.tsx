import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileIcon } from "lucide-react";

interface PrescriptionModalProps {
  prescription: {
    id: string;
    file: File;
    notes?: string;
  };
  onClose: () => void;
  onSave: (id: string, notes: string) => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose, onSave }) => {
  const [notes, setNotes] = useState(prescription.notes || '');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-11/12 md:max-w-1/2 rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Prescription Notes</DialogTitle>
          <DialogDescription>Add or modify notes for the uploaded prescription file.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-md">
            <FileIcon className="w-6 h-6 text-gray-500" />
            <span className="text-sm font-medium truncate">{prescription.file.name}</span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes here..."
              className="h-32"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end flex-row space-x-2">
          <Button className='w-fit' variant="outline" onClick={onClose}>Cancel</Button>
          <Button className='w-fit' onClick={() => onSave(prescription.id, notes)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionModal;

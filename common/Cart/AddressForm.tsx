import React from 'react';
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from 'framer-motion';
import { AddressFormInputs, addressFields } from './AddressModalTypes';

interface AddressFormProps {
  register: UseFormRegister<AddressFormInputs>;
  errors: FieldErrors<AddressFormInputs>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({ register, errors, onSubmit, onClose }) => {
  return (
    <form onSubmit={onSubmit}>
      {addressFields.map((field) => (
        <motion.div
          key={field.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: addressFields.indexOf(field) * 0.1 }}
        >
          <Input
            className="mb-2"
            placeholder={field.placeholder}
            {...register(field.name as keyof AddressFormInputs, { required: field.required })}
          />
          {errors[field.name as keyof AddressFormInputs] && (
            <p className="text-red-500 text-sm mb-2">{errors[field.name as keyof AddressFormInputs]?.message}</p>
          )}
        </motion.div>
      ))}

      <div className="flex justify-end space-x-2 mt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Save Address</Button>
        </motion.div>
      </div>
    </form>
  );
};

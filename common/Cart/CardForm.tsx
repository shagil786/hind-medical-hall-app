import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, User, Calendar, Lock } from 'lucide-react';

interface CardFormProps {
  onClose: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({ onClose }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Card details submitted');
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-lg shadow-2xl max-w-md w-full mx-auto"
    >
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-inner h-56 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-sm"></div>
          <div className="absolute top-4 right-4 w-12 h-8">
            <svg viewBox="0 0 48 32" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              <path fill="#fff" d="M44 0H4C1.8 0 0 1.8 0 4v24c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zm0 28H4V4h40v24z"/>
              <path fill="#fff" d="M16 21.3l-4-4 4-4 1.4 1.4-2.6 2.6 2.6 2.6zM32 21.3l-1.4-1.4 2.6-2.6-2.6-2.6L32 13.3l4 4z"/>
            </svg>
          </div>
          <div className="absolute bottom-20 left-6 right-6">
            <div className="font-mono text-lg text-white mb-4">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <div className="text-md text-gray-400 mb-1">Card Holder</div>
              <div className="font-mono text-sm text-white uppercase">
                {cardName || 'YOUR NAME'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Expires</div>
              <div className="font-mono text-white">
                {expiry || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium mb-1 text-white">Card Number</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              required
              className="pl-10"
              maxLength={19}
            />
          </div>
        </div>
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium mb-1 text-white">Cardholder Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="JOHN DOE"
              required
              className="pl-10 uppercase"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="expiry" className="block text-sm font-medium mb-1 text-white">Expiry Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="expiry"
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
                className="pl-10"
                maxLength={5}
              />
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block text-sm font-medium mb-1 text-white">CVV</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="cvv"
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
                className="pl-10"
                maxLength={3}
              />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-gray-100">
          Submit
        </Button>
      </form>
    </motion.div>
  );
};
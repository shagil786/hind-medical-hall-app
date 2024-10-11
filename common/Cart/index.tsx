"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Minus, MapPin, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '@/provider/cartProvider';
import { Address, useAddress } from '@/provider/addressProvider';
import AddressModal from './AddressModal';
import { PaymentModal } from './PaymentModal';
import { useAuth } from '@/provider/authProvider';
import { AuthModal } from '@/common/AuthModal/AuthModal';
import Image from 'next/image';
import { useSafeArea } from '@/provider/safeAreaProvider';

interface CartItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  // ... any other properties you might have
}

const cartVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 500,
    }
  },
  exit: { 
    y: '100%', 
    opacity: 0,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 500,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalCount, showCart, setShowCart } = useCart();
  const { address, setAddress } = useAddress();
  const { user } = useAuth();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const {show, handleShow} = useAuth()

  const handleClose = () => setShowCart(false);
  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handleSaveAddress = (newAddress: Address) => {
    setAddress(newAddress);
    setShowAddressModal(false);
    console.log('Address saved:', newAddress);
  };

  const {safeAreaClasses} = useSafeArea();

  const handlePaymentMethodSelect = (method: string) => {
    console.log(`Selected payment method: ${method}`);
    // Add logic to handle the selected payment method
  };

  const isCheckoutDisabled = items.length === 0 || !address;

  return (
    <>
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 z-50 overflow-hidden"
          >
            <div className={`h-full flex flex-col ${safeAreaClasses} pad-top pad-bottom`}>
              <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Your Cart</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={28} />
                </motion.button>
              </div>

              <ScrollArea className="flex-grow px-6 py-8">
                {!user && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                  >
                    <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
                      Log in for exclusive offers and personalized recommendations!
                    </p>
                    <Button
                      onClick={() => handleShow()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                    >
                      Log In
                    </Button>
                  </motion.div>
                )}

                <AnimatePresence>
                  {(items as CartItem[]).map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      layout
                      className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center"
                    >
                      <Image
                        src={item?.image || '/placeholder.png'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">${item.price.toFixed(2)}</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="rounded-full w-8 h-8 p-0"
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="font-semibold text-lg w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="rounded-full w-8 h-8 p-0"
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-4"
                      >
                        <Trash2 size={20} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>

              <div className="p-6 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">Total:</span>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">${totalCount.toFixed(2)}</span>
                </div>

                <Button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full mb-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
                >
                  <MapPin className="mr-2" size={20} />
                  {address ? 'Change Address' : 'Add Address'}
                </Button>

                {address && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center"
                  >
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
                    <p 
                      className="text-sm text-gray-600 dark:text-gray-300 truncate"
                      title={`${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`}
                    >
                      {`${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`}
                    </p>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckoutDisabled}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 py-3 text-lg"
                  >
                    Proceed to Checkout <ArrowRight className="ml-2" size={20} />
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="w-full py-3 text-lg"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            onClose={() => setShowPaymentModal(false)}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            totalAmount={totalCount}
            clearCart={clearCart}
          />
        )}
      </AnimatePresence>

      {showAddressModal && (
        <AddressModal 
          onClose={() => setShowAddressModal(false)}
          onSave={handleSaveAddress}
        />
      )}

      <AnimatePresence>
        {show && (
          <AuthModal />
        )}
      </AnimatePresence>
    </>
  );
};
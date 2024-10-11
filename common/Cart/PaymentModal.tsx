import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, CreditCard, Smartphone, Gift, QrCode, ChevronRight, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { CardForm } from './CardForm';
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
    onClose: () => void;
    onPaymentMethodSelect: (method: string) => void;
    totalAmount: number;
    clearCart: () => void; // Add this prop
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentMethodSelect, totalAmount, clearCart }) => {
    const [promoCode, setPromoCode] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');
    const [showCardForm, setShowCardForm] = useState(false);
    const [selectedUPI, setSelectedUPI] = useState('');
    const [upiId, setUpiId] = useState('');
    const [width, setWidth] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const [isComplete, setIsComplete] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (sliderRef.current) {
            setWidth(sliderRef.current.offsetWidth - 64);
        }
    }, []);

    const paymentMethods = [
        { id: 'cod', name: 'Cash on Delivery', icon: <CreditCard className="w-4 h-4 mr-2" /> },
        { id: 'upi', name: 'UPI', icon: <Smartphone className="w-4 h-4 mr-2" /> },
        { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-4 h-4 mr-2" /> },
        { id: 'qr', name: 'QR Code Payment', icon: <QrCode className="w-4 h-4 mr-2" /> },
    ];

    const upiOptions = [
        { id: 'googlepay', name: 'Google Pay' },
        { id: 'phonepay', name: 'PhonePe' },
    ];

    const handleMethodSelect = (method: string) => {
        setSelectedMethod(method);
        onPaymentMethodSelect(method);
        if (method === 'card') {
            setShowCardForm(true);
        } else {
            setShowCardForm(false);
        }
        setSelectedUPI('');
        setUpiId('');
    };

    const handleUPISelect = (upi: string) => {
        setSelectedUPI(upi);
    };

    const handleDragEnd = () => {
        if (x.get() > width * 0.75) {
            setIsComplete(true);
            // Simulate payment processing
            setTimeout(() => {
                // Close the payment modal
                onClose();
                // Clear the cart
                clearCart();
                // Show success toast
                toast({
                    title: "Payment Successful",
                    description: "Your order has been placed successfully!",
                    duration: 3000,
                });
                // Perform hard refresh after a short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }, 1500); // Wait for 1.5 seconds after the check mark animation
        } else {
            x.set(0);
        }
    };

    const handleTouchCancel = () => {
        x.set(0);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payment</h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X size={20} />
                            </Button>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <Button
                                        key={method.id}
                                        variant={selectedMethod === method.id ? "default" : "outline"}
                                        className="w-full justify-start"
                                        onClick={() => handleMethodSelect(method.id)}
                                    >
                                        {method.icon}
                                        {method.name}
                                    </Button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {showCardForm && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="mt-4"
                                    >
                                        <CardForm onClose={() => setShowCardForm(false)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {selectedMethod === 'upi' && (
                                <div className="mt-4 space-y-4">
                                    <h3 className="text-lg font-semibold">Select UPI Provider</h3>
                                    <div className="flex gap-2">
                                        {upiOptions.map((upi) => (
                                            <Button
                                                key={upi.id}
                                                variant={selectedUPI === upi.id ? "default" : "outline"}
                                                onClick={() => handleUPISelect(upi.id)}
                                            >
                                                {upi.name}
                                            </Button>
                                        ))}
                                    </div>
                                    {selectedUPI && (
                                        <div className="space-y-2">
                                            <label htmlFor="upiId" className="block text-sm font-medium">Enter UPI ID</label>
                                            <Input
                                                id="upiId"
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="yourname@upi"
                                            />
                                            <Button className="w-full" onClick={() => console.log('Process UPI payment')}>Pay with UPI</Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMethod === 'qr' && (
                                <div className="mt-4 flex justify-center">
                                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                                        QR Code Placeholder
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 space-y-4">
                                <h3 className="text-lg font-semibold">Apply Promo Code</h3>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter promo code"
                                    />
                                    <Button>Apply</Button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button variant="outline" className="w-full">
                                    <Gift className="mr-2" />
                                    Add Gift Card
                                </Button>
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="p-6 bg-gray-100 dark:bg-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</span>
                            <span className="text-2xl font-bold text-gray-800 dark:text-white">₹{totalAmount.toFixed(2)}</span>
                        </div>
                        {selectedMethod && (
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method:</span>
                                <span className="ml-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                    {selectedUPI && ` - ${upiOptions.find(u => u.id === selectedUPI)?.name}`}
                                </span>
                            </div>
                        )}
                        <div ref={sliderRef} className="relative h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full overflow-hidden">
                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: width }}
                                dragElastic={0}
                                dragMomentum={false}
                                className="absolute top-0 left-0 w-16 h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                                style={{ x }}
                                onDragEnd={handleDragEnd}
                                onTouchCancel={handleTouchCancel}
                            >
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <ChevronRight className="w-6 h-6 text-blue-500" />
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                                style={{
                                    opacity: useTransform(x, [0, 50], [1, 0])
                                }}
                            >
                                <span className="text-white font-medium">Slide to pay</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    >
                        <motion.div
                            className="bg-white p-8 rounded-full"
                            initial={{ rotate: 180 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Check className="w-16 h-16 text-green-500" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, RefreshCw, Calendar, Package } from "lucide-react";
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    status: 'Delivered' | 'Shipped' | 'Processing';
    orderDate: string;
}

interface PersonMedicineProps {
    person: any;
}

const Medicine: React.FC<PersonMedicineProps> = ({ person }) => {
    const recentOrders: OrderItem[] = [
        { id: '1', name: 'Aspirin', quantity: 2, price: 9.99, status: 'Delivered', orderDate: '2023-05-15' },
        { id: '2', name: 'Vitamin C', quantity: 1, price: 15.50, status: 'Shipped', orderDate: '2023-05-20' },
        { id: '3', name: 'Allergy Medicine', quantity: 1, price: 12.75, status: 'Processing', orderDate: '2023-05-25' },
        { id: '4', name: 'Bandages', quantity: 3, price: 5.99, status: 'Delivered', orderDate: '2023-05-10' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Delivered': return 'from-green-100 to-green-200 border-green-300';
            case 'Shipped': return 'from-blue-100 to-blue-200 border-blue-300';
            case 'Processing': return 'from-yellow-100 to-yellow-200 border-yellow-300';
            default: return 'from-gray-100 to-gray-200 border-gray-300';
        }
    };

    const getStatusInitial = (status: string) => status[0].toUpperCase();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-0"
        >   
            <Swiper
                modules={[Navigation, Pagination, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1.2}  // Reduced from 1.5 to show more of each card
                spaceBetween={30}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                className="w-full max-w-5xl mx-auto"  // Increased from max-w-4xl to max-w-5xl
            >
                {recentOrders.map((order, index) => (
                    <SwiperSlide key={order.id}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="p-4"
                        >
                            <Card className={`h-full bg-gradient-to-br ${getStatusColor(order.status)} shadow-lg rounded-xl overflow-visible border-2 relative`}>
                                <div className="absolute -top-4 -right-4 z-10">
                                    <Button variant="outline" className="rounded-full w-8 h-8 p-0 border-0 bg-white hover:bg-transparent transition-colors duration-300">
                                        <RefreshCw className="h-5 w-5 text-blue-500" />
                                    </Button>
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="flex items-center justify-between text-lg font-bold">
                                        <span className="flex items-center">
                                            <ShoppingCart className="mr-2 h-5 w-5" /> 
                                            {order.name}
                                        </span>
                                        <span className="text-sm font-semibold px-2 py-1 bg-white rounded-full">
                                            {getStatusInitial(order.status)}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-2 text-sm">
                                    <div className="flex items-center text-gray-700">
                                        <Package className="mr-2 h-4 w-4" />
                                        <span>Qty: {order.quantity}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <span className="font-medium text-lg">${order.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>{order.orderDate}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </motion.div>
    );
};

export default Medicine;
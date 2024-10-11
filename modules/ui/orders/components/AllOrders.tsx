"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, MapPin, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import OrderDetailCard from './OrderDetailCard'; // We'll create this component

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: string;
  orderNumber: string;
  pharmacyName: string;
  productCount: number;
  total: number;
  items: OrderItem[];
}

const generateFakeOrder = (id: number): Order => {
  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const pharmacies = ['MedExpress', 'HealthHub', 'CureAll', 'WellnessPlus', 'VitaPharm'];
  const products = [
    { name: 'Aspirin', price: 5.99 },
    { name: 'Vitamin C', price: 8.99 },
    { name: 'Bandages', price: 3.99 },
    { name: 'Antiseptic Cream', price: 6.99 },
    { name: 'Cough Syrup', price: 7.99 },
  ];

  const items: OrderItem[] = products
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1)
    .map(product => ({
      ...product,
      quantity: Math.floor(Math.random() * 3) + 1,
    }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: `order-${id}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    pharmacyName: pharmacies[Math.floor(Math.random() * pharmacies.length)],
    productCount: items.length,
    total: parseFloat(total.toFixed(2)),
    items,
  };
};

const statusIcons = {
  'Processing': <Clock className="w-4 h-4" />,
  'Shipped': <Truck className="w-4 h-4" />,
  'Delivered': <CheckCircle className="w-4 h-4" />,
  'Cancelled': <XCircle className="w-4 h-4" />,
};

const statusColors = {
  'Processing': 'bg-yellow-100 text-yellow-800',
  'Shipped': 'bg-blue-100 text-blue-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

const OrderCard: React.FC<{ order: Order; onOpenTimeline: (order: Order) => void }> = ({ order, onOpenTimeline }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the parent div
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-white drop-shadow-md border-0 outline-none shadow-inner relative mb-4" onClick={() => onOpenTimeline(order)}>
      <CardContent className="p-3 pb-6">
        {/* Header section */}
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className={`${statusColors[order.status as keyof typeof statusColors]} flex items-center gap-1 px-2 py-1`}>
            {statusIcons[order.status as keyof typeof statusIcons]}
            {order.status}
          </Badge>
          <span className="text-gray-400 text-xs">No. {order.orderNumber}</span>
        </div>
      
        {/* Pharmacy info */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="text-gray-400" size={14} />
          <span className="text-gray-800 text-sm font-medium">{order.pharmacyName}</span>
        </div>
      
        {/* Product count and total */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Package size={14} className="text-gray-400" />
            <span>{order.productCount} item{order.productCount > 1 ? 's' : ''}</span>
          </div>
          <span className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</span>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside the expanded content from opening the timeline
            >
              <div className="pt-3 mt-3 border-t border-gray-100">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center mb-1 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-600">{item.quantity}x</span>
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-gray-800 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-600">Total</span>
                  <span className="text-lg font-bold text-gray-800">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Concave cut-out */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 overflow-hidden">
        <div className="w-10 h-10 bg-gray-100 rounded-full absolute top-3"></div>
      </div>

      {/* Expand/collapse button */}
      <Button
        onClick={handleExpandClick}
        variant="ghost"
        className="w-6 h-6 rounded-full hover:bg-black bg-black p-0 absolute -bottom-3 left-1/2 transform -translate-x-1/2"
      >
        {isExpanded ? (
          <ChevronUp size={18} strokeWidth={3} className="text-white" />
        ) : (
          <ChevronDown size={18} strokeWidth={3} className="text-white" />
        )}
      </Button>
    </Card>
  );
};

const OrderCardSkeleton: React.FC = () => {
  return (
    <Card className="bg-white drop-shadow-md border-0 outline-none shadow-inner relative mb-4">
      <CardContent className="p-3 pb-6">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 overflow-hidden">
        <div className="w-10 h-10 bg-gray-100 rounded-full absolute top-3"></div>
      </div>
      <div className="w-6 h-6 rounded-full bg-gray-200 absolute -bottom-3 left-1/2 transform -translate-x-1/2"></div>
    </Card>
  );
};

interface AllOrdersProps {
  onApplyFilter: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const AllOrders: React.FC<AllOrdersProps> = ({ onApplyFilter }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newOrders = Array.from({ length: 10 }, (_, i) => generateFakeOrder((page - 1) * 10 + i));
    setOrders(prev => [...prev, ...newOrders]);
    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setVisibleOrders(orders.slice(0, 5 * page));
  }, [orders, page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && 
      !loading &&
      visibleOrders.length < orders.length
    ) {
      setPage(prev => prev + 1);
    } else if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && 
      !loading &&
      visibleOrders.length === orders.length
    ) {
      fetchOrders();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, visibleOrders, orders]);

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {visibleOrders.map(order => (
        <div key={order.id} onClick={() => setSelectedOrder(order)}>
          <OrderCard order={order} onOpenTimeline={() => setSelectedOrder(order)} />
        </div>
      ))}
      {loading && (
        <>
          {[...Array(3)].map((_, index) => (
            <OrderCardSkeleton key={`loading-${index}`} />
          ))}
        </>
      )}
      {selectedOrder && (
        <OrderDetailCard
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AllOrders;
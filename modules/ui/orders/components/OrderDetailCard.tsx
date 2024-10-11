"use client"
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { Order } from './AllOrders';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface OrderDetailCardProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailCard: React.FC<OrderDetailCardProps> = ({ order, onClose }) => {
  const timelineItems = [
    { status: 'Processing', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { status: 'Shipped', icon: Truck, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { status: 'Delivered', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-100' },
  ];

  if (order.status === 'Cancelled') {
    timelineItems.push({ status: 'Cancelled', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100' });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-11/12 rounded-xl p-4 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <DialogHeader className="border-b border-gray-200 py-2">
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center">
              <Badge variant="outline" className="text-sm font-medium">
                {order.orderNumber}
              </Badge>
              <Badge variant="secondary" className={`${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 text-xs font-medium`}>
                {order.status}
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin size={16} />
              <span>{order.pharmacyName}</span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Order Timeline</h3>
                  <div className="space-y-4 relative">
                    {timelineItems.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            order.status === item.status ? `${item.color} ${item.bgColor}` : 'text-gray-400 bg-gray-100'
                          }`}>
                            <item.icon size={16} />
                          </div>
                          {index < timelineItems.length - 1 && (
                            <div className="absolute top-8 left-1/2 w-0.5 h-full -ml-px bg-gray-200" />
                          )}
                        </div>
                        <div className="ml-4 flex-1 pt-1">
                          <p className={`font-medium ${
                            order.status === item.status ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {item.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailCard;

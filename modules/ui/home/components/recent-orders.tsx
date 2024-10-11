import React from 'react';
import { ChevronDown, ChevronUp, MapPin, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OrderCard = ({ order }: { order: any }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="bg-white drop-shadow-md border-0 outline-none shadow-inner relative mb-4">
      <CardContent className="p-3 pb-8">
        {/* Header section */}
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
            {order.status}
          </Badge>
          <span className="text-gray-500 text-xs">#{order.orderNumber}</span>
        </div>
      
        {/* Pharmacy info */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="text-blue-500" size={16} />
          <span className="text-gray-800 text-sm font-medium">{order.pharmacyName}</span>
        </div>
      
        {/* Product count and total */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-gray-600 text-xs">
            <Package size={16} className="text-green-500" />
            <span>{order.productCount} products</span>
          </div>
          <span className="text-lg font-bold text-green-600">${order.total.toFixed(2)}</span>
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className=" mt-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{item.quantity}x</span>
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <span className="text-gray-800 font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
                  <span className="text-sm font-bold text-gray-700">Total</span>
                  <span className="text-lg font-bold text-green-600">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      {/* Concave cut-out */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 overflow-hidden">
        <div className="w-10 h-10 bg-gray-100 rounded-full absolute top-4"></div>
      </div>

      {/* Expand/collapse button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="w-7 h-7 rounded-full hover:bg-blue-600 bg-blue-500 p-0 absolute -bottom-3.5 left-1/2 transform -translate-x-1/2 transition-colors duration-300"
      >
        {isExpanded ? (
          <ChevronUp size={18} strokeWidth={2.5} className="text-white" />
        ) : (
          <ChevronDown size={18} strokeWidth={2.5} className="text-white" />
        )}
      </Button>
    </Card>
  );
};

export default OrderCard;

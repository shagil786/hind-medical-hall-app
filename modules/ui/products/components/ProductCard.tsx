import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, Info, ShoppingCart } from 'lucide-react';
import { useCart } from '@/provider/cartProvider';
import { toast } from "@/hooks/use-toast";
import ProductDetailModal from './ProductDetailModal';
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  highlights: string[];
  description: string;
  keyIngredients: string[];
  keyBenefits: string[];
  goodToKnow: string;
  sideEffects: string[];
  directionOfUse: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, updateQuantity, removeItem, items } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const cartItem = items.find(item => item.id === product.id);
    setCartQuantity(cartItem ? cartItem.quantity : 0);
  }, [items, product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, cartQuantity + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="overflow-hidden relative h-full flex flex-col max-w-full" onClick={handleCardClick}>
          <CardContent className="p-0 flex-grow">
            <div className="relative">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
              <Badge 
                variant={product.inStock ? "default" : "destructive"}
                className="absolute top-2 left-2 text-xs"
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-base mb-1 truncate">{product.name}</h3>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.highlights.slice(0, 1).map((highlight, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch p-3 bg-gray-50 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-green-600">${product.price.toFixed(2)}</span>
              {cartQuantity > 0 ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full w-6 h-6 p-0"
                    onClick={decrementQuantity}
                  >
                    <MinusCircle size={14} />
                  </Button>
                  <span className="text-sm font-semibold">{cartQuantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full w-6 h-6 p-0"
                    onClick={incrementQuantity}
                  >
                    <PlusCircle size={14} />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  className="rounded-full text-xs px-2"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <PlusCircle size={14} className="mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
      {isModalOpen && (
        <ProductDetailModal
          product={product}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={(quantity: number) => {
            addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: quantity
            });
            toast({
              title: "Added to cart",
              description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} added to your cart.`,
            });
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Product } from './ProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSafeArea } from '@/provider/safeAreaProvider';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    onAddToCart: (quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const {safeAreaClasses} = useSafeArea();

    const handleAddToCart = () => {
        onAddToCart(quantity);
        onClose();
    };

    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPincode(e.target.value);
        // Simulate delivery time calculation (replace with actual API call)
        if (e.target.value.length === 6) {
            setDeliveryTime('Estimated delivery: 2-3 business days');
        } else {
            setDeliveryTime('');
        }
    };

    const combinedPaddingTop = `calc(var(--inset-top, 0px) + 4rem)`; // 4rem equivalent to pt-16
    const combinedPaddingBottom = `calc(var(--inset-bottom, 0px) + 4rem)`; // 6rem equivalent to pb-24

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className={`w-full ${safeAreaClasses} flex flex-col overflow-y-auto ${combinedPaddingTop} ${combinedPaddingBottom}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                        <p className="text-2xl font-bold text-green-500 mb-4">${product.price.toFixed(2)}</p>
                        <div className="flex items-center mb-4">
                            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder="Qty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button className="ml-2" onClick={handleAddToCart}>Add to Cart</Button>
                        </div>
                        <Input
                            type="text"
                            placeholder="Enter Pincode"
                            value={pincode}
                            onChange={handlePincodeChange}
                            className="w-full mb-2"
                        />
                        {deliveryTime && <p className="text-sm text-gray-600 mb-4">{deliveryTime}</p>}
                    </div>
                </div>
                
                <Tabs defaultValue="description" className="w-full">
                    <TabsList>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="benefits">Benefits</TabsTrigger>
                        <TabsTrigger value="usage">Usage</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        <TabsContent value="description">
                            <h3 className="text-lg font-semibold mb-2">Product Highlights</h3>
                            <ul className="list-disc list-inside mb-4">
                                {product.highlights.map((highlight, index) => (
                                    <li key={index}>{highlight}</li>
                                ))}
                            </ul>
                            <p>{product.description}</p>
                        </TabsContent>
                        <TabsContent value="ingredients">
                            <h3 className="text-lg font-semibold mb-2">Key Ingredients</h3>
                            <ul className="list-disc list-inside">
                                {product.keyIngredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </TabsContent>
                        <TabsContent value="benefits">
                            <h3 className="text-lg font-semibold mb-2">Key Benefits</h3>
                            <ul className="list-disc list-inside mb-4">
                                {product.keyBenefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                            <h3 className="text-lg font-semibold mb-2">Good to Know</h3>
                            <p>{product.goodToKnow}</p>
                        </TabsContent>
                        <TabsContent value="usage">
                            <h3 className="text-lg font-semibold mb-2">Direction of Use</h3>
                            <p className="mb-4">{product.directionOfUse}</p>
                            <h3 className="text-lg font-semibold mb-2">Side Effects</h3>
                            <ul className="list-disc list-inside">
                                {product.sideEffects.map((effect, index) => (
                                    <li key={index}>{effect}</li>
                                ))}
                            </ul>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
                
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ProductDetailModal;
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductCard from './ProductCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
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

const filters = ['All', 'Painkillers', 'Antibiotics', 'Vitamins', 'First Aid'];

const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Aspirin',
    price: 5.99,
    image: '/images/aspirin.jpg',
    inStock: true,
    highlights: [
      'Relieves minor aches and pains',
      'Reduces fever',
      'Anti-inflammatory properties'
    ],
    description: 'Aspirin is a common pain reliever and fever reducer. It\'s often used to treat headaches, menstrual cramps, toothaches, and minor arthritis pain.',
    keyIngredients: ['Acetylsalicylic acid'],
    keyBenefits: [
      'Fast-acting pain relief',
      'Reduces inflammation',
      'Helps prevent heart attacks and strokes in some people'
    ],
    goodToKnow: 'Not recommended for children under 12 due to the risk of Reye\'s syndrome.',
    sideEffects: [
      'Stomach upset',
      'Heartburn',
      'Increased risk of bleeding'
    ],
    directionOfUse: 'Take 1-2 tablets every 4-6 hours with food or milk. Do not exceed 12 tablets in 24 hours unless directed by a doctor.'
  },
  {
    id: '2',
    name: 'Ibuprofen',
    price: 7.99,
    image: '/images/ibuprofen.jpg',
    inStock: false,
    highlights: [
      'Reduces pain and fever',
      'Treats inflammation',
      'Non-drowsy formula'
    ],
    description: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, tenderness, swelling, and stiffness.',
    keyIngredients: ['Ibuprofen'],
    keyBenefits: [
      'Effective pain relief',
      'Reduces inflammation',
      'Helps with menstrual cramps'
    ],
    goodToKnow: 'Should not be taken by people with a history of stomach ulcers or bleeding disorders.',
    sideEffects: [
      'Stomach pain',
      'Nausea',
      'Dizziness',
      'Mild heartburn'
    ],
    directionOfUse: 'Take 1 tablet every 4-6 hours while symptoms persist. Do not exceed 6 tablets in 24 hours unless directed by a doctor.'
  },
  {
    id: '3',
    name: 'Acetaminophen',
    price: 6.49,
    image: '/images/acetaminophen.jpg',
    inStock: true,
    highlights: [
      'Relieves pain and reduces fever',
      'Gentle on the stomach',
      'Safe for most people'
    ],
    description: 'Acetaminophen is a pain reliever and fever reducer used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    keyIngredients: ['Acetaminophen'],
    keyBenefits: [
      'Effective pain relief without anti-inflammatory effects',
      'Reduces fever',
      'Safe for use during pregnancy when used as directed'
    ],
    goodToKnow: 'Liver damage can occur if more than the recommended dose is taken.',
    sideEffects: [
      'Nausea',
      'Stomach pain',
      'Loss of appetite',
      'Allergic reactions (rare)'
    ],
    directionOfUse: 'Take 2 tablets every 4-6 hours while symptoms last. Do not take more than 10 tablets in 24 hours, unless directed by a doctor.'
  },
  {
    id: '4',
    name: 'Allergy Relief Tablets',
    price: 9.99,
    image: '/images/allergy-relief.jpg',
    inStock: true,
    highlights: [
      '24-hour relief from allergy symptoms',
      'Non-drowsy formula',
      'Relieves sneezing, runny nose, and itchy eyes'
    ],
    description: 'These allergy relief tablets provide 24-hour relief from indoor and outdoor allergies, helping you breathe easier and feel more comfortable.',
    keyIngredients: ['Cetirizine HCl'],
    keyBenefits: [
      'Long-lasting relief from allergy symptoms',
      'Improves quality of life during allergy season',
      'Doesn\'t cause drowsiness in most people'
    ],
    goodToKnow: 'May cause mild drowsiness in some individuals. Use caution when driving or operating machinery.',
    sideEffects: [
      'Dry mouth',
      'Tiredness',
      'Headache',
      'Dizziness'
    ],
    directionOfUse: 'Adults and children 6 years and over: take one 10 mg tablet once daily; do not take more than one 10 mg tablet in 24 hours.'
  },
  {
    id: '5',
    name: 'Multivitamin Tablets',
    price: 12.99,
    image: '/images/multivitamin.jpg',
    inStock: true,
    highlights: [
      'Supports overall health and wellness',
      'Contains essential vitamins and minerals',
      'Boosts immune system'
    ],
    description: 'These multivitamin tablets are designed to fill nutritional gaps in your diet and support overall health and well-being.',
    keyIngredients: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'B-complex vitamins', 'Zinc', 'Selenium'],
    keyBenefits: [
      'Supports immune function',
      'Promotes healthy skin and eyes',
      'Aids in energy metabolism',
      'Supports bone health'
    ],
    goodToKnow: 'Not a substitute for a balanced diet and healthy lifestyle.',
    sideEffects: [
      'Mild stomach upset',
      'Unpleasant taste',
      'Constipation (rare)'
    ],
    directionOfUse: 'Take one tablet daily with food, or as directed by your healthcare provider.'
  }
];

interface ProductListingProps {
    pharmacyName: string;
    searchQuery: string;
    showInStock: boolean;
}

const ProductListing: React.FC<ProductListingProps> = ({ pharmacyName, searchQuery, showInStock }) => {
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredProducts = useMemo(() => {
        return dummyProducts.filter(product =>
            (activeFilter === 'All' || product.name.includes(activeFilter)) &&
            (!showInStock || product.inStock) &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [activeFilter, showInStock, searchQuery]);

    return (
        <div className="flex flex-col h-full space-y-4">
            <Tabs defaultValue="All" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-lg">
                    {filters.map(filter => (
                        <TabsTrigger
                            key={filter}
                            value={filter}
                            onClick={() => setActiveFilter(filter)}
                            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                        >
                            {filter}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

                  
            <ScrollArea className="flex-grow !h-[calc(70vh-16rem)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

            {filteredProducts.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-lg">No products found.</p>
                </div>
            )}
        </div>
    );
};

export default ProductListing;

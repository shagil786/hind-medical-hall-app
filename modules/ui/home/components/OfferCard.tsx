import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    title: string;
    description: string;
    image: StaticImageData;
    gradientStart: string;
    gradientEnd: string;
}

const OfferCard: React.FC<Props> = ({ title, description, image, gradientStart, gradientEnd }) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 1000 }}
        >
            <Card 
                className="overflow-hidden rounded-xl relative"
                style={{ background: `linear-gradient(to bottom right, ${gradientStart}, ${gradientEnd})` }}
            >
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">{description}</p>
                    <Image 
                        src={image} 
                        alt={title} 
                        width={150} 
                        height={150} 
                        className="rounded-lg absolute right-0 top-0 bottom-0 m-auto rotate-[220deg] transform-gpu translate-x-8 "
                    />
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default OfferCard;
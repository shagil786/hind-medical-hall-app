import { Video } from "lucide-react";
import React from "react";

interface Consultant {
    id: number;
    name: string;
    rating: number;
    reviews: number;
    imageUrl: string;
}

const ConsultantCard = ({ consultant }: { consultant: Consultant }) => (
  <div className="relative">
    <div className="bg-blue-500 rounded-xl p-4 text-white flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={consultant.imageUrl}
            alt={consultant.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{consultant.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <svg 
                  key={star}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg 
                className="w-4 h-4 text-yellow-400/50 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-sm">{consultant.rating}</span>
            <span className="text-sm text-white/75">|</span>
            <span className="text-sm text-white/75">{consultant.reviews} reviews</span>
          </div>
        </div>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        <Video className="w-5 h-5" />
      </div>
    </div>
    
    <div className="absolute -bottom-2 left-1 right-1 h-14 bg-blue-400 rounded-2xl -z-10 opacity-40"></div>
    <div className="absolute -bottom-4 left-2 right-2 h-14 bg-blue-300 rounded-2xl -z-20 opacity-30"></div>
  </div>
);

export default ConsultantCard;
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "../hooks/useTranslation";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  title?: string;
  content: string;
  productId?: number;
  image?: string;
  videoUrl?: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  product?: {
    id: number;
    name: string;
    images: string[];
  };
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handleVideoPlay = () => {
    setIsVideoLoading(true);
    setShowVideo(true);
    setTimeout(() => setIsVideoLoading(false), 1000);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 p-6 border border-gray-100 dark:border-gray-700">
      {/* Subtle 3D effect with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-pink-50/50 dark:from-rose-900/20 dark:via-transparent dark:to-pink-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Quote icon */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-rose-400 dark:bg-rose-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
        <Quote className="w-4 h-4 text-white" />
      </div>

      <div className="relative z-10">
        {/* Product section */}
        <div className="flex items-center mb-4">
          {testimonial.product?.images?.[0] ? (
            <div className="relative">
              <img
                src={testimonial.product.images[0]}
                alt={testimonial.product.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-rose-200 dark:border-rose-600 shadow-lg transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-rose-300/20 to-pink-300/20 group-hover:from-rose-300/40 group-hover:to-pink-300/40 transition-all duration-500" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-500">
              {testimonial.name.charAt(0)}
            </div>
          )}
          
          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">
              {testimonial.name}
            </h3>
            {testimonial.product?.name ? (
              <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">
                {testimonial.product.name}
              </p>
            ) : testimonial.title && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {testimonial.title}
              </p>
            )}
            <div className="flex items-center mt-1">
              {renderStars(testimonial.rating)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 transform group-hover:translate-x-1 transition-transform duration-300">
            "{testimonial.content}"
          </p>
          
          {/* Video section */}
          {testimonial.videoUrl && (
            <div className="mt-4">
              {!showVideo ? (
                <button
                  onClick={handleVideoPlay}
                  className="w-full relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white py-3 px-4 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="M6.271 5.055a.5.5 0 0 1 .52-.014L11 7.055a.5.5 0 0 1 0 .89L6.791 9.959a.5.5 0 0 1-.791-.389V5.5a.5.5 0 0 1 .271-.445z"/>
                    </svg>
                    Voir le témoignage vidéo
                  </span>
                </button>
              ) : (
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  {isVideoLoading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="w-8 h-8 border-4 border-rose-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <iframe
                    src={testimonial.videoUrl}
                    className="w-full h-48 rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                    onLoad={() => setIsVideoLoading(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3D depth effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/5 to-pink-500/5 transform translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
      </div>
    </div>
  );
};

export default function Testimonials() {
  const { t } = useTranslation();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['/api/testimonials'],
    queryFn: async () => {
      const response = await fetch('/api/testimonials');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-96 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  <div className="ml-4 flex-1">
                    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeTestimonials = testimonials.filter((testimonial: Testimonial) => testimonial.isActive);
  
  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-rose-200 dark:bg-rose-800 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 dark:bg-pink-800 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-rose-300 dark:bg-rose-700 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">
              Témoignages
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-2xl mx-auto">
            Découvrez ce que nos clients pensent de nos produits naturels
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTestimonials
            .sort((a: Testimonial, b: Testimonial) => a.sortOrder - b.sortOrder)
            .map((testimonial: Testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
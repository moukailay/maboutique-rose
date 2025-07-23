import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "../hooks/useTranslation";
import { Star, Quote } from "lucide-react";
import { useState } from "react";
import { TestimonialModal } from "./TestimonialModal";

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

// Function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return url;
  
  // Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url; // Return original if not a YouTube URL
};

const TestimonialCard = ({ testimonial, onOpenModal }: { testimonial: Testimonial; onOpenModal: () => void }) => {
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
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer transform hover:scale-105"
      onClick={onOpenModal}
    >
      {/* Grande image du témoignage (photo client) */}
      {testimonial.image && (
        <div className="relative">
          <img
            src={testimonial.image}
            alt={`Témoignage de ${testimonial.name}`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Contenu */}
      <div className="p-6">
        {/* Informations client */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {testimonial.name.charAt(0)}
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h3>
                <div className="w-4 h-4 ml-2 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {testimonial.title && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {testimonial.title}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center mb-1">
              {renderStars(testimonial.rating)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Texte du témoignage */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {testimonial.content}
          </p>
        </div>

        {/* Réponse de l'entreprise (si applicable) */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-rose-400">
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Rose-d'Éden a répondu:
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.product?.name ? 
              `Merci ${testimonial.name.split(' ')[0]} ! Nous sommes ravis que notre ${testimonial.product.name} vous donne satisfaction. Continuez à prendre soin de vous naturellement ! 🌹` :
              `Merci beaucoup ${testimonial.name.split(' ')[0]} pour ce merveilleux témoignage ! Votre confiance nous encourage à continuer d'offrir les meilleurs produits naturels. 🌿`
            }
          </p>
        </div>

        {/* Nom du produit si disponible */}
        {testimonial.product?.name && (
          <div className="mt-4 flex items-center justify-center">
            <div className="bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
                {testimonial.product.name}
              </span>
            </div>
          </div>
        )}

        {/* Video section */}
        {testimonial.videoUrl && (
          <div className="mt-4">
            {!showVideo ? (
              <button
                onClick={handleVideoPlay}
                className="w-full relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white py-3 px-4 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/btn"
              >
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
                  src={getYouTubeEmbedUrl(testimonial.videoUrl || '')}
                  className="w-full h-48 rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  onLoad={() => setIsVideoLoading(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Testimonials() {
  const { t } = useTranslation();
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        {/* Testimonials grid - Format post/avis */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTestimonials
            .sort((a: Testimonial, b: Testimonial) => a.sortOrder - b.sortOrder)
            .map((testimonial: Testimonial) => (
              <TestimonialCard 
                key={testimonial.id} 
                testimonial={testimonial} 
                onOpenModal={() => {
                  setSelectedTestimonial(testimonial);
                  setIsModalOpen(true);
                }}
              />
          ))}
        </div>
      </div>

      {/* Modal de témoignage */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTestimonial(null);
          }}
        />
      )}
    </section>
  );
}
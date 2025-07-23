import { X, Star } from "lucide-react";

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

interface TestimonialModalProps {
  testimonial: Testimonial;
  isOpen: boolean;
  onClose: () => void;
}

export function TestimonialModal({ testimonial, isOpen, onClose }: TestimonialModalProps) {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image section */}
        <div className="md:w-1/2 flex-shrink-0">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={`Témoignage de ${testimonial.name}`}
              className="w-full h-64 md:h-full object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <div className="text-white text-6xl font-bold">
                {testimonial.name.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h2>
                <div className="w-5 h-5 ml-2 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  Achat vérifié
                </span>
              </div>
            </div>
            
            {testimonial.title && (
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {testimonial.title}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(testimonial.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Review content */}
          <div className="mb-6 flex-1">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {testimonial.content}
            </p>
          </div>

          {/* Company response */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-rose-400 mb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <div className="ml-3">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  Rose-d'Éden
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  a répondu:
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {testimonial.product?.name ? 
                `Merci ${testimonial.name.split(' ')[0]} ! Nous sommes ravis que notre ${testimonial.product.name} vous donne satisfaction. Continuez à prendre soin de vous naturellement ! 🌹` :
                `Merci beaucoup ${testimonial.name.split(' ')[0]} pour ce merveilleux témoignage ! Votre confiance nous encourage à continuer d'offrir les meilleurs produits naturels. 🌿`
              }
            </p>
          </div>

          {/* Video section */}
          {testimonial.videoUrl && (
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={getYouTubeEmbedUrl(testimonial.videoUrl)}
                  className="w-full h-64 rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Vidéo témoignage de ${testimonial.name}`}
                />
              </div>
            </div>
          )}

          {/* Product info */}
          {testimonial.product?.name && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {testimonial.product.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {testimonial.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Produit commenté
                    </p>
                  </div>
                </div>
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Voir le produit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
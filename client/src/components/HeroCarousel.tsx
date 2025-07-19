import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import type { HeroSlide } from '@shared/schema';

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
  });

  // Filter active slides that have images
  const activeSlides = slides.filter(slide => slide.isActive && slide.images && slide.images.length > 0);

  // Auto-advance slides
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      setCurrentImageIndex(0); // Reset image index when changing slides
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlides.length]);

  // Auto-advance images within current slide
  useEffect(() => {
    if (activeSlides.length === 0) return;
    
    const currentSlideData = activeSlides[currentSlide];
    if (!currentSlideData?.images || currentSlideData.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentSlideData.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [activeSlides, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    setCurrentImageIndex(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setCurrentImageIndex(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setCurrentImageIndex(0);
  };

  if (isLoading) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950 animate-pulse rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-64 bg-white/20 rounded mb-4"></div>
            <div className="h-4 w-48 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // If no slides, show default hero
  if (activeSlides.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-rose-800 dark:text-rose-200 mb-4">
              {t('welcome_to')} ROSE-D'ÉDEN
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-rose-600 dark:text-rose-300 mb-8">
              {t('hero_subtitle')}
            </p>
            <Button 
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 text-lg rounded-full"
            >
              {t('discover_products')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden group">
      {/* Slides */}
      <div className="relative h-full">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Images Carousel */}
            <div className="absolute inset-0">
              {slide.images?.map((imageUrl, imageIndex) => (
                <div
                  key={imageIndex}
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                    imageIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                />
              ))}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-6 max-w-4xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if more than 1 slide */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
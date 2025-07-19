import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, Image, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { HeroSlide, InsertHeroSlide } from '@shared/schema';

interface HeroSlideFormData {
  title: string;
  subtitle: string;
  images: File[];
  imageUrls?: string[];
  isActive: boolean;
  sortOrder: number;
}

export default function AdminHeroSlides() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<HeroSlideFormData>({
    title: '',
    subtitle: '',
    images: [],
    isActive: true,
    sortOrder: 0,
  });

  const { data: slides = [], isLoading } = useQuery<HeroSlide[]>({
    queryKey: ['/api/hero-slides'],
  });

  const createSlideMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/hero-slides', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Slide créée",
        description: "La slide a été créée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la slide.",
        variant: "destructive",
      });
    },
  });

  const updateSlideMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await apiRequest('PUT', `/api/hero-slides/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      setIsDialogOpen(false);
      resetForm();
      setEditingSlide(null);
      toast({
        title: "Slide mise à jour",
        description: "La slide a été mise à jour avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la slide.",
        variant: "destructive",
      });
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/hero-slides/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-slides'] });
      toast({
        title: "Slide supprimée",
        description: "La slide a été supprimée avec succès.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la slide.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      images: [],
      isActive: true,
      sortOrder: 0,
    });
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      images: [],
      imageUrls: slide.images || [],
      isActive: slide.isActive,
      sortOrder: slide.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('isActive', formData.isActive.toString());
    formDataToSend.append('sortOrder', formData.sortOrder.toString());
    
    // Ajouter les nouvelles images
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });
    
    // Ajouter les URLs d'images existantes si on édite
    if (editingSlide && formData.imageUrls) {
      formDataToSend.append('existingImages', JSON.stringify(formData.imageUrls));
    }

    if (editingSlide) {
      updateSlideMutation.mutate({ id: editingSlide.id, data: formDataToSend });
    } else {
      createSlideMutation.mutate(formDataToSend);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette slide ?')) {
      deleteSlideMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion du Carrousel</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Gérez les slides du carrousel de la page d'accueil
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSlide(null);
                resetForm();
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSlide ? 'Modifier la slide' : 'Ajouter une slide'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Titre principal de la slide"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Sous-titre ou description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="images">Images * (Vous pouvez sélectionner plusieurs images)</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      setFormData(prev => ({ 
                        ...prev, 
                        images: [...prev.images, ...newFiles]
                      }));
                    }
                  }}
                  required={!editingSlide && formData.images.length === 0 && (!formData.imageUrls || formData.imageUrls.length === 0)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Chaque slide peut contenir plusieurs images qui défileront automatiquement
                </p>
                
                {/* Aperçu des nouvelles images sélectionnées */}
                {formData.images.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Nouvelles images sélectionnées :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={URL.createObjectURL(file)}
                            alt={`Nouvelle image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Aperçu des images existantes lors de l'édition */}
                {formData.imageUrls && formData.imageUrls.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Images actuelles :</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url}
                            alt={`Image actuelle ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>



              <div>
                <Label htmlFor="sortOrder">Ordre d'affichage</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked === true }))}
                />
                <Label htmlFor="isActive">Slide active</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700"
                  disabled={createSlideMutation.isPending || updateSlideMutation.isPending}
                >
                  {editingSlide ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <Card key={slide.id} className="overflow-hidden">
            <div className="relative h-40">
              {slide.images && slide.images.length > 0 ? (
                <div className="relative w-full h-full">
                  <img 
                    src={slide.images[0]} 
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {slide.images.length > 1 && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      +{slide.images.length - 1} autres images
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {slide.isActive ? (
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    Actif
                  </div>
                ) : (
                  <div className="bg-gray-500 text-white px-2 py-1 rounded text-xs flex items-center">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Inactif
                  </div>
                )}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                {slide.title}
              </h3>
              {slide.subtitle && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>Ordre: {slide.sortOrder || 0}</span>
                <span>{slide.images?.length || 0} image(s)</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(slide)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(slide.id)}
                  disabled={deleteSlideMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Aucune slide trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Commencez par créer votre première slide pour le carrousel.
          </p>
          <Button
            onClick={() => {
              setEditingSlide(null);
              resetForm();
              setIsDialogOpen(true);
            }}
            className="bg-rose-600 hover:bg-rose-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer une slide
          </Button>
        </div>
      )}
    </div>
  );
}
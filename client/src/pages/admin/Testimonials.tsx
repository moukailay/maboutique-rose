import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Search, Star, Eye, EyeOff, Upload, Video } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { apiRequest } from "../../lib/queryClient";

interface Testimonial {
  id: number;
  name: string;
  title?: string;
  content: string;
  image?: string;
  videoUrl?: string;
  rating: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

const TestimonialForm = ({ 
  testimonial, 
  onClose, 
  onSubmit 
}: { 
  testimonial?: Testimonial;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}) => {
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    title: testimonial?.title || '',
    content: testimonial?.content || '',
    videoUrl: testimonial?.videoUrl || '',
    rating: testimonial?.rating || 5,
    isActive: testimonial?.isActive ?? true,
    sortOrder: testimonial?.sortOrder || 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(testimonial?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }
    
    onSubmit(submitData);
  };

  const renderStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRatingChange(i + 1)}
        className={`w-6 h-6 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        } hover:text-yellow-400 transition-colors`}
      >
        <Star className="w-full h-full" />
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="title">Titre/Localisation</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Contenu du témoignage *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="videoUrl">URL de la vidéo (optionnel)</Label>
        <Input
          id="videoUrl"
          type="url"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          placeholder="https://youtube.com/embed/..."
        />
      </div>

      <div>
        <Label htmlFor="image">Photo de profil</Label>
        <div className="mt-2 space-y-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="cursor-pointer"
          />
          {imagePreview && (
            <div className="flex items-center space-x-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
              <span className="text-sm text-gray-600">Aperçu de l'image</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label>Note</Label>
          <div className="flex items-center space-x-1 mt-2">
            {renderStars(formData.rating, (rating) => setFormData({ ...formData, rating }))}
          </div>
        </div>

        <div>
          <Label htmlFor="sortOrder">Ordre d'affichage</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label>Actif</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
          {testimonial ? "Modifier" : "Ajouter"} le témoignage
        </Button>
      </div>
    </form>
  );
};

export default function AdminTestimonials() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | undefined>();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['/api/admin/testimonials'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/testimonials');
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('/api/testimonials', {
        method: 'POST',
        data: formData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Témoignage créé",
        description: "Le témoignage a été ajouté avec succès.",
      });
      setShowDialog(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création du témoignage.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await apiRequest(`/api/testimonials/${id}`, {
        method: 'PUT',
        data: formData
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Témoignage modifié",
        description: "Le témoignage a été modifié avec succès.",
      });
      setShowDialog(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du témoignage.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/testimonials/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      toast({
        title: "Témoignage supprimé",
        description: "Le témoignage a été supprimé avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du témoignage.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (formData: FormData) => {
    if (selectedTestimonial) {
      updateMutation.mutate({ id: selectedTestimonial.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDialog(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le témoignage de ${testimonial.name} ?`)) {
      deleteMutation.mutate(testimonial.id);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial: Testimonial) =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des témoignages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les témoignages clients affichés sur votre site
          </p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedTestimonial(undefined)}
              className="bg-rose-500 hover:bg-rose-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un témoignage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedTestimonial ? "Modifier le témoignage" : "Ajouter un témoignage"}
              </DialogTitle>
            </DialogHeader>
            <TestimonialForm
              testimonial={selectedTestimonial}
              onClose={() => setShowDialog(false)}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un témoignage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Total: {testimonials.length}</span>
          <span className="text-green-600 dark:text-green-400">Actifs: {testimonials.filter((t: Testimonial) => t.isActive).length}</span>
          <span className="text-gray-500 dark:text-gray-500">Inactifs: {testimonials.filter((t: Testimonial) => !t.isActive).length}</span>
        </div>
      </div>

      {/* Testimonials grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial: Testimonial) => (
            <div
              key={testimonial.id}
              className={`rounded-lg p-6 shadow-sm border hover:shadow-md transition-all ${
                testimonial.isActive 
                  ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" 
                  : "bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-rose-400 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    {testimonial.title && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.title}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {testimonial.isActive ? (
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">VISIBLE</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <EyeOff className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">MASQUÉ</span>
                    </div>
                  )}
                  {testimonial.videoUrl && (
                    <Video className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>

              <div className="flex items-center mb-3">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Ordre: {testimonial.sortOrder}
                </span>
                
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(testimonial)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTestimonials.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? "Aucun témoignage trouvé." : "Aucun témoignage pour le moment."}
          </p>
        </div>
      )}
    </div>
  );
}
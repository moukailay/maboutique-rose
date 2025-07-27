import { useAuth } from "@/components/auth/AuthProvider";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { 
  Package, 
  Upload,
  ArrowLeft,
  Save,
  X,
  ImageIcon
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
}

const productSchema = z.object({
  name: z.string().min(1, "Le nom du produit est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().min(1, "La description est requise").max(1000, "La description ne peut pas dépasser 1000 caractères"),
  price: z.string().min(1, "Le prix est requis").refine(
    (val) => {
      const num = parseFloat(val.replace(/[^\d.-]/g, ''));
      return !isNaN(num) && num >= 0;
    },
    "Le prix doit être un nombre valide"
  ),
  image: z.string().min(1, "Une image est requise"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  stock: z.string().min(1, "Le stock est requis").refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 0;
    },
    "Le stock doit être un nombre entier positif"
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProduct() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: "",
      categoryId: "",
      stock: "0",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne peut pas dépasser 5 MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Compression d'image simple
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionner l'image si elle est trop grande
          const maxWidth = 800;
          const maxHeight = 600;
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setSelectedImages([compressedDataUrl]);
            form.setValue('image', compressedDataUrl);
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    if (newImages.length === 0) {
      form.setValue('image', '');
    } else {
      form.setValue('image', newImages[0]);
    }
  };

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Clean and format the price
      const cleanPrice = data.price.replace(/[^\d.-]/g, '');
      const numericPrice = parseFloat(cleanPrice);
      
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Le prix doit être un nombre valide supérieur à 0");
      }
      
      const productData = {
        name: data.name,
        description: data.description,
        price: numericPrice.toString(),
        image: data.image,
        categoryId: parseInt(data.categoryId),
        stock: parseInt(data.stock),
        isActive: true,
      };

      const response = await apiRequest('/api/products', { method: 'POST', data: productData });
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Produit créé avec succès",
        description: `Le produit "${data.name}" a été ajouté au catalogue.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setLocation('/admin/products');
    },
    onError: (error: any) => {
      console.error("Error creating product:", error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur s'est produite lors de la création du produit.",
        variant: "destructive",
      });
    },
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vous devez être administrateur pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ajouter un nouveau produit
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Créez un nouveau produit pour votre catalogue
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informations du produit
            </CardTitle>
            <CardDescription>
              Remplissez tous les champs pour créer un nouveau produit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du produit</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Miel de Lavande Bio"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre produit en détail..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Décrivez les caractéristiques, les bienfaits et les spécificités du produit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (CAD)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: 24.99 CAD"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Prix en dollars canadiens
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock disponible</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 50"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre d'unités disponibles
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image du produit</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Téléverser une image
                            </Button>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </div>
                          
                          {selectedImages.length > 0 && (
                            <div className="space-y-2">
                              <Label>Aperçu de l'image</Label>
                              <div className="flex gap-4 flex-wrap">
                                {selectedImages.map((image, index) => (
                                  <div key={index} className="relative">
                                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                      <img
                                        src={image}
                                        alt={`Aperçu ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="sm"
                                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                                      onClick={() => removeImage(index)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {selectedImages.length === 0 && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 mb-2">Aucune image sélectionnée</p>
                              <p className="text-sm text-gray-400">
                                Cliquez sur "Téléverser une image" pour ajouter une photo
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Formats acceptés : JPG, PNG, WebP (max 5 MB) - Les images sont automatiquement optimisées
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-6">
                  <Button asChild variant="outline" type="button">
                    <Link href="/admin/products">
                      Annuler
                    </Link>
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createProductMutation.isPending}
                    className="min-w-32"
                  >
                    {createProductMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Création...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Créer le produit
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
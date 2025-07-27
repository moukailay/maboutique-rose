import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { Product, Category } from '@shared/schema';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEdit = id !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promoPrice: '',
    categoryId: '',
    stock: '',
    image: '',
    images: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data: product } = useQuery<Product>({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return response.json();
    },
    enabled: isEdit && id !== 'new'
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        promoPrice: product.promoPrice?.toString() || '',
        categoryId: product.categoryId.toString(),
        stock: product.stock.toString(),
        image: product.image,
        images: product.images || []
      });
    }
  }, [product, isEdit]);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
        categoryId: parseInt(formData.categoryId),
        stock: parseInt(formData.stock)
      };

      // In real app, this would call API to save product

      toast({
        title: isEdit ? "Produit modifié" : "Produit créé",
        description: `Le produit a été ${isEdit ? 'modifié' : 'créé'} avec succès${publish ? ' et publié' : ''}.`,
      });

      setLocation('/admin/products');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // In real app, this would upload to server and get URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin/products')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">
                {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
              </h1>
              <p className="text-text-medium">
                {isEdit ? 'Modifiez les informations du produit' : 'Créez un nouveau produit pour votre boutique'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du produit *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ex: Miel Bio Artisanal"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Décrivez votre produit en détail..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Prix et stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Prix *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="promoPrice">Prix promotionnel</Label>
                      <Input
                        id="promoPrice"
                        type="number"
                        step="0.01"
                        value={formData.promoPrice}
                        onChange={(e) => handleChange('promoPrice', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock initial *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleChange('stock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images du produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="mainImage">Image principale *</Label>
                    <Input
                      id="mainImage"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                      placeholder="URL de l'image principale"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Images supplémentaires</Label>
                    <Input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-rose-primary hover:bg-rose-light"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                  
                  <Button
                    type="button"
                    disabled={isLoading}
                    onClick={(e) => handleSubmit(e, true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Sauvegarder & Publier
                  </Button>
                </CardContent>
              </Card>

              {/* Preview */}
              {formData.image && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={formData.image}
                      alt="Aperçu du produit"
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="mt-4">
                      <h3 className="font-semibold text-text-dark">
                        {formData.name || 'Nom du produit'}
                      </h3>
                      <p className="text-sm text-text-medium line-clamp-2">
                        {formData.description || 'Description du produit'}
                      </p>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-rose-primary">
                          {formData.price || '0.00'} €
                        </span>
                        {formData.promoPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formData.promoPrice} €
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
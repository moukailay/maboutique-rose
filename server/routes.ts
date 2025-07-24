import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertNewsletterSchema, insertReviewSchema, insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertCategorySchema, insertTestimonialSchema, insertHeroSlideSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Function to convert YouTube URL to embed URL
function convertToYouTubeEmbed(url: string): string {
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
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database data
  await storage.initializeData();

  // Configure multer for file uploads
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage_multer = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: storage_multer,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier non autorisé. Seuls les fichiers JPEG, PNG, GIF et WebP sont acceptés.'));
      }
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));
  
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, generate a JWT token
      const token = `fake-jwt-token-${user.id}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || !await bcrypt.compare(password, user.password) || user.role !== 'admin') {
        return res.status(401).json({ message: "Access denied" });
      }
      
      // In a real app, generate a JWT token
      const token = `fake-jwt-token-${user.id}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Create new user
      const user = await storage.createUserWithAuth({
        firstName,
        lastName,
        email,
        password,
        role: 'user'
      });
      
      // In a real app, generate a JWT token
      const token = `fake-jwt-token-${user.id}`;
      
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/auth/verify", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      console.log('Token verification attempt:', { token: token ? 'presente' : 'absente', length: token?.length });
      
      if (!token || !token.startsWith('fake-jwt-token-')) {
        console.log('Token invalid or missing');
        return res.status(401).json({ message: "Invalid token" });
      }
      
      const userId = parseInt(token.replace('fake-jwt-token-', ''));
      console.log('Extracting user ID from token:', userId);
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        console.log('User not found for ID:', userId);
        return res.status(401).json({ message: "User not found" });
      }
      
      console.log('User verification successful:', user.email);
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      console.error('Error in auth verification:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      let products;
      
      console.log('Products API called with params:', { category, search });
      
      if (search) {
        console.log('Searching for products with query:', search);
        products = await storage.searchProducts(search as string);
      } else if (category) {
        console.log('Filtering by category:', category);
        // Check if category is a slug or ID
        const categoryData = isNaN(Number(category)) 
          ? await storage.getCategoryBySlug(category as string)
          : await storage.getCategory(Number(category));
        
        console.log('Category data found:', categoryData);
        
        if (categoryData) {
          products = await storage.getProductsByCategory(categoryData.id);
          console.log('Products found for category:', products.length);
        } else {
          console.log('Category not found, returning all products');
          products = await storage.getProducts();
        }
      } else {
        console.log('No filters, returning all products');
        products = await storage.getProducts();
      }
      
      console.log('Final products count:', products.length);
      res.json(products);
    } catch (error) {
      console.error('Error in products API:', error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      console.log("Creating product with data:", {
        name: req.body.name,
        price: req.body.price,
        categoryId: req.body.categoryId,
        stock: req.body.stock,
        imageLength: req.body.image?.length || 0
      });
      
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      console.log("Updating product with ID:", id, "data:", {
        name: req.body.name,
        price: req.body.price,
        categoryId: req.body.categoryId,
        stock: req.body.stock,
        imageLength: req.body.image?.length || 0
      });
      
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      console.log("Deleting product with ID:", id);
      
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product", error: error.message });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      console.log("Categories fetched:", categories.length);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
  });

  // Image upload endpoint
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier téléchargé" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Erreur lors du téléchargement de l'image" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      // Auto-generate slug if not provided
      const requestData = { ...req.body };
      if (!requestData.slug && requestData.name) {
        requestData.slug = requestData.name.toLowerCase()
          .replace(/[àáâäã]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôöõ]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const categoryData = insertCategorySchema.parse(requestData);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category", error: error.message });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      console.log("Updating category with data:", req.body);
      
      // Auto-generate slug if not provided
      const requestData = { ...req.body };
      if (!requestData.slug && requestData.name) {
        requestData.slug = requestData.name.toLowerCase()
          .replace(/[àáâäã]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôöõ]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
      }
      
      const categoryData = insertCategorySchema.parse(requestData);
      console.log("Parsed category data:", categoryData);
      
      const category = await storage.updateCategory(id, categoryData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating category", error: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Error deleting category", error: error.message });
    }
  });

  // Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(Number(req.params.id));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = Number(req.params.id);
      const reviewData = insertReviewSchema.parse({ ...req.body, productId });
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Contact
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Error submitting contact form" });
    }
  });

  // Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.createNewsletter(newsletterData);
      res.status(201).json(newsletter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email", errors: error.errors });
      }
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const { userId, customerName, customerEmail, phone, shippingAddress, items, totalAmount, status } = req.body;
      
      // Create order
      const orderData = {
        userId,
        customerName,
        customerEmail,
        phone,
        total: totalAmount.toString(),
        status: status || 'pending',
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: 'card'
      };
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString()
        });
      }
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order", error: error.message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order status" });
    }
  });

  // Chat Messages endpoints
  app.post('/api/chat/messages', async (req, res) => {
    try {
      const { message, userAgent, url } = req.body;
      
      const chatMessage = await storage.createChatMessage({
        message,
        userAgent,
        url,
        ipAddress: req.ip,
        isRead: false,
      });
      
      res.json(chatMessage);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/chat/messages', async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route publique pour récupérer les messages du chat côté client
  app.get('/api/chat/messages/user', async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin API endpoints
  app.get("/api/admin/customers", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/contacts/:id/read", async (req, res) => {
    try {
      const contactId = parseInt(req.params.id);
      const contact = await storage.markContactAsRead(contactId);
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/reviews/:id", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.id);
      const { isApproved } = req.body;
      const review = await storage.updateReviewApproval(reviewId, isApproved);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/chat/messages/:id/read", async (req, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const message = await storage.markChatMessageAsRead(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/chat/messages/:id/read', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.markChatMessageAsRead(id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Route pour répondre à un message de chat
  app.post('/api/chat/messages/:id/response', async (req, res) => {
    try {
      // Vérification du token comme dans /api/auth/verify
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      console.log('Token verification attempt:', { token: token ? 'presente' : 'absente', length: token?.length });
      
      if (!token || !token.startsWith('fake-jwt-token-')) {
        console.log('Token invalid or missing');
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      const userId = parseInt(token.replace('fake-jwt-token-', ''));
      console.log('Extracting user ID from token:', userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(401).json({ error: 'User not found' });
      }
      
      console.log('User verification successful:', user.email);
      
      if (user.role !== 'admin') {
        return res.status(401).json({ error: 'Admin access required' });
      }

      const messageId = parseInt(req.params.id);
      const { response } = req.body;
      
      if (!response || response.trim() === '') {
        return res.status(400).json({ error: 'Response cannot be empty' });
      }

      const updatedMessage = await storage.respondToChatMessage(
        messageId, 
        response.trim(), 
        user.id
      );
      
      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.json(updatedMessage);
    } catch (error: any) {
      console.error('Error responding to chat message:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonials", error: error.message });
    }
  });

  // Admin route to get ALL testimonials (active and inactive)
  app.get("/api/admin/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching all testimonials", error: error.message });
    }
  });

  app.get("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonialId = parseInt(req.params.id);
      const testimonial = await storage.getTestimonial(testimonialId);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching testimonial", error: error.message });
    }
  });

  app.post("/api/testimonials", upload.single('image'), async (req, res) => {
    try {
      console.log("Received testimonial data:", req.body);
      console.log("Received file:", req.file);
      
      const testimonialData = {
        name: req.body.name || '',
        title: req.body.title && req.body.title.trim() !== '' ? req.body.title : null,
        content: req.body.content || '',
        image: req.file ? `/uploads/${req.file.filename}` : (req.body.image && req.body.image.trim() !== '' ? req.body.image : null),
        videoUrl: req.body.videoUrl && req.body.videoUrl.trim() !== '' ? convertToYouTubeEmbed(req.body.videoUrl.trim()) : null,
        rating: parseInt(req.body.rating) || 5,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
        sortOrder: parseInt(req.body.sortOrder) || 0,
      };
      
      console.log("Parsed testimonial data:", testimonialData);
      
      const validatedData = insertTestimonialSchema.parse(testimonialData);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error: any) {
      console.error("Error creating testimonial:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating testimonial", error: error.message });
    }
  });

  app.put("/api/testimonials/:id", upload.single('image'), async (req, res) => {
    try {
      const testimonialId = parseInt(req.params.id);
      console.log("Updating testimonial ID:", testimonialId);
      console.log("Received update data:", req.body);
      console.log("Received file:", req.file);
      
      const testimonialData = {
        name: req.body.name || '',
        title: req.body.title && req.body.title.trim() !== '' ? req.body.title : null,
        content: req.body.content || '',
        image: req.file ? `/uploads/${req.file.filename}` : (req.body.image && req.body.image.trim() !== '' ? req.body.image : null),
        videoUrl: req.body.videoUrl && req.body.videoUrl.trim() !== '' ? convertToYouTubeEmbed(req.body.videoUrl.trim()) : null,
        rating: parseInt(req.body.rating) || 5,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
        sortOrder: parseInt(req.body.sortOrder) || 0,
      };
      
      console.log("Parsed update data:", testimonialData);
      
      const validatedData = insertTestimonialSchema.parse(testimonialData);
      const testimonial = await storage.updateTestimonial(testimonialId, validatedData);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating testimonial", error: error.message });
    }
  });

  app.delete("/api/testimonials/:id", async (req, res) => {
    try {
      const testimonialId = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(testimonialId);
      if (!deleted) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting testimonial", error: error.message });
    }
  });

  // Hero Slides routes
  app.get("/api/hero-slides", async (req, res) => {
    try {
      const slides = await storage.getHeroSlides();
      res.json(slides);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching hero slides", error: error.message });
    }
  });

  app.get("/api/hero-slides/:id", async (req, res) => {
    try {
      const slideId = parseInt(req.params.id);
      const slide = await storage.getHeroSlide(slideId);
      if (!slide) {
        return res.status(404).json({ message: "Hero slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching hero slide", error: error.message });
    }
  });

  app.post("/api/hero-slides", upload.array('images', 10), async (req, res) => {
    try {
      console.log("Received hero slide data:", req.body);
      console.log("Received files:", req.files);
      
      // Traiter les fichiers d'images
      const images = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          images.push(`/uploads/${file.filename}`);
        }
      }
      
      // Ajouter les images existantes si elles existent
      if (req.body.existingImages) {
        try {
          const existingImages = JSON.parse(req.body.existingImages);
          images.push(...existingImages);
        } catch (e) {
          console.error("Error parsing existing images:", e);
        }
      }
      
      const slideData = {
        title: req.body.title || '',
        subtitle: req.body.subtitle && req.body.subtitle.trim() !== '' ? req.body.subtitle : null,
        images: images,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
        sortOrder: parseInt(req.body.sortOrder) || 0,
      };
      
      console.log("Parsed hero slide data:", slideData);
      
      const validatedData = insertHeroSlideSchema.parse(slideData);
      const slide = await storage.createHeroSlide(validatedData);
      res.status(201).json(slide);
    } catch (error: any) {
      console.error("Error creating hero slide:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hero slide data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating hero slide", error: error.message });
    }
  });

  app.put("/api/hero-slides/:id", upload.array('images', 10), async (req, res) => {
    try {
      const slideId = parseInt(req.params.id);
      console.log("Updating hero slide ID:", slideId);
      console.log("Received update data:", req.body);
      console.log("Received files:", req.files);
      
      // Traiter les nouvelles images
      const newImages = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          newImages.push(`/uploads/${file.filename}`);
        }
      }
      
      // Récupérer les images existantes
      const existingImages = [];
      if (req.body.existingImages) {
        try {
          const parsed = JSON.parse(req.body.existingImages);
          existingImages.push(...parsed);
        } catch (e) {
          console.error("Error parsing existing images:", e);
        }
      }
      
      // Combiner toutes les images
      const allImages = [...existingImages, ...newImages];
      
      const slideData = {
        title: req.body.title || '',
        subtitle: req.body.subtitle && req.body.subtitle.trim() !== '' ? req.body.subtitle : null,
        images: allImages,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
        sortOrder: parseInt(req.body.sortOrder) || 0,
      };
      
      console.log("Parsed hero slide update data:", slideData);
      
      const validatedData = insertHeroSlideSchema.parse(slideData);
      const slide = await storage.updateHeroSlide(slideId, validatedData);
      if (!slide) {
        return res.status(404).json({ message: "Hero slide not found" });
      }
      res.json(slide);
    } catch (error: any) {
      console.error("Error updating hero slide:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hero slide data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating hero slide", error: error.message });
    }
  });

  app.delete("/api/hero-slides/:id", async (req, res) => {
    try {
      const slideId = parseInt(req.params.id);
      const deleted = await storage.deleteHeroSlide(slideId);
      if (!deleted) {
        return res.status(404).json({ message: "Hero slide not found" });
      }
      res.json({ message: "Hero slide deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting hero slide", error: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { customerInfo, items, total, status } = req.body;

      // Create order in database first
      const orderData = {
        customerFirstName: customerInfo.firstName,
        customerLastName: customerInfo.lastName,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone || null,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city,
        customerPostalCode: customerInfo.postalCode,
        customerCountry: customerInfo.country || 'Canada',
        total: total,
        status: 'pending'
      };

      const order = await storage.createOrder(orderData);

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }

      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "cad", // Canadian dollars
        metadata: {
          orderId: order.id.toString()
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        order: order
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Update order status when payment is confirmed
  app.post("/api/orders/:id/confirm-payment", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.updateOrderStatus(orderId, 'paid');
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ 
        message: "Error confirming payment: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import {
  users,
  products,
  categories,
  orders,
  orderItems,
  reviews,
  contacts,
  newsletters,
  chatMessages,
  testimonials,
  heroSlides,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Category,
  type InsertCategory,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
  type Contact,
  type InsertContact,
  type Newsletter,
  type InsertNewsletter,
  type ChatMessage,
  type InsertChatMessage,
  type Testimonial,
  type InsertTestimonial,
  type HeroSlide,
  type InsertHeroSlide,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, ilike, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Reviews
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;

  // Newsletter
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;

  // Chat Messages
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  markChatMessageAsRead(id: number): Promise<ChatMessage | undefined>;
  respondToChatMessage(id: number, response: string, adminId: number): Promise<ChatMessage | undefined>;

  // Auth
  createUserWithAuth(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<User>;

  // Admin specific methods
  getAllUsers(): Promise<User[]>;
  getAllContacts(): Promise<Contact[]>;
  markContactAsRead(id: number): Promise<Contact | undefined>;
  getAllReviews(): Promise<Review[]>;
  updateReviewApproval(id: number, isApproved: boolean): Promise<Review | undefined>;

  // Testimonials
  getTestimonials(): Promise<(Testimonial & { product?: Product })[]>;
  getAllTestimonials(): Promise<(Testimonial & { product?: Product })[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: InsertTestimonial): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Hero Slides
  getHeroSlides(): Promise<HeroSlide[]>;
  getHeroSlide(id: number): Promise<HeroSlide | undefined>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: number, slide: InsertHeroSlide): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async initializeData() {
    // Initialize categories
    const categoriesData = [
      // Catégories principales
      {
        name: "TISANES",
        description: "Tisanes biologiques et infusions naturelles",
        slug: "tisanes",
        parentId: null,
        sortOrder: 1,
      },
      {
        name: "FEMMES",
        description: "Produits dédiés aux femmes",
        slug: "femmes",
        parentId: null,
        sortOrder: 2,
      },
      {
        name: "ROSE-D'ÉDEN",
        description: "Produits signature Rose-d'Éden",
        slug: "rose-d-eden",
        parentId: null,
        sortOrder: 3,
      },
      {
        name: "HOMMES",
        description: "Produits dédiés aux hommes",
        slug: "hommes",
        parentId: null,
        sortOrder: 4,
      },
      {
        name: "PRODUITS AMINCISSANTS",
        description: "Produits pour la perte de poids et la minceur",
        slug: "produits-amincissants",
        parentId: null,
        sortOrder: 5,
      },
      {
        name: "HUILES ET BEURRES",
        description: "Huiles essentielles et beurres naturels",
        slug: "huiles-et-beurres",
        parentId: null,
        sortOrder: 6,
      },
      {
        name: "AUTRES PRODUITS",
        description: "Autres produits naturels",
        slug: "autres-produits",
        parentId: null,
        sortOrder: 7,
      },
      {
        name: "LINGERIE ROSE-D'ÉDEN",
        description: "Lingerie signature Rose-d'Éden",
        slug: "lingerie-rose-d-eden",
        parentId: null,
        sortOrder: 8,
      },
      {
        name: "ROSE-D'ÉDEN DÉO / PARFUMS",
        description: "Déodorants et parfums Rose-d'Éden",
        slug: "rose-d-eden-deo-parfums",
        parentId: null,
        sortOrder: 9,
      },
      {
        name: "ACCESSOIRES",
        description: "Accessoires et objets utiles",
        slug: "accessoires",
        parentId: null,
        sortOrder: 10,
      },
      {
        name: "SOLDE",
        description: "Produits en promotion",
        slug: "solde",
        parentId: null,
        sortOrder: 11,
      },
    ];

    // Check if categories exist, if not, create them
    const existingCategories = await this.getCategories();
    if (existingCategories.length === 0) {
      // Create main categories first
      const createdCategories = [];
      for (const cat of categoriesData) {
        const created = await this.createCategory(cat);
        createdCategories.push(created);
      }
      
      // Create subcategories for FEMMES
      const femmesCategory = createdCategories.find(c => c.name === "FEMMES");
      if (femmesCategory) {
        const femmeSubcategories = [
          {
            name: "Produits Intimes",
            description: "Produits d'hygiène intime féminine",
            slug: "produits-intimes",
            parentId: femmesCategory.id,
            sortOrder: 1,
          },
          {
            name: "Secrets de femmes",
            description: "Produits spécialement conçus pour les femmes",
            slug: "secrets-de-femmes",
            parentId: femmesCategory.id,
            sortOrder: 2,
          },
          {
            name: "Produits de corps",
            description: "Soins et produits pour le corps",
            slug: "produits-de-corps",
            parentId: femmesCategory.id,
            sortOrder: 3,
          },
        ];
        
        for (const subcat of femmeSubcategories) {
          await this.createCategory(subcat);
        }
      }
    }

    // Products will be created via admin interface later

    // Create admin user if it doesn't exist
    const adminUser = await this.getUserByEmail("admin@rose-d-eden.fr");
    if (!adminUser) {
      await this.createUserWithAuth({
        firstName: "Admin",
        lastName: "User",
        email: "admin@rose-d-eden.fr",
        password: "admin123",
        role: "admin",
      });
    }

    // Create test orders if none exist
    const existingOrders = await this.getOrders();
    if (existingOrders.length === 0) {
      const testOrders = [
        {
          customerName: "Marie Dubois",
          customerEmail: "marie.dubois@email.com",
          customerPhone: "+1 (514) 555-0123",
          shippingAddress: "123 rue Saint-Denis, Montréal, QC H2X 3K8",
          total: "89.99",
          status: "delivered" as const,
          paymentMethod: "credit_card",
          notes: "Commande livrée avec succès",
        },
        {
          customerName: "Jean Martin",
          customerEmail: "jean.martin@email.com",
          customerPhone: "+1 (418) 555-0456",
          shippingAddress: "456 boulevard René-Lévesque, Québec, QC G1R 2B5",
          total: "156.50",
          status: "shipped" as const,
          paymentMethod: "paypal",
          notes: "Expédié par Purolator",
        },
        {
          customerName: "Sophie Tremblay",
          customerEmail: "sophie.tremblay@email.com",
          customerPhone: "+1 (450) 555-0789",
          shippingAddress: "789 avenue du Parc, Laval, QC H7N 5Y7",
          total: "234.75",
          status: "pending" as const,
          paymentMethod: "interac",
          notes: "En attente de confirmation de paiement",
        },
      ];

      for (const order of testOrders) {
        await this.createOrder(order);
      }
    }

    // Create test contacts if none exist
    const existingContacts = await this.getAllContacts();
    if (existingContacts.length === 0) {
      const testContacts = [
        {
          name: "Alexandra Bouchard",
          email: "alexandra.bouchard@email.com",
          subject: "Question sur les produits pour peaux sensibles",
          message: "Bonjour, j'aimerais savoir si vous avez des produits pour les peaux sensibles ?",
          isRead: false,
        },
        {
          name: "Pierre Gagnon",
          email: "pierre.gagnon@email.com",
          subject: "Commentaire positif",
          message: "Excellent service ! J'ai reçu ma commande rapidement. Merci !",
          isRead: true,
        },
      ];

      for (const contact of testContacts) {
        await this.createContact(contact);
      }
    }

    // Create test testimonials if none exist
    const existingTestimonials = await this.getTestimonials();
    if (existingTestimonials.length === 0) {
      const testTestimonials = [
        {
          name: "Marie Dubois",
          title: "Montréal, QC",
          content: "J'adore les produits de Rose-d'Éden ! Leur huile d'argan a transformé ma peau. Service client exceptionnel et livraison rapide. Je recommande vivement !",
          rating: 5,
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "Jean-Pierre Tremblay",
          title: "Propriétaire d'une boutique bio",
          content: "Nous vendons les produits Rose-d'Éden depuis 2 ans. Nos clients sont ravis de la qualité et de l'efficacité. Partenaire fiable avec d'excellents produits naturels.",
          rating: 5,
          isActive: true,
          sortOrder: 2,
        },
        {
          name: "Sophie Martin",
          title: "Québec, QC",
          content: "Les tisanes de Rose-d'Éden sont devenues un incontournable de ma routine bien-être. Goût authentique et bienfaits remarquables. Merci pour ces produits d'exception !",
          rating: 5,
          isActive: true,
          sortOrder: 3,
        },
        {
          name: "Alexandra Bouchard",
          title: "Naturopathe",
          content: "Je recommande régulièrement les produits Rose-d'Éden à mes patients. Qualité irréprochable, ingrédients naturels et résultats visibles. Une marque de confiance.",
          rating: 5,
          isActive: true,
          sortOrder: 4,
        },
        {
          name: "Pierre Gagnon",
          title: "Laval, QC",
          content: "Commande facile, produits de qualité supérieure et service après-vente impeccable. Rose-d'Éden dépasse mes attentes à chaque fois !",
          rating: 5,
          isActive: true,
          sortOrder: 5,
        },
        {
          name: "Catherine Morin",
          title: "Herboriste",
          content: "En tant que professionnelle, j'apprécie particulièrement la traçabilité et la pureté des produits Rose-d'Éden. Excellent travail !",
          rating: 5,
          isActive: true,
          sortOrder: 6,
        },
      ];

      for (const testimonial of testTestimonials) {
        await this.createTestimonial(testimonial);
      }
    }

    // Create test users if none exist
    const existingUsers = await this.getAllUsers();
    if (existingUsers.length <= 1) { // Only admin user exists
      const testUsers = [
        {
          firstName: "Marie",
          lastName: "Dubois",
          email: "marie.dubois@email.com",
          password: "password123",
          role: "user" as const,
        },
        {
          firstName: "Jean",
          lastName: "Martin",
          email: "jean.martin@email.com",
          password: "password123",
          role: "user" as const,
        },
        {
          firstName: "Sophie",
          lastName: "Tremblay",
          email: "sophie.tremblay@email.com",
          password: "password123",
          role: "user" as const,
        },
      ];

      for (const user of testUsers) {
        await this.createUserWithAuth(user);
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createUserWithAuth(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db.insert(users).values({
      username: userData.email,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
    }).returning();
    
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, updateData: InsertCategory): Promise<Category | undefined> {
    const [category] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount > 0;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.categoryId, categoryId), eq(products.isActive, true)));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(and(ilike(products.name, `%${query}%`), eq(products.isActive, true)));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {
      console.log("Creating product with data:", insertProduct);
      const [product] = await db.insert(products).values(insertProduct).returning();
      console.log("Product created successfully:", product);
      return product;
    } catch (error) {
      console.error("Database error when creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, updateData: InsertProduct): Promise<Product | undefined> {
    try {
      console.log("Updating product with ID:", id, "data:", updateData);
      const [product] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();
      console.log("Product updated successfully:", product);
      return product || undefined;
    } catch (error) {
      console.error("Database error when updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log("Deleting product with ID:", id);
      const result = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      console.log("Product deleted successfully:", result.length > 0);
      return result.length > 0;
    } catch (error) {
      console.error("Database error when deleting product:", error);
      throw error;
    }
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  // Review methods
  async getReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  // Newsletter methods
  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const [newsletter] = await db.insert(newsletters).values(insertNewsletter).returning();
    return newsletter;
  }

  // Chat Message methods
  async getChatMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages);
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db.insert(chatMessages).values(insertChatMessage).returning();
    return chatMessage;
  }

  async markChatMessageAsRead(id: number): Promise<ChatMessage | undefined> {
    const [chatMessage] = await db.update(chatMessages).set({ isRead: true }).where(eq(chatMessages.id, id)).returning();
    return chatMessage || undefined;
  }

  async respondToChatMessage(id: number, response: string, adminId: number): Promise<ChatMessage | undefined> {
    const [updated] = await db
      .update(chatMessages)
      .set({ 
        adminResponse: response,
        respondedAt: new Date(),
        respondedBy: adminId,
        isRead: true
      })
      .where(eq(chatMessages.id, id))
      .returning();
    return updated || undefined;
  }

  // Admin specific methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async markContactAsRead(id: number): Promise<Contact | undefined> {
    const [contact] = await db
      .update(contacts)
      .set({ isRead: true })
      .where(eq(contacts.id, id))
      .returning();
    return contact || undefined;
  }

  async getAllReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }

  async updateReviewApproval(id: number, isApproved: boolean): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ isApproved })
      .where(eq(reviews.id, id))
      .returning();
    return review || undefined;
  }

  // Testimonials
  async getTestimonials(): Promise<(Testimonial & { product?: Product })[]> {
    return await db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        title: testimonials.title,
        content: testimonials.content,
        productId: testimonials.productId,
        image: testimonials.image,
        videoUrl: testimonials.videoUrl,
        rating: testimonials.rating,
        isActive: testimonials.isActive,
        sortOrder: testimonials.sortOrder,
        createdAt: testimonials.createdAt,
        product: {
          id: products.id,
          name: products.name,
          images: products.images,
        },
      })
      .from(testimonials)
      .leftJoin(products, eq(testimonials.productId, products.id))
      .where(eq(testimonials.isActive, true))
      .orderBy(testimonials.sortOrder, testimonials.createdAt);
  }

  async getAllTestimonials(): Promise<(Testimonial & { product?: Product })[]> {
    return await db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        title: testimonials.title,
        content: testimonials.content,
        productId: testimonials.productId,
        image: testimonials.image,
        videoUrl: testimonials.videoUrl,
        rating: testimonials.rating,
        isActive: testimonials.isActive,
        sortOrder: testimonials.sortOrder,
        createdAt: testimonials.createdAt,
        product: {
          id: products.id,
          name: products.name,
          images: products.images,
        },
      })
      .from(testimonials)
      .leftJoin(products, eq(testimonials.productId, products.id))
      .orderBy(testimonials.sortOrder, testimonials.createdAt);
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    return testimonial || undefined;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: InsertTestimonial): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial || undefined;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Hero Slides methods
  async getHeroSlides(): Promise<HeroSlide[]> {
    return await db
      .select()
      .from(heroSlides)
      .orderBy(heroSlides.sortOrder, heroSlides.createdAt);
  }

  async getHeroSlide(id: number): Promise<HeroSlide | undefined> {
    const [slide] = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.id, id));
    return slide || undefined;
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const [newSlide] = await db
      .insert(heroSlides)
      .values(slide)
      .returning();
    return newSlide;
  }

  async updateHeroSlide(id: number, slide: InsertHeroSlide): Promise<HeroSlide | undefined> {
    const [updatedSlide] = await db
      .update(heroSlides)
      .set(slide)
      .where(eq(heroSlides.id, id))
      .returning();
    return updatedSlide || undefined;
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
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
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  updateProductFeaturedStatus(id: number, isFeatured: boolean): Promise<Product | undefined>;
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
  getTestimonials(): Promise<(Testimonial & { product?: Product | null })[]>;
  getAllTestimonials(): Promise<(Testimonial & { product?: Product | null })[]>;
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
    const adminUser = await this.getUserByEmail("roseden.boutique@gmail.com");
    if (!adminUser) {
      await this.createUserWithAuth({
        firstName: "Admin",
        lastName: "User",
        email: "roseden.boutique@gmail.com",
        password: "JssRose5641@",
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
    return (result.rowCount ?? 0) > 0;
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

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(and(eq(products.isFeatured, true), eq(products.isActive, true)));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(and(ilike(products.name, `%${query}%`), eq(products.isActive, true)));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    try {

      const [product] = await db.insert(products).values(insertProduct).returning();

      return product;
    } catch (error) {
      console.error("Database error when creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: number, updateData: InsertProduct): Promise<Product | undefined> {
    try {

      const [product] = await db
        .update(products)
        .set(updateData)
        .where(eq(products.id, id))
        .returning();

      return product || undefined;
    } catch (error) {
      console.error("Database error when updating product:", error);
      throw error;
    }
  }

  async updateProductFeaturedStatus(id: number, isFeatured: boolean): Promise<Product | undefined> {
    try {

      const [product] = await db
        .update(products)
        .set({ isFeatured })
        .where(eq(products.id, id))
        .returning();

      return product || undefined;
    } catch (error) {
      console.error("Database error when updating product featured status:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {

      const result = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

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
  async getOrderItems(orderId: number): Promise<any[]> {
    const items = await db
      .select({
        id: orderItems.id,
        orderId: orderItems.orderId,
        productId: orderItems.productId,
        quantity: orderItems.quantity,
        price: orderItems.price,
        product: {
          id: products.id,
          name: products.name,
          images: products.images,
        },
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, orderId));

    return items;
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
  async getTestimonials(): Promise<(Testimonial & { product?: Product | null })[]> {
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
          createdAt: products.createdAt,
          description: products.description,
          image: products.image,
          price: products.price,
          images: products.images,
          categoryId: products.categoryId,
          stock: products.stock,
          isActive: products.isActive,
          isFeatured: products.isFeatured,
        },
      })
      .from(testimonials)
      .leftJoin(products, eq(testimonials.productId, products.id))
      .where(eq(testimonials.isActive, true))
      .orderBy(testimonials.sortOrder, testimonials.createdAt);
  }

  async getAllTestimonials(): Promise<(Testimonial & { product?: Product | null })[]> {
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
          createdAt: products.createdAt,
          description: products.description,
          image: products.image,
          price: products.price,
          images: products.images,
          categoryId: products.categoryId,
          stock: products.stock,
          isActive: products.isActive,
          isFeatured: products.isFeatured,
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

// MemStorage for fallback when database is unavailable
export class MemStorage implements IStorage {
  private users: User[] = [];
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private reviews: Review[] = [];
  private contacts: Contact[] = [];
  private newsletters: Newsletter[] = [];
  private chatMessages: ChatMessage[] = [];
  private testimonials: Testimonial[] = [];
  private heroSlides: HeroSlide[] = [];
  private nextId = 1;

  private getNextId(): number {
    return this.nextId++;
  }

  async initializeData() {
    // Initialize with sample data
    console.log("Initializing in-memory storage with sample data...");
    
    // Create categories
    const categoriesData = [
      { name: "TISANES", description: "Tisanes biologiques et infusions naturelles", slug: "tisanes", parentId: null, sortOrder: 1 },
      { name: "FEMMES", description: "Produits dédiés aux femmes", slug: "femmes", parentId: null, sortOrder: 2 },
      { name: "ROSE-D'ÉDEN", description: "Produits signature Rose-d'Éden", slug: "rose-d-eden", parentId: null, sortOrder: 3 },
      { name: "HOMMES", description: "Produits dédiés aux hommes", slug: "hommes", parentId: null, sortOrder: 4 },
      { name: "PRODUITS AMINCISSANTS", description: "Produits pour la perte de poids et la minceur", slug: "produits-amincissants", parentId: null, sortOrder: 5 },
    ];

    for (const cat of categoriesData) {
      await this.createCategory(cat);
    }

    // Create admin user
    await this.createUserWithAuth({
      firstName: "Admin",
      lastName: "User", 
      email: "roseden.boutique@gmail.com",
      password: "JssRose5641@",
      role: "admin",
    });

    // Create sample products with working images
    const sampleProducts = [
      {
        name: "Tisane Détox Bio",
        description: "Une tisane détoxifiante naturelle aux plantes biologiques",
        price: "24.99",
        image: "/api/placeholder/400/300?color=e8f5e8&textColor=2d5a27",
        categoryId: 1,
        stock: 50,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Huile Rose-d'Éden Signature",
        description: "Huile essentielle signature de la marque Rose-d'Éden",
        price: "39.99", 
        image: "/api/placeholder/400/300?color=f4e8f1&textColor=8b2f65",
        categoryId: 3,
        stock: 30,
        isActive: true,
        isFeatured: true,
      },
      {
        name: "Produit Femme Bio",
        description: "Produit naturel spécialement conçu pour les femmes",
        price: "32.50",
        image: "/api/placeholder/400/300?color=f9e8f4&textColor=a6467a",
        categoryId: 2,
        stock: 25,
        isActive: true,
        isFeatured: false,
      },
      {
        name: "Produit Amincissant Naturel",
        description: "Aide à la perte de poids de manière naturelle",
        price: "45.99",
        image: "/api/placeholder/400/300?color=e8f2ff&textColor=2d4a8b",
        categoryId: 5,
        stock: 15,
        isActive: true,
        isFeatured: true,
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = { 
      ...user, 
      id: this.getNextId(), 
      createdAt: new Date(),
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      address: user.address || null,
      city: user.city || null,
      postalCode: user.postalCode || null,
      country: user.country || null,
      role: user.role || 'user'
    };
    this.users.push(newUser);
    return newUser;
  }

  async createUserWithAuth(userData: { firstName: string; lastName: string; email: string; password: string; role?: 'user' | 'admin' }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.createUser({
      username: userData.email,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.find(c => c.id === id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return this.categories.find(c => c.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory = { 
      ...category, 
      id: this.getNextId(), 
      createdAt: new Date(),
      description: category.description || null,
      image: category.image || null,
      parentId: category.parentId || null,
      sortOrder: category.sortOrder || null
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: InsertCategory): Promise<Category | undefined> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.categories[index] = { ...this.categories[index], ...category };
    return this.categories[index];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.categories.splice(index, 1);
    return true;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return this.products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find(p => p.id === id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.products.filter(p => p.categoryId === categoryId);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter(p => p.isFeatured);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct = { 
      ...product, 
      id: this.getNextId(), 
      createdAt: new Date(),
      description: product.description || null,
      images: product.images || null,
      categoryId: product.categoryId || null,
      stock: product.stock || 0,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async updateProductFeaturedStatus(id: number, isFeatured: boolean): Promise<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    if (!product) return undefined;
    product.isFeatured = isFeatured;
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.orders.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orders.filter(o => o.userId === userId);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder = { ...order, id: this.getNextId(), createdAt: new Date() };
    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    if (!order) return undefined;
    order.status = status;
    return order;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.filter(oi => oi.orderId === orderId);
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const newOrderItem = { ...orderItem, id: this.getNextId() };
    this.orderItems.push(newOrderItem);
    return newOrderItem;
  }

  // Reviews
  async getReviews(productId: number): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId && r.isApproved);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.reviews.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createReview(review: InsertReview): Promise<Review> {
    const newReview = { ...review, id: this.getNextId(), createdAt: new Date() };
    this.reviews.push(newReview);
    return newReview;
  }

  async updateReviewApproval(id: number, isApproved: boolean): Promise<Review | undefined> {
    const review = this.reviews.find(r => r.id === id);
    if (!review) return undefined;
    review.isApproved = isApproved;
    return review;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact = { ...contact, id: this.getNextId(), createdAt: new Date(), isRead: false };
    this.contacts.push(newContact);
    return newContact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return this.contacts.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async markContactAsRead(id: number): Promise<Contact | undefined> {
    const contact = this.contacts.find(c => c.id === id);
    if (!contact) return undefined;
    contact.isRead = true;
    return contact;
  }

  // Newsletter
  async createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter> {
    const newNewsletter = { ...newsletter, id: this.getNextId(), createdAt: new Date() };
    this.newsletters.push(newNewsletter);
    return newNewsletter;
  }

  // Chat Messages
  async getChatMessages(): Promise<ChatMessage[]> {
    return this.chatMessages.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage> {
    const newChatMessage = { 
      ...chatMessage, 
      id: this.getNextId(), 
      createdAt: new Date(),
      isRead: chatMessage.isRead || false,
      userAgent: chatMessage.userAgent || null,
      url: chatMessage.url || null,
      ipAddress: chatMessage.ipAddress || null,
      adminResponse: chatMessage.adminResponse || null,
      respondedAt: chatMessage.respondedAt || null,
      respondedBy: chatMessage.respondedBy || null
    };
    this.chatMessages.push(newChatMessage);
    return newChatMessage;
  }

  async markChatMessageAsRead(id: number): Promise<ChatMessage | undefined> {
    const message = this.chatMessages.find(m => m.id === id);
    if (!message) return undefined;
    message.isRead = true;
    return message;
  }

  async respondToChatMessage(id: number, response: string, adminId: number): Promise<ChatMessage | undefined> {
    const message = this.chatMessages.find(m => m.id === id);
    if (!message) return undefined;
    message.adminResponse = response;
    message.respondedBy = adminId;
    message.respondedAt = new Date();
    return message;
  }

  // Testimonials
  async getTestimonials(): Promise<(Testimonial & { product?: Product | null })[]> {
    return this.testimonials
      .filter(t => t.isActive)
      .map(t => ({
        ...t,
        product: t.productId ? this.products.find(p => p.id === t.productId) || null : null
      }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getAllTestimonials(): Promise<(Testimonial & { product?: Product | null })[]> {
    return this.testimonials
      .map(t => ({
        ...t,
        product: t.productId ? this.products.find(p => p.id === t.productId) || null : null
      }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.find(t => t.id === id);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newTestimonial = { ...testimonial, id: this.getNextId(), createdAt: new Date() };
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: InsertTestimonial): Promise<Testimonial | undefined> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    this.testimonials[index] = { ...this.testimonials[index], ...testimonial };
    return this.testimonials[index];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const index = this.testimonials.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.testimonials.splice(index, 1);
    return true;
  }

  // Hero Slides
  async getHeroSlides(): Promise<HeroSlide[]> {
    return this.heroSlides.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  async getHeroSlide(id: number): Promise<HeroSlide | undefined> {
    return this.heroSlides.find(s => s.id === id);
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const newSlide = { ...slide, id: this.getNextId(), createdAt: new Date() };
    this.heroSlides.push(newSlide);
    return newSlide;
  }

  async updateHeroSlide(id: number, slide: InsertHeroSlide): Promise<HeroSlide | undefined> {
    const index = this.heroSlides.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.heroSlides[index] = { ...this.heroSlides[index], ...slide };
    return this.heroSlides[index];
  }

  async deleteHeroSlide(id: number): Promise<boolean> {
    const index = this.heroSlides.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.heroSlides.splice(index, 1);
    return true;
  }
}

// Create storage with automatic fallback
async function createStorage(): Promise<IStorage> {
  // Try database first
  try {
    const dbStorage = new DatabaseStorage();
    // Test database connection
    await dbStorage.getCategories();
    console.log("✅ Using database storage");
    return dbStorage;
  } catch (error) {
    console.warn("⚠️  Database unavailable, falling back to in-memory storage:", error.message);
    const memStorage = new MemStorage();
    await memStorage.initializeData();
    return memStorage;
  }
}

// Export storage initialization promise
export const storagePromise = createStorage();
export let storage: IStorage;
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
} from "@shared/schema";
import { db } from "./db";
import { eq, like, ilike } from "drizzle-orm";
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
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

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

  // Auth
  createUserWithAuth(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
  }): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async initializeData() {
    // Initialize categories
    const categoriesData = [
      {
        name: "Miel & Apiculture",
        description: "Miel artisanal et produits de la ruche",
        slug: "miel-apiculture",
      },
      {
        name: "Huiles Essentielles",
        description: "Huiles essentielles pures et biologiques",
        slug: "huiles-essentielles",
      },
      {
        name: "Tisanes & Infusions",
        description: "Tisanes aux plantes naturelles",
        slug: "tisanes-infusions",
      },
      {
        name: "Cosmétiques Naturels",
        description: "Soins naturels pour le corps",
        slug: "cosmetiques-naturels",
      },
    ];

    // Check if categories exist, if not, create them
    const existingCategories = await this.getCategories();
    if (existingCategories.length === 0) {
      for (const cat of categoriesData) {
        await this.createCategory(cat);
      }
    }

    // Initialize products
    const productsData = [
      {
        name: "Miel Bio Artisanal",
        description:
          "Miel de fleurs sauvages récolté localement par nos apiculteurs partenaires. Un goût authentique et des bienfaits naturels préservés.",
        price: "34.99",
        image:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        categoryId: 1,
        stock: 50,
        isActive: true,
      },
      {
        name: "Huiles Essentielles Bio",
        description:
          "Coffret de 6 huiles essentielles pures : lavande, eucalyptus, menthe, citron, tea tree et romarin. Idéal pour l'aromathérapie.",
        price: "119.99",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        categoryId: 2,
        stock: 25,
        isActive: true,
      },
      {
        name: "Tisane Détox Bio",
        description:
          "Mélange de plantes biologiques pour une détoxification naturelle. Contient du pissenlit, de la bardane et du thé vert.",
        price: "24.99",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1597318020386-ab2dcda8e8c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        categoryId: 3,
        stock: 100,
        isActive: true,
      },
      {
        name: "Crème Hydratante Bio",
        description:
          "Crème hydratante aux ingrédients naturels biologiques. Idéale pour tous types de peau, enrichie en beurre de karité.",
        price: "45.99",
        image:
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1594736797933-d0601ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        ],
        categoryId: 4,
        stock: 30,
        isActive: true,
      },
    ];

    // Check if products exist, if not, create them
    const existingProducts = await this.getProducts();
    if (existingProducts.length === 0) {
      for (const prod of productsData) {
        await this.createProduct(prod);
      }
    }

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

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products).where(ilike(products.name, `%${query}%`));
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
}

export const storage = new DatabaseStorage();
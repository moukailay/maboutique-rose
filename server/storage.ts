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
import { eq, and, like, ilike } from "drizzle-orm";
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
}

export const storage = new DatabaseStorage();
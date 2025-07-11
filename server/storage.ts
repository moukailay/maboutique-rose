import { 
  users, products, categories, orders, orderItems, reviews, contacts, newsletters,
  type User, type InsertUser, type Product, type InsertProduct, type Category, type InsertCategory,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type Review, type InsertReview,
  type Contact, type InsertContact, type Newsletter, type InsertNewsletter
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  private reviews: Map<number, Review> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private newsletters: Map<number, Newsletter> = new Map();

  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentProductId = 1;
  private currentOrderId = 1;
  private currentOrderItemId = 1;
  private currentReviewId = 1;
  private currentContactId = 1;
  private currentNewsletterId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categoriesData = [
      { id: 1, name: "Miel & Apiculture", description: "Miel artisanal et produits de la ruche", slug: "miel-apiculture" },
      { id: 2, name: "Huiles Essentielles", description: "Huiles essentielles pures et biologiques", slug: "huiles-essentielles" },
      { id: 3, name: "Tisanes & Infusions", description: "Tisanes aux plantes naturelles", slug: "tisanes-infusions" },
      { id: 4, name: "Cosmétiques Naturels", description: "Soins naturels pour le corps", slug: "cosmetiques-naturels" },
    ];

    categoriesData.forEach(cat => {
      this.categories.set(cat.id, cat);
      this.currentCategoryId = Math.max(this.currentCategoryId, cat.id + 1);
    });

    // Initialize products
    const productsData = [
      {
        id: 1,
        name: "Miel Bio Artisanal",
        description: "Miel de fleurs sauvages récolté localement par nos apiculteurs partenaires. Un goût authentique et des bienfaits naturels préservés.",
        price: "24.99",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        categoryId: 1,
        stock: 50,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 2,
        name: "Huiles Essentielles Bio",
        description: "Coffret de 6 huiles essentielles pures : lavande, eucalyptus, menthe, citron, tea tree et romarin. Idéal pour l'aromathérapie.",
        price: "89.99",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        categoryId: 2,
        stock: 30,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 3,
        name: "Tisanes Bio",
        description: "Collection de 12 tisanes aux plantes : camomille, verveine, tilleul, menthe, thym et bien d'autres. Parfaites pour la détente.",
        price: "34.99",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        categoryId: 3,
        stock: 25,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 4,
        name: "Cosmétiques Naturels",
        description: "Soins visage aux ingrédients naturels : crème hydratante, sérum anti-âge, gommage doux et masque purifiant.",
        price: "49.99",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        images: [
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        categoryId: 4,
        stock: 15,
        isActive: true,
        createdAt: new Date()
      }
    ];

    productsData.forEach(prod => {
      this.products.set(prod.id, prod);
      this.currentProductId = Math.max(this.currentProductId, prod.id + 1);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      address: insertUser.address || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      city: insertUser.city || null,
      postalCode: insertUser.postalCode || null,
      country: insertUser.country || null
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    return product?.isActive ? product : undefined;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.categoryId === categoryId && p.isActive);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description?.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      description: insertProduct.description || null,
      images: insertProduct.images || null,
      categoryId: insertProduct.categoryId || null,
      stock: insertProduct.stock || 0,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true
    };
    this.products.set(id, product);
    return product;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      userId: insertOrder.userId || null,
      shippingAddress: insertOrder.shippingAddress || null,
      paymentMethod: insertOrder.paymentMethod || null
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      productId: insertOrderItem.productId || null,
      orderId: insertOrderItem.orderId || null
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Reviews
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.productId === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date(),
      productId: insertReview.productId || null,
      userId: insertReview.userId || null,
      comment: insertReview.comment || null
    };
    this.reviews.set(id, review);
    return review;
  }

  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { ...insertContact, id, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }

  // Newsletter
  async createNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = this.currentNewsletterId++;
    const newsletter: Newsletter = { ...insertNewsletter, id, createdAt: new Date() };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }
}

export const storage = new MemStorage();

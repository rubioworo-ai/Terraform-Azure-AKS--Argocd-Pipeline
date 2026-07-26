import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Pool } from "pg";

// Initialize Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = 3000;

app.use(express.json());

// Sample Mock Data
const restaurants = [
  {
    id: 1,
    name: "Pizza House",
    location: "123 Main St, Foodville",
    description: "Wood-fired artisanal pizzas & fresh garlic knots with locally sourced ingredients.",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60",
    cuisine: "Italian",
    deliveryTime: "20-30 min"
  },
  {
    id: 2,
    name: "Burger Place",
    location: "456 Oak Ave, Burgertown",
    description: "Juicy craft burgers, hand-cut golden fries, and thick premium milkshakes.",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
    cuisine: "American",
    deliveryTime: "15-25 min"
  },
  {
    id: 3,
    name: "Asian Kitchen",
    location: "789 Pine Rd, Sushiville",
    description: "Fresh sushi rolls, warm steaming dim sum, and aromatic spicy noodle soups.",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60",
    cuisine: "Asian",
    deliveryTime: "25-35 min"
  },
  {
    id: 4,
    name: "Taco Fiesta",
    location: "101 Maple St, Salsaville",
    description: "Authentic street tacos, hand-mashed guacamole, and fresh local Mexican specialties.",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=60",
    cuisine: "Mexican",
    deliveryTime: "15-25 min"
  },
  {
    id: 5,
    name: "Sweet Treats Bakery",
    location: "202 Elm St, Sweetville",
    description: "Freshly baked artisan pastries, gourmet cupcakes, espresso bar, and chilled iced teas.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60",
    cuisine: "Desserts",
    deliveryTime: "10-20 min"
  }
];

const foodItems = [
  // Pizza House
  {
    id: 101,
    restaurantId: 1,
    name: "Margherita Pizza",
    price: 14.99,
    description: "Fresh buffalo mozzarella, rich tomato sauce, and organic sweet basil leaves.",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 102,
    restaurantId: 1,
    name: "Pepperoni Blast Pizza",
    price: 16.99,
    description: "Double premium pepperoni, mozzarella cheese, and a sweet hot honey drizzle.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 103,
    restaurantId: 1,
    name: "Golden Garlic Knots",
    price: 6.99,
    description: "Warm, fluffy baked dough tossed in extra virgin olive oil, herbs, and fresh garlic.",
    image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 104,
    restaurantId: 1,
    name: "Creamy Tiramisu",
    price: 7.99,
    description: "Espresso-soaked ladyfingers, velvety mascarpone cream, and dark cocoa powder.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 105,
    restaurantId: 1,
    name: "Classic Tomato Bruschetta",
    price: 8.49,
    description: "Toasted artisan bread topped with diced vine-ripened tomatoes, garlic, basil, and aged balsamic glaze.",
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 106,
    restaurantId: 1,
    name: "Truffle Mushroom Pizza",
    price: 18.99,
    description: "Creamy wild mushroom purée, fontina cheese, white truffle oil, and baby arugula.",
    image: "https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 107,
    restaurantId: 1,
    name: "Crispy Italian Cannoli",
    price: 6.49,
    description: "Traditional pastry shell stuffed with sweet whipped ricotta cream and premium dark chocolate chips.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 108,
    restaurantId: 1,
    name: "Sparkling Limonata Soda",
    price: 3.49,
    description: "Authentic fizzy Italian beverage brewed with real lemons and cane sugar.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },

  // Burger Place
  {
    id: 201,
    restaurantId: 2,
    name: "Classic Cheeseburger",
    price: 12.99,
    description: "Flame-grilled premium beef patty, melted cheddar, lettuce, heirloom tomato, and house sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 202,
    restaurantId: 2,
    name: "BBQ Bacon Burger",
    price: 14.99,
    description: "Applewood smoked bacon, sharp cheddar, smoky sweet barbecue sauce, and crispy onion rings.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 203,
    restaurantId: 2,
    name: "Sweet Potato Fries",
    price: 5.99,
    description: "Crispy sweet potato fries seasoned with sea salt, served with a chipotle dipping aioli.",
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 204,
    restaurantId: 2,
    name: "Chocolate Fudge Milkshake",
    price: 6.49,
    description: "Thick premium vanilla bean ice cream blended with dark chocolate fudge and topped with whipped cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },
  {
    id: 205,
    restaurantId: 2,
    name: "Gourmet Onion Rings",
    price: 6.49,
    description: "Giant sweet white onions double-dipped in craft beer batter, fried to absolute crispiness.",
    image: "https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 206,
    restaurantId: 2,
    name: "Crispy Chicken Avocado Burger",
    price: 13.49,
    description: "Golden chicken breast, smashed ripe avocado, Pepper Jack cheese, and lemon herb mayo.",
    image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 207,
    restaurantId: 2,
    name: "Bacon Cheese Loaded Fries",
    price: 8.99,
    description: "Crispy classic fries smothered in melted Monterey Jack, hickory smoked bacon bits, and jalapeños.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 208,
    restaurantId: 2,
    name: "Fudge Brownie Sundae",
    price: 7.49,
    description: "Warm, rich chocolate brownie crowned with vanilla bean gelato, hot fudge, and toasted pecans.",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },

  // Asian Kitchen
  {
    id: 301,
    restaurantId: 3,
    name: "Spicy Salmon Sushi Roll",
    price: 11.99,
    description: "Fresh Atlantic salmon, cucumber, avocado, spicy house mayo, and toasted sesame.",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 302,
    restaurantId: 3,
    name: "Pad Thai Rice Noodles",
    price: 13.99,
    description: "Wok-fired flat rice noodles with organic tofu, crushed peanuts, crunchy bean sprouts, and sweet tamarind sauce.",
    image: "https://images.unsplash.com/photo-1626804475315-9644b37a2f4b?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 303,
    restaurantId: 3,
    name: "Steamed Pork Dumplings",
    price: 7.99,
    description: "Tender pork and wild chive steamed dumplings, paired with a dynamic ginger-soy dipping glaze.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 304,
    restaurantId: 3,
    name: "Organic Matcha Iced Tea",
    price: 4.99,
    description: "Finely ground premium Japanese green tea whisked with cold water, served sweetened over ice.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },
  {
    id: 305,
    restaurantId: 3,
    name: "Vegetable Crispy Spring Rolls",
    price: 6.99,
    description: "Hand-rolled golden wrappers filled with shredded carrots, cabbage, and glass noodles, served with sweet-chili dip.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 306,
    restaurantId: 3,
    name: "General Tso's Crispy Chicken",
    price: 14.99,
    description: "Deep-fried chunk chicken breast coated in a sweet and slightly spicy glaze, served over jasmine rice.",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 307,
    restaurantId: 3,
    name: "Sweet Mango Sticky Rice",
    price: 6.99,
    description: "Warm glutinous sweet rice drenched in thick salted coconut milk and paired with ripe Honey Mango slices.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 308,
    restaurantId: 3,
    name: "Traditional Thai Milk Tea",
    price: 5.49,
    description: "Strongly-brewed black tea infused with spices (star anise, cardamom) and sweetened with condensed milk.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },

  // Taco Fiesta
  {
    id: 401,
    restaurantId: 4,
    name: "Hand-Mashed Guac & Chips",
    price: 8.99,
    description: "Ripe avocados mashed daily with lime, cilantro, jalapeños, and white onions, with fresh sea salt tortilla chips.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 402,
    restaurantId: 4,
    name: "Loaded Beef Nachos",
    price: 12.99,
    description: "Crispy corn tortilla chips piled high with seasoned ground beef, warm cheese sauce, black beans, pico, and crema.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 403,
    restaurantId: 4,
    name: "Birria Taco Platter",
    price: 15.99,
    description: "Three slow-braised beef tacos in corn tortillas dipped in consome, melted Monterey Jack, served with dipping broth.",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 404,
    restaurantId: 4,
    name: "Sizzling Steak Fajitas",
    price: 17.99,
    description: "Marinated skirt steak grilled with bell peppers and onions, served with warm flour tortillas and house salsa.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60",
    category: "Mains"
  },
  {
    id: 405,
    restaurantId: 4,
    name: "Churros con Cajeta",
    price: 6.99,
    description: "Fried pastry-dough sticks dusted in cinnamon sugar, served with a warm Mexican goat-milk caramel dipping cup.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 406,
    restaurantId: 4,
    name: "Classic Cinnamon Horchata",
    price: 4.49,
    description: "Traditional refreshing milky rice drink flavored with sweet cinnamon spice and rich vanilla, over ice.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },

  // Sweet Treats Bakery
  {
    id: 501,
    restaurantId: 5,
    name: "Warm Butter Croissant",
    price: 4.49,
    description: "Super flaky, multi-layered golden butter pastry served warm with organic raspberry jam.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 502,
    restaurantId: 5,
    name: "Smoked Salmon Avocado Toast",
    price: 11.99,
    description: "Sourdough toast with smashed avocado, premium cold-smoked salmon, pickled red onions, and capers.",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&auto=format&fit=crop&q=60",
    category: "Starters"
  },
  {
    id: 503,
    restaurantId: 5,
    name: "New York Strawberry Cheesecake",
    price: 7.99,
    description: "Rich, dense cream-cheese cake over a buttery graham crust, topped with fresh glaze strawberries.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 504,
    restaurantId: 5,
    name: "Gourmet Red Velvet Cupcake",
    price: 4.99,
    description: "Moist red velvet sponge cake topped with a generous swirl of classic sweet cream cheese frosting.",
    image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?w=500&auto=format&fit=crop&q=60",
    category: "Desserts"
  },
  {
    id: 505,
    restaurantId: 5,
    name: "Salted Caramel Macchiato",
    price: 5.49,
    description: "Freshly pulled espresso shots layered with steamed whole milk, vanilla syrup, and a dark salted caramel drizzle.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  },
  {
    id: 506,
    restaurantId: 5,
    name: "Iced Peach Sweet Tea",
    price: 3.99,
    description: "House-brewed black tea cold-infused with sweet ripe Georgia peach syrup and fresh lemon wheels.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60",
    category: "Drinks"
  }
];

// Mock Databases
const notifications: any[] = [];

// API - Restaurant Endpoints
app.get("/api/restaurants", async (req, res) => {
  try {
    const query = `
      SELECT id, name, location, description, rating, image, cuisine, delivery_time AS "deliveryTime"
      FROM restaurant;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

app.get("/api/restaurants/:id/menu", async (req, res) => {
  const restId = parseInt(req.params.id);
  try {
    const query = `
      SELECT id, restaurant_id AS "restaurantId", name, price, description, image, category
      FROM food
      WHERE restaurant_id = $1;
    `;
    const result = await pool.query(query, [restId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

// API - Order Endpoints
app.post("/api/orders", async (req, res) => {
  const { customer_name, food_item, quantity, totalPrice } = req.body;

  if (!customer_name || !food_item) {
    return res.status(400).json({ error: "customer_name and food_item are required." });
  }

  try {
    const query = `
      INSERT INTO customer_order (customer_name, food_item, quantity, status, total_price, created_at)
      VALUES ($1, $2, $3, 'PENDING', $4, NOW())
      RETURNING id;
    `;
    const values = [customer_name, food_item, quantity || 1, totalPrice || 0.0];
    
    const result = await pool.query(query, values);
    
    console.log(`[Order Service] Order #${result.rows[0].id} placed by ${customer_name}`);
    res.status(201).json({ id: result.rows[0].id, ...req.body });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const query = 'SELECT * FROM customer_order WHERE id = $1';
    const result = await pool.query(query, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// API - Notification Endpoints
app.post("/api/notifications", (req, res) => {
  const { orderId, message } = req.body;

  const newNotification = {
    id: notifications.length + 1,
    orderId: orderId,
    message: message || "Your order has been received",
    timestamp: new Date().toISOString()
  };

  notifications.push(newNotification);
  console.log(`[Notification Service] Sending notification for order #${orderId}: ${newNotification.message}`);

  res.send("Your order has been received");
});

// Setup Vite Dev Server / Static Hosting
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[QuickBite Server] Full-stack gateway running on http://localhost:${PORT}`);
  });
}

start();

-- Create Restaurant Table
CREATE TABLE IF NOT EXISTS restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    rating DOUBLE PRECISION DEFAULT 4.5,
    image TEXT,
    cuisine VARCHAR(100),
    delivery_time VARCHAR(50)
);

-- Create Food Menu Table
CREATE TABLE IF NOT EXISTS food (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurant(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    description TEXT,
    image TEXT,
    category VARCHAR(100)
);

-- Create Order Table
CREATE TABLE IF NOT EXISTS customer_order (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    food_item TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    total_price DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seeding Sample Restaurants
INSERT INTO restaurant (id, name, location, description, rating, image, cuisine, delivery_time)
VALUES 
(1, 'Pizza House', '123 Main St, Foodville', 'Wood-fired artisanal pizzas & fresh garlic knots with locally sourced ingredients.', 4.8, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60', 'Italian', '20-30 min'),
(2, 'Burger Place', '456 Oak Ave, Burgertown', 'Juicy craft burgers, hand-cut golden fries, and thick premium milkshakes.', 4.6, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60', 'American', '15-25 min'),
(3, 'Asian Kitchen', '789 Pine Rd, Sushiville', 'Fresh sushi rolls, warm steaming dim sum, and aromatic spicy noodle soups.', 4.7, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60', 'Asian', '25-35 min')
ON CONFLICT (id) DO NOTHING;

-- Seeding Sample Menu Items
INSERT INTO food (id, restaurant_id, name, price, description, image, category)
VALUES
-- Pizza House (id: 1)
(101, 1, 'Margherita Pizza', 14.99, 'Fresh buffalo mozzarella, rich tomato sauce, and organic sweet basil leaves.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60', 'Mains'),
(102, 1, 'Pepperoni Blast Pizza', 16.99, 'Double premium pepperoni, mozzarella cheese, and a sweet hot honey drizzle.', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', 'Mains'),
(103, 1, 'Golden Garlic Knots', 6.99, 'Warm, fluffy baked dough tossed in extra virgin olive oil, herbs, and fresh garlic.', 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=500&auto=format&fit=crop&q=60', 'Starters'),
(104, 1, 'Creamy Tiramisu', 7.99, 'Espresso-soaked ladyfingers, velvety mascarpone cream, and dark cocoa powder.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', 'Desserts'),

-- Burger Place (id: 2)
(201, 2, 'Classic Cheeseburger', 12.99, 'Flame-grilled premium beef patty, melted cheddar, lettuce, heirloom tomato, and house sauce.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', 'Mains'),
(202, 2, 'BBQ Bacon Burger', 14.99, 'Applewood smoked bacon, sharp cheddar, smoky sweet barbecue sauce, and crispy onion rings.', 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&auto=format&fit=crop&q=60', 'Mains'),
(203, 2, 'Sweet Potato Fries', 5.99, 'Crispy sweet potato fries seasoned with sea salt, served with a chipotle dipping aioli.', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=500&auto=format&fit=crop&q=60', 'Starters'),
(204, 2, 'Chocolate Fudge Milkshake', 6.49, 'Thick premium vanilla bean ice cream blended with dark chocolate fudge and topped with whipped cream.', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60', 'Drinks'),

-- Asian Kitchen (id: 3)
(301, 3, 'Spicy Salmon Sushi Roll', 11.99, 'Fresh Atlantic salmon, cucumber, avocado, spicy house mayo, and toasted sesame.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60', 'Mains'),
(302, 3, 'Pad Thai Rice Noodles', 13.99, 'Wok-fired flat rice noodles with organic tofu, crushed peanuts, crunchy bean sprouts, and sweet tamarind sauce.', 'https://images.unsplash.com/photo-1626804475315-9644b37a2f4b?w=500&auto=format&fit=crop&q=60', 'Mains'),
(303, 3, 'Steamed Pork Dumplings', 7.99, 'Tender pork and wild chive steamed dumplings, paired with a dynamic ginger-soy dipping glaze.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60', 'Starters'),
(304, 3, 'Organic Matcha Iced Tea', 4.99, 'Finely ground premium Japanese green tea whisked with cold water, served sweetened over ice.', 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', 'Drinks')
ON CONFLICT (id) DO NOTHING;

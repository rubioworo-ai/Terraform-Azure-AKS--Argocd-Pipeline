export interface Restaurant {
  id: number;
  name: string;
  location: string;
  description: string;
  rating: number;
  image: string;
  cuisine: string;
  deliveryTime: string;
}

export interface Food {
  id: number;
  restaurantId: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  foodItem: string;
  quantity: number;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  message: string;
  type: string;
  timestamp: string;
}

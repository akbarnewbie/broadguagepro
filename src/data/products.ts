export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  sim: string;
  tag: string;
  badge: string;
  type: string;
};

export const products: Product[] = [
  // Electric Locomotives
  { id: 1, name: "WAP-7 Advanced Pack", description: "High-detail WAP-7 with multiple liveries including Rajdhani, Shatabdi & Duronto schemes. Includes detailed cab, custom sounds and realistic physics.", price: 299, rating: 4.9, reviews: 156, category: "locomotive", sim: "both", tag: "top", badge: "Best Seller", type: "Electric" },
  { id: 2, name: "WAP-5 Superfast Pack", description: "India's fastest loco with Gatimaan & Bhopal Shatabdi liveries. Aerodynamic cab detail, 160 km/h capable physics.", price: 279, rating: 4.8, reviews: 112, category: "locomotive", sim: "openrails", tag: "new", badge: "New", type: "Electric" },
  { id: 3, name: "WAG-9 Freight Hauler", description: "6000 HP freight beast with HQ textures, BOXN rake compatibility, and heavy-haul physics for mountain sections.", price: 249, rating: 4.7, reviews: 98, category: "locomotive", sim: "both", tag: "top", badge: "Popular", type: "Electric" },

  // Diesel Locomotives
  { id: 4, name: "WDM-3A Heritage Pack", description: "The iconic ALCO workhorse in multiple shed liveries. Authentic EMD 645 sound pack with turbo whine and notch transitions.", price: 229, rating: 4.6, reviews: 87, category: "locomotive", sim: "msts", tag: "sale", badge: "20% Off", type: "Diesel" },
  { id: 5, name: "WDP-4D Intercity Express", description: "EMD GT46MAC based passenger diesel with Tejas & premium express liveries. Includes detailed cab with working gauges.", price: 269, rating: 4.8, reviews: 74, category: "locomotive", sim: "openrails", tag: "new", badge: "New", type: "Diesel" },
  { id: 6, name: "WDG-4 Freight Diesel Pack", description: "Heavy-duty EMD freight diesel with CONCOR & BCNA rake setups. Realistic notching and dynamic braking sounds.", price: 219, rating: 4.5, reviews: 63, category: "locomotive", sim: "both", tag: "top", badge: "Value Pick", type: "Diesel" },
  { id: 7, name: "WDG-4D Twin Cab Pack", description: "Dual-cab variant of EMD freight diesel with enhanced visibility and modern IR liveries. Includes crew communication sounds.", price: 239, rating: 4.7, reviews: 55, category: "locomotive", sim: "openrails", tag: "new", badge: "New", type: "Diesel" },
  { id: 8, name: "WDB-4B Brake Van Loco", description: "Rare brake-van equipped diesel with authentic Indian Railways detailing. Perfect for yard shunting and trip workings.", price: 179, rating: 4.4, reviews: 38, category: "locomotive", sim: "msts", tag: "sale", badge: "Rare Find", type: "Diesel" },

  // LHB Coaches
  { id: 9, name: "LHB AC Tier Coach Set", description: "Complete LHB AC coach set — 1AC, 2AC, 3AC with accurate interiors, lighting, and Rajdhani/Duronto liveries.", price: 349, rating: 4.9, reviews: 134, category: "coach", sim: "both", tag: "top", badge: "Best Seller", type: "LHB" },
  { id: 10, name: "LHB Sleeper & General Set", description: "LHB SL and GS coaches with detailed interiors, pantry car, and guard van. Multiple colour schemes included.", price: 299, rating: 4.7, reviews: 91, category: "coach", sim: "openrails", tag: "new", badge: "New", type: "LHB" },
  { id: 11, name: "LHB Chair Car Pack", description: "CC and EC chair cars in Shatabdi, Jan Shatabdi and Gatimaan Express liveries with premium interior detailing.", price: 269, rating: 4.8, reviews: 78, category: "coach", sim: "both", tag: "top", badge: "Popular", type: "LHB" },

  // ICF Coaches
  { id: 12, name: "ICF Classic Coach Set", description: "Traditional ICF coaches in vintage blue/red liveries. SL, GEN, 2S classes with nostalgic interior detailing.", price: 249, rating: 4.6, reviews: 105, category: "coach", sim: "msts", tag: "sale", badge: "Heritage", type: "ICF" },
  { id: 13, name: "ICF Mail/Express Pack", description: "Complete mail/express formation with RSA, brake van, and pantry. Authentic coupling and buffer sounds.", price: 229, rating: 4.5, reviews: 67, category: "coach", sim: "both", tag: "top", badge: "Classic", type: "ICF" },

  // EMU
  { id: 14, name: "Mumbai Suburban EMU Pack", description: "12-car and 15-car Mumbai local EMU sets with Bombardier and BHEL variants. Includes AC & non-AC versions.", price: 319, rating: 4.8, reviews: 143, category: "emu", sim: "openrails", tag: "top", badge: "Fan Favourite", type: "EMU" },
  { id: 15, name: "Kolkata EMU Heritage Set", description: "Classic Kolkata suburban EMU with ICF-style rakes. Authentic motor sounds and station announcement integration.", price: 259, rating: 4.6, reviews: 52, category: "emu", sim: "both", tag: "new", badge: "New", type: "EMU" },

  // Routes
  { id: 16, name: "Konkan Coastal Route", description: "Scenic coastal mainline with 92 tunnels, sweeping viaducts and superelevated curves through the Western Ghats.", price: 449, rating: 5.0, reviews: 89, category: "route", sim: "openrails", tag: "top", badge: "5★ Rated", type: "Route" },
  { id: 17, name: "Mumbai-Pune Deccan Route", description: "Challenging ghat section with reversing stations, steep gradients, and Bhor Ghat spiral. Includes Lonavala yard.", price: 399, rating: 4.9, reviews: 71, category: "route", sim: "both", tag: "new", badge: "New", type: "Route" },

  // Bundles
  { id: 18, name: "BGPro Mega Starter Bundle", description: "4 locos, 3 coach sets, 1 route — everything you need to start your Indian Railways simulation journey.", price: 999, rating: 4.9, reviews: 210, category: "bundle", sim: "both", tag: "sale", badge: "Save 40%", type: "Bundle" },
  { id: 19, name: "Diesel Era Collection", description: "Complete diesel experience: WDM-3A, WDP-4D, WDG-4, WDG-4D + freight consists and a bonus hill route.", price: 799, rating: 4.8, reviews: 88, category: "bundle", sim: "openrails", tag: "sale", badge: "Save 35%", type: "Bundle" },
];

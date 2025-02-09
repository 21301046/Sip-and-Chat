export const products = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    description: "A light roasted coffee with floral and citrus notes, featuring a delicate body and bright acidity.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9",
    category: "beans",
    weight: "12 oz",
    origin: "Ethiopia",
    roastLevel: "light",
    details: {
      flavor: ["Floral", "Citrus", "Bergamot", "Honey"],
      process: "Washed",
      altitude: "1,750 - 2,200 meters",
      brewingTips: [
        "Use water at 200°F/93°C",
        "18g coffee to 300ml water",
        "Total brew time: 2:30-3:00 minutes"
      ],
      storageInstructions: "Store in an airtight container away from direct sunlight"
    },
    rating: 4.8,
    reviews: [
      {
        id: 1,
        userId: "user1",
        userName: "Coffee Enthusiast",
        rating: 5,
        comment: "The floral notes in this coffee are incredible! Perfect morning brew.",
        date: "2024-02-15",
        verified: true
      },
      {
        id: 2,
        userId: "user2",
        userName: "Sarah M.",
        rating: 4,
        comment: "Lovely light roast with amazing citrus notes. Could be a bit stronger.",
        date: "2024-02-10",
        verified: true
      }
    ]
  },
  {
    id: 2,
    name: "Colombian Supremo",
    description: "Medium roasted with notes of caramel and nuts, perfectly balanced with a smooth finish.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7",
    category: "beans",
    weight: "12 oz",
    origin: "Colombia",
    roastLevel: "medium",
    details: {
      flavor: ["Caramel", "Nuts", "Chocolate", "Brown Sugar"],
      process: "Washed",
      altitude: "1,500 - 1,800 meters",
      brewingTips: [
        "Use water at 205°F/96°C",
        "20g coffee to 320ml water",
        "Total brew time: 3:00-3:30 minutes"
      ],
      storageInstructions: "Store in an airtight container away from direct sunlight"
    },
    rating: 4.6,
    reviews: [
      {
        id: 3,
        userId: "user3",
        userName: "John D.",
        rating: 5,
        comment: "My go-to coffee. Perfect balance and consistently good.",
        date: "2024-02-20",
        verified: true
      }
    ]
  },
  {
    id: 3,
    name: "Sumatra Dark Roast",
    description: "Bold and full-bodied with earthy tones and a hint of dark chocolate.",
    price: 17.99,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
    category: "beans",
    weight: "12 oz",
    origin: "Indonesia",
    roastLevel: "dark",
    details: {
      flavor: ["Dark Chocolate", "Earth", "Spices", "Cedar"],
      process: "Wet-Hulled",
      altitude: "1,200 - 1,500 meters",
      brewingTips: [
        "Use water at 205°F/96°C",
        "22g coffee to 350ml water",
        "Total brew time: 3:30-4:00 minutes"
      ],
      storageInstructions: "Store in an airtight container away from direct sunlight"
    },
    rating: 4.7,
    reviews: [
      {
        id: 4,
        userId: "user4",
        userName: "Dark Roast Lover",
        rating: 5,
        comment: "The boldness and complexity of this coffee is outstanding!",
        date: "2024-02-18",
        verified: true
      }
    ]
  },
  {
    id: 4,
    name: "Precision Coffee Scale",
    description: "Digital scale with 0.1g accuracy, perfect for pour-over brewing.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1517080556335-251daa87b3d3",
    category: "equipment",
    details: {
      brewingTips: [
        "Calibrate before each use",
        "Keep away from heat sources",
        "Clean with dry cloth only"
      ]
    },
    rating: 4.9,
    reviews: [
      {
        id: 5,
        userId: "user5",
        userName: "Precision Brewer",
        rating: 5,
        comment: "Essential tool for consistent brewing. Very accurate and reliable.",
        date: "2024-02-12",
        verified: true
      }
    ]
  },
  {
    id: 5,
    name: "Gooseneck Kettle",
    description: "Temperature control kettle for precise pour-over brewing.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1522012188892-24beb302783d",
    category: "equipment",
    details: {
      brewingTips: [
        "Pre-heat before use",
        "Descale monthly",
        "Use filtered water for best results"
      ]
    },
    rating: 4.7,
    reviews: [
      {
        id: 6,
        userId: "user6",
        userName: "Pour Over Pro",
        rating: 5,
        comment: "Perfect flow control and temperature stability. A must-have!",
        date: "2024-02-14",
        verified: true
      }
    ]
  },
  {
    id: 6,
    name: "Ceramic Pour-Over Dripper",
    description: "Handcrafted ceramic dripper for optimal extraction.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
    category: "accessories",
    details: {
      brewingTips: [
        "Pre-wet filter",
        "Rinse with hot water before use",
        "Hand wash only"
      ]
    },
    rating: 4.8,
    reviews: [
      {
        id: 7,
        userId: "user7",
        userName: "Manual Brew Master",
        rating: 5,
        comment: "Beautiful design and excellent heat retention. Makes amazing coffee!",
        date: "2024-02-16",
        verified: true
      }
    ]
  }
] as const;
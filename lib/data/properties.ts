import { Property } from "@/types/property";

export const ADRON_PROPERTIES: Property[] = [
  {
    id: "eko-city-shimawa",
    slug: "eko-city-shimawa",
    name: "Eko City Estate",
    tagline: "The Smart Eco-City Experience near Redemption Camp",
    location: "Shimawa, behind Redemption Camp",
    city: "Shimawa",
    state: "Ogun",
    type: "land",
    status: "Fast Selling",
    titleDocument: "Certificate of Occupancy (C of O)",
    discountPercentage: 40,
    startingPrice: 12000000,
    promoStartingPrice: 7200000,
    minInitialDeposit: 100000,
    description:
      "Eko City Estate is Adron Homes' flagship eco-friendly mega smart city development. Situated in the serene environment of Shimawa just behind the Redemption Camp, this estate offers top-notch infrastructure, paved access roads, 24/7 security surveillance, recreational centers, and electricity connection. Enjoy up to 40% discount during our ongoing promo campaign.",
    features: [
      "Interlocked Roads & Drainage Network",
      "Perimeter Fencing & Gate House",
      "24/7 Solar Street Lighting",
      "Green Parks & Children Play Area",
      "Shopping Complex & Sports Center",
      "Electricity & Transformer Connection",
    ],
    amenities: ["Interlocked Roads", "Security Post", "Perimeter Fence", "Recreation Park", "Street Lights", "Electricity"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    address: "Eko City, Off Shimawa Road, Ogun State",
    coordinates: { lat: 6.7833, lng: 3.4833 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm (Half Plot)", outrightPrice: 7200000, promoPrice: 4320000 },
      { sizeSqm: 500, label: "500 sqm (Full Plot)", outrightPrice: 12000000, promoPrice: 7200000 },
      { sizeSqm: 1000, label: "1,000 sqm (Commercial Plot)", outrightPrice: 24000000, promoPrice: 14400000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright (Pay within 30 days)", initialDeposit: 7200000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 7200000 },
      { durationMonths: 12, label: "12 Months Flexible", initialDeposit: 100000, monthlyAmount: 591666, dailyEquivalent: 19722, totalPrice: 7200000 },
      { durationMonths: 24, label: "24 Months Flexible", initialDeposit: 100000, monthlyAmount: 295833, dailyEquivalent: 9861, totalPrice: 7200000 },
      { durationMonths: 36, label: "36 Months Super Flexible", initialDeposit: 50000, monthlyAmount: 198611, dailyEquivalent: 6620, totalPrice: 7200000 }
    ]
  },
  {
    id: "manhattan-park-gardens",
    slug: "manhattan-park-gardens",
    name: "Manhattan Park & Gardens",
    tagline: "Serenity & Prestige in the Heart of Karu",
    location: "Karu, Abuja Expansion Corridor",
    city: "Karu",
    state: "Abuja",
    type: "land",
    status: "Available",
    titleDocument: "Certificate of Occupancy (C of O)",
    discountPercentage: 50,
    startingPrice: 15000000,
    promoStartingPrice: 7500000,
    minInitialDeposit: 100000,
    description:
      "Inspired by modern metropolitan urban planning, Manhattan Park & Gardens brings affordable luxury to Abuja environs. Located in Karu along the central capital expansion axis, this estate offers smooth access to Abuja Central Business District (CBD). Instant physical allocation upon completion of initial deposit requirement.",
    features: [
      "Helipad & Executive Lounge Access",
      "Paved Internal Roads",
      "CCTV Surveillance Security",
      "Underground Cable Network",
      "Commercial Hub & Supermarket",
      "Clean Water Distribution System",
    ],
    amenities: ["Security Post", "Paved Roads", "Solar Lights", "Drainage", "Sports Club"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    address: "Karu Expressway, Abuja Axis",
    coordinates: { lat: 9.0084, lng: 7.5746 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm (Half Plot)", outrightPrice: 9000000, promoPrice: 4500000 },
      { sizeSqm: 500, label: "500 sqm (Full Plot)", outrightPrice: 15000000, promoPrice: 7500000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright (Pay within 30 days)", initialDeposit: 7500000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 7500000 },
      { durationMonths: 12, label: "12 Months Flexible", initialDeposit: 100000, monthlyAmount: 616666, dailyEquivalent: 20555, totalPrice: 7500000 },
      { durationMonths: 24, label: "24 Months Flexible", initialDeposit: 100000, monthlyAmount: 308333, dailyEquivalent: 10277, totalPrice: 7500000 },
      { durationMonths: 36, label: "36 Months Super Flexible", initialDeposit: 50000, monthlyAmount: 206944, dailyEquivalent: 6898, totalPrice: 7500000 }
    ]
  },
  {
    id: "town-park-gardens-ibeju-lekki",
    slug: "town-park-gardens-ibeju-lekki",
    name: "Town Park & Gardens",
    tagline: "Prime Investment Near Dangote Refinery & Lekki Deep Sea Port",
    location: "Ibeju-Lekki, New Lagos Hub",
    city: "Ibeju-Lekki",
    state: "Lagos",
    type: "land",
    status: "Fast Selling",
    titleDocument: "Approved Excision",
    discountPercentage: 35,
    startingPrice: 18000000,
    promoStartingPrice: 11700000,
    minInitialDeposit: 200000,
    description:
      "Position your portfolio in New Lagos. Town Park & Gardens Ibeju-Lekki is strategically located near major economic catalysts including the Lekki Free Trade Zone, Dangote Refinery, and Lekki Deep Sea Port. High capital appreciation guaranteed.",
    features: [
      "High Return on Investment (ROI)",
      "Good Topography (100% Dry Land)",
      "Smart Security Gatehouse",
      "Street Lights & Central Drainage",
      "Proximity to Coastal Road",
    ],
    amenities: ["Dry Land", "Gate House", "Drainage", "Security", "Good Road Network"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    address: "Off Lekki-Epe Expressway, Ibeju-Lekki, Lagos State",
    coordinates: { lat: 6.4711, lng: 3.9167 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm (Half Plot)", outrightPrice: 10800000, promoPrice: 7020000 },
      { sizeSqm: 500, label: "500 sqm (Full Plot)", outrightPrice: 18000000, promoPrice: 11700000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright Purchase", initialDeposit: 11700000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 11700000 },
      { durationMonths: 12, label: "12 Months Plan", initialDeposit: 200000, monthlyAmount: 958333, dailyEquivalent: 31944, totalPrice: 11700000 },
      { durationMonths: 24, label: "24 Months Plan", initialDeposit: 200000, monthlyAmount: 479166, dailyEquivalent: 15972, totalPrice: 11700000 }
    ]
  },
  {
    id: "treasure-park-gardens-city-of-david",
    slug: "treasure-park-gardens-city-of-david",
    name: "Treasure Park & Gardens (City of David)",
    tagline: "Resort Style Living with World Class Infrastructure",
    location: "Shimawa, Mowe/Ofada Axis",
    city: "Shimawa",
    state: "Ogun",
    type: "residential",
    status: "Available",
    titleDocument: "Certificate of Occupancy (C of O)",
    discountPercentage: 30,
    startingPrice: 25000000,
    promoStartingPrice: 17500000,
    minInitialDeposit: 250000,
    description:
      "Treasure Park & Gardens City of David is Adron's pioneer resort estate featuring luxury detached bungalows, duplexes, and serviced residential plots. Comes with artificial lake, golf court, basketball arena, swimming pools, and 24-hour estate management.",
    features: [
      "Resort Amenities & Swimming Pool",
      "Basketball & Tennis Courts",
      "Artificial Lake & Picnic Grounds",
      "Instant Plot & House Allocation",
      "Full Facility Management",
    ],
    amenities: ["Swimming Pool", "Golf Course", "Gym & Fitness", "Security", "Supermarket"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: true,
    address: "City of David, Shimawa, Ogun State",
    coordinates: { lat: 6.7801, lng: 3.4891 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm Serviced Plot", outrightPrice: 15000000, promoPrice: 10500000 },
      { sizeSqm: 500, label: "500 sqm Serviced Plot", outrightPrice: 25000000, promoPrice: 17500000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright Pay", initialDeposit: 17500000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 17500000 },
      { durationMonths: 12, label: "12 Months Plan", initialDeposit: 250000, monthlyAmount: 1437500, dailyEquivalent: 47916, totalPrice: 17500000 },
      { durationMonths: 24, label: "24 Months Plan", initialDeposit: 250000, monthlyAmount: 718750, dailyEquivalent: 23958, totalPrice: 17500000 }
    ]
  },
  {
    id: "imperial-park-gardens-ibadan",
    slug: "imperial-park-gardens-ibadan",
    name: "Imperial Park & Gardens",
    tagline: "Royal Living in Alomaja, Ibadan",
    location: "Alomaja, Ibadan Axis",
    city: "Ibadan",
    state: "Oyo",
    type: "land",
    status: "New Launch",
    titleDocument: "Registered Survey & Deed",
    discountPercentage: 50,
    startingPrice: 6000000,
    promoStartingPrice: 3000000,
    minInitialDeposit: 50000,
    description:
      "Imperial Park & Gardens brings royal, affordable living to Ibadan. Nestled in Alomaja, near the Ibadan-Ilorin corridor and toll gate, this project offers smooth dry terrain, estate security, and fast-growing surrounding infrastructure.",
    features: [
      "50% Promo Price Cut",
      "100% Dry Land Topography",
      "Fast-Developing Neighborhood",
      "Flexible Daily Payment of ₦2,700",
      "Free Deed of Assignment Promo"
    ],
    amenities: ["Security Gate", "Perimeter Wall", "Good Topography", "Electricity"],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    address: "Alomaja, Lagos-Ibadan Expressway Axis, Ibadan",
    coordinates: { lat: 7.3775, lng: 3.9470 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm (Half Plot)", outrightPrice: 3600000, promoPrice: 1800000 },
      { sizeSqm: 500, label: "500 sqm (Full Plot)", outrightPrice: 6000000, promoPrice: 3000000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright Purchase", initialDeposit: 3000000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 3000000 },
      { durationMonths: 12, label: "12 Months Plan", initialDeposit: 50000, monthlyAmount: 245833, dailyEquivalent: 8194, totalPrice: 3000000 },
      { durationMonths: 36, label: "36 Months Flexible", initialDeposit: 25000, monthlyAmount: 82638, dailyEquivalent: 2754, totalPrice: 3000000 }
    ]
  },
  {
    id: "grandview-park-gardens-atan-ota",
    slug: "grandview-park-gardens-atan-ota",
    name: "Grandview Park & Gardens",
    tagline: "Serene Residential Living in Atan-Ota",
    location: "Atan-Ota Industrial Corridor",
    city: "Ota",
    state: "Ogun",
    type: "land",
    status: "Available",
    titleDocument: "Approved Excision",
    discountPercentage: 45,
    startingPrice: 8000000,
    promoStartingPrice: 4400000,
    minInitialDeposit: 50000,
    description:
      "Grandview Park & Gardens in Atan-Ota offers peaceful residential plots close to Covenant University and the industrial belt of Ota. Excellent for long-term residential land banking and immediate home construction.",
    features: [
      "Close to Educational Institutions",
      "Good Accessible Road",
      "Electrification & Street Lighting",
      "Instant Allocation Guarantee"
    ],
    amenities: ["Gatehouse", "Paved Roads", "Security Guards", "Transformer Connection"],
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    featured: false,
    address: "Atan-Ota Expressway, Ogun State",
    coordinates: { lat: 6.6881, lng: 3.1256 },
    plotOptions: [
      { sizeSqm: 300, label: "300 sqm (Half Plot)", outrightPrice: 4800000, promoPrice: 2640000 },
      { sizeSqm: 500, label: "500 sqm (Full Plot)", outrightPrice: 8000000, promoPrice: 4400000 }
    ],
    paymentPlans: [
      { durationMonths: 1, label: "Outright Purchase", initialDeposit: 4400000, monthlyAmount: 0, dailyEquivalent: 0, totalPrice: 4400000 },
      { durationMonths: 24, label: "24 Months Plan", initialDeposit: 50000, monthlyAmount: 181250, dailyEquivalent: 6041, totalPrice: 4400000 },
      { durationMonths: 36, label: "36 Months Flexible", initialDeposit: 25000, monthlyAmount: 121527, dailyEquivalent: 4050, totalPrice: 4400000 }
    ]
  }
];

export function getPropertyById(id: string): Property | undefined {
  return ADRON_PROPERTIES.find((p) => p.id === id || p.slug === id);
}

export function searchProperties(options?: {
  query?: string;
  state?: string;
  type?: string;
  maxPrice?: number;
  featured?: boolean;
}): Property[] {
  let results = [...ADRON_PROPERTIES];

  if (!options) return results;

  if (options.query) {
    const q = options.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (options.state && options.state !== "all") {
    results = results.filter((p) => p.state.toLowerCase() === options.state?.toLowerCase());
  }

  if (options.type && options.type !== "all") {
    results = results.filter((p) => p.type === options.type);
  }

  if (options.maxPrice && options.maxPrice > 0) {
    results = results.filter(
      (p) => (p.promoStartingPrice || p.startingPrice) <= options.maxPrice!
    );
  }

  if (options.featured) {
    results = results.filter((p) => p.featured);
  }

  return results;
}

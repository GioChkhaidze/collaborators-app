import type { 
  Campaign, 
  CollaboratorProfile, 
  MerchantLeaderboardEntry, 
  TierConfig,
  StatusConfig,
  Tier,
  EnrollmentStatus
} from './types';

// ==================== TIER SYSTEM ====================
export const tierConfig: Record<Tier, TierConfig> = {
  rookie: { label: 'Rookie', threshold: 0, color: 'text-gray-600', bgColor: 'bg-gray-100', icon: '🌱', gradient: 'from-gray-400 to-gray-600' },
  bronze: { label: 'Bronze', threshold: 3, color: 'text-amber-700', bgColor: 'bg-amber-100', icon: '🥉', gradient: 'from-amber-400 to-amber-600' },
  silver: { label: 'Silver', threshold: 10, color: 'text-slate-600', bgColor: 'bg-slate-200', icon: '🥈', gradient: 'from-slate-400 to-slate-600' },
  gold: { label: 'Gold', threshold: 25, color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: '🥇', gradient: 'from-yellow-400 to-yellow-600' },
  platinum: { label: 'Platinum', threshold: 50, color: 'text-purple-600', bgColor: 'bg-purple-100', icon: '💎', gradient: 'from-purple-400 to-purple-600' },
};

export const tierOrder: Tier[] = ['rookie', 'bronze', 'silver', 'gold', 'platinum'];

// ==================== STATUS CONFIG ====================
export const statusConfig: Record<EnrollmentStatus, StatusConfig> = {
  enrolled: { label: 'Pending Upload', color: 'text-yellow-700', bgColor: 'bg-yellow-100', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  uploaded: { label: 'Uploaded', color: 'text-blue-700', bgColor: 'bg-blue-100', bg: 'bg-blue-100', text: 'text-blue-700' },
  processing: { label: 'Processing', color: 'text-blue-700', bgColor: 'bg-blue-100', bg: 'bg-blue-100', text: 'text-blue-700' },
  'under-review': { label: 'Under Review', color: 'text-purple-700', bgColor: 'bg-purple-100', bg: 'bg-purple-100', text: 'text-purple-700' },
  approved: { label: 'Approved', color: 'text-green-700', bgColor: 'bg-green-100', bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100', bg: 'bg-red-100', text: 'text-red-700' },
};

// ==================== MOCK CAMPAIGNS ====================
export const campaigns: Campaign[] = [
  {
    id: "camp-1",
    merchant: "Tea Time",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqawVmP77HQWimN-bUvxVpOlpLE8gYHAXCw&s",
    vertical: "Restaurant",
    category: "Cafe & Wraps",
    discount: "25% off up to 25 QAR",
    reward: "16% of discount value",
    rewardExample: "25 QAR discount = 4.00 QAR for you",
    minOrder: "Min order 35 QAR",
    videoReq: "15-45 sec video",
    requirements: [
      "Video must be 15-45 seconds",
      "Show the item clearly (close-up bite/cut shot encouraged)",
      "Mention the discount clearly",
      "Include Snoonu branding (overlay or verbal mention)",
      "No competitor mentions"
    ],
    budget: "600 referrals available",
    timeline: "Campaign runs until Mar 10, 2026",
    reviewNotes: "Keep it cozy and quick—hook in the first 2 seconds performs best.",
    productImage: "https://images.snoonu.com/image_product/2022-09/VHuOXJm9L6.png?format=webp",
    productName: "Spanish Wrap"
  },
  {
    id: "camp-2",
    merchant: "Korean Beauty",
    logo: "https://kbeauty.qa/cdn/shop/files/kb_png_for_website_500x.png?v=1764239313",
    vertical: "Market",
    category: "Beauty & Skincare",
    discount: "15% off up to 60 QAR",
    reward: "12% of discount value",
    rewardExample: "60 QAR discount = 7.20 QAR for you",
    minOrder: "Min order 150 QAR",
    videoReq: "20-60 sec video",
    requirements: [
      "Video must be 20-60 seconds",
      "Show product + texture/application shot",
      "Mention shade name or why it matches you",
      "Clean, well-lit frame (no heavy filters)",
      "Family-friendly content only"
    ],
    budget: "250 referrals available",
    timeline: "Campaign runs until Apr 05, 2026",
    reviewNotes: "Before/after or quick wear-test style content usually gets approved fastest.",
    productImage: "https://images.snoonu.com/product/2024-8/475e2562-4602-4870-bedb-9adcf89b0029_21CCOOLIVORY.jpg",
    productName: "Tirtir Mask Fit Red Cushion - Natural Beige 29N"
  },
  {
    id: "camp-3",
    merchant: "McDonalds",
    logo: "https://www.mcdonalds.com/content/dam/sites/ArabiaGWS/arabic/nfl/logo/McDonalds_Logo.png",
    vertical: "Restaurant",
    category: "Fast Food",
    discount: "20% off up to 30 QAR",
    reward: "14% of discount value",
    rewardExample: "30 QAR discount = 4.20 QAR for you",
    minOrder: "Min order 45 QAR",
    videoReq: "15-60 sec video",
    requirements: [
      "Video must be 15-60 seconds",
      "Show the bundle + unbagging shot",
      "Mention the discount offer clearly",
      "Include Snoonu delivery mention (speed/packaging)",
      "No competitor mentions"
    ],
    budget: "1200 referrals available",
    timeline: "Campaign runs until Feb 20, 2026",
    reviewNotes: "Unboxing + first bite reaction tends to perform best.",
    productImage: "https://images.snoonu.com/brand_product/2025-09/e06e089c-196e-4208-9496-8fa8b40174fd_output.png?format=webp",
    productName: "Snoonu Bundle"
  },
  {
    id: "camp-4",
    merchant: "Karak Mqanes",
    logo: "https://images.deliveryhero.io/image/talabat/restaurants/logo_94637864896607282057.jpg?width=180",
    vertical: "Restaurant",
    category: "Tea & Snacks",
    discount: "30% off up to 20 QAR",
    reward: "18% of discount value",
    rewardExample: "20 QAR discount = 3.60 QAR for you",
    minOrder: "Min order 25 QAR",
    videoReq: "10-40 sec video",
    requirements: [
      "Video must be 10-40 seconds",
      "Show the drink pouring/steam shot",
      "Mention the promo clearly",
      "Keep it authentic (no scripted vibe needed)",
      "Family-friendly content only"
    ],
    budget: "500 referrals available",
    timeline: "Campaign runs until Mar 01, 2026",
    reviewNotes: "Short karak-pour clips + cozy vibes usually get strong engagement.",
    productImage: "https://images.snoonu.com/menu_item/2024-8/e278955f-07d1-4d40-a5dd-7b82d9e32109_del34.jpg?format=webp",
    productName: "Signature Karak"
  },
  {
    id: "camp-5",
    merchant: "Jumbo Souq",
    logo: "https://images.snoonu.com/brand/header_image/2024-02/00af4a7a-9386-4860-bb04-809cf7a6fb96_JumboLogo.png?format=webp",
    vertical: "Market",
    category: "Accessories",
    discount: "10% off up to 80 QAR",
    reward: "10% of discount value",
    rewardExample: "80 QAR discount = 8.00 QAR for you",
    minOrder: "Min order 180 QAR",
    videoReq: "20-70 sec video",
    requirements: [
      "Video must be 20-70 seconds",
      "Show the case details + fit on phone",
      "Highlight customization/design element",
      "Mention Snoonu delivery convenience",
      "Clear, steady shots preferred"
    ],
    budget: "220 referrals available",
    timeline: "Campaign runs until Apr 12, 2026",
    reviewNotes: "Quick 'before/after' (plain phone → new case) works well.",
    productImage: "https://images.snoonu.com/brand_product/2025-08/37a30f14-2e47-4a36-a37e-eb77d66a3cc2_output.png?format=webp",
    productName: "iPhone 16 Pro Black Case"
  },
  {
    id: "camp-6",
    merchant: "Cat Planet",
    logo: "https://images.snoonu.com/brand/header_image/2024-04/8908d507-e801-4afe-b267-80b8fcd2f5b3_Popularbrand7.png?format=webp",
    vertical: "Market",
    category: "Pets",
    discount: "12% off up to 120 QAR",
    reward: "15% of discount value",
    rewardExample: "120 QAR discount = 18.00 QAR for you",
    minOrder: "Min order 250 QAR",
    videoReq: "20-90 sec video",
    requirements: [
      "Video must be 20-90 seconds",
      "Show the product + your cat using it (if possible)",
      "Mention the discount clearly",
      "Keep it fun + pet-safe (no risky setups)",
      "No competitor mentions"
    ],
    budget: "140 referrals available",
    timeline: "Campaign runs until Mar 25, 2026",
    reviewNotes: "If your cat interacts with it on camera, approval is usually quick.",
    productImage: "https://images.snoonu.com/product/2025-10/4fb0fc3d-d60f-4471-abc4-e3fb2a4edae4_download13.png?format=webp",
    productName: "Whisker Fiesta Cactus Cat Tree"
  },
  {
    id: "camp-7",
    merchant: "Toysimo",
    logo: "https://images.snoonu.com/brand/header_image/2024-03/010ca983-af9b-4449-9ef0-d35c66da220b_FavoritebrandToysimo.png?format=webp",
    vertical: "Market",
    category: "Toys & Collectibles",
    discount: "15% off up to 70 QAR",
    reward: "13% of discount value",
    rewardExample: "70 QAR discount = 9.10 QAR for you",
    minOrder: "Min order 200 QAR",
    videoReq: "25-90 sec video",
    requirements: [
      "Video must be 25-90 seconds",
      "Unbox on camera (seal → reveal)",
      "Show key pulls/cards highlights (if any)",
      "Mention the discount + Snoonu delivery",
      "No gambling framing (keep it collectible-focused)"
    ],
    budget: "160 referrals available",
    timeline: "Campaign runs until May 01, 2026",
    reviewNotes: "Top-down unboxing shots with clear audio work best.",
    productImage: "https://images.snoonu.com/brand_product/2025-12/addcde0c-4d18-40d3-87b6-55c36875d8d5_output.png?format=webp",
    productName: "2024 Leaf Soccer Blaster Box"
  },
  {
    id: "camp-8",
    merchant: "Al Mannai Optics",
    logo: "https://images.snoonu.com/brand/2024-10/adc7e72c-6739-49b7-82f4-f390f32110b7_output.png?format=webp",
    vertical: "Market",
    category: "Fashion & Eyewear",
    discount: "10% off up to 150 QAR",
    reward: "12% of discount value",
    rewardExample: "150 QAR discount = 18.00 QAR for you",
    minOrder: "Min order 350 QAR",
    videoReq: "20-60 sec video",
    requirements: [
      "Video must be 20-60 seconds",
      "Show try-on + close-up of frame details",
      "Mention UV protection/style benefit",
      "Mention the discount clearly",
      "Clean lighting (outdoor golden hour is great)"
    ],
    budget: "90 referrals available",
    timeline: "Campaign runs until Mar 18, 2026",
    reviewNotes: "Lifestyle 'fit check' style performs better than a pure product shot.",
    productImage: "https://images.snoonu.com/images/7e12ad52-3922-49c5-874b-5f06d1e2b2bd_4089.jpg",
    productName: "Rayban Sg 3584N Sunglasses"
  },
  {
    id: "camp-9",
    merchant: "Pavilion Decor",
    logo: "https://images.snoonu.com/brand/2026-01/c381b1a4-2424-4eee-99f7-15db1e58584b_output.png?format=webp",
    vertical: "Market",
    category: "Home & Decor",
    discount: "18% off up to 90 QAR",
    reward: "11% of discount value",
    rewardExample: "90 QAR discount = 9.90 QAR for you",
    minOrder: "Min order 180 QAR",
    videoReq: "20-70 sec video",
    requirements: [
      "Video must be 20-70 seconds",
      "Show the light on/off + close-up details",
      "Film in a dim room for best effect",
      "Mention the promo clearly",
      "Avoid shaky footage (use stable shots)"
    ],
    budget: "180 referrals available",
    timeline: "Campaign runs until Apr 22, 2026",
    reviewNotes: "Night ambiance videos tend to get higher saves/shares.",
    productImage: "https://images.snoonu.com/product/2025-8/b9343cdf-8a28-4463-968b-9bc5fd89f7ae_3DCrystalBallNightLightFerrisWheel.jpg?format=webp",
    productName: "3D Crystal Ball Night Light"
  },
  {
    id: "camp-10",
    merchant: "TMH Outlet",
    logo: "https://images.snoonu.com/brand/2024-07/5ae1b364-be59-4d18-a7d4-4256c3673472_output.png?format=webp",
    vertical: "Market",
    category: "Fitness & Sports",
    discount: "12% off up to 110 QAR",
    reward: "10% of discount value",
    rewardExample: "110 QAR discount = 11.00 QAR for you",
    minOrder: "Min order 300 QAR",
    videoReq: "25-90 sec video",
    requirements: [
      "Video must be 25-90 seconds",
      "Show setup + a couple exercises (safe form)",
      "Highlight adjustability and stability",
      "Mention Snoonu delivery convenience",
      "No unsafe lifting demonstrations"
    ],
    budget: "120 referrals available",
    timeline: "Campaign runs until Mar 30, 2026",
    reviewNotes: "Quick 'home gym' routine demos work best (2–3 moves).",
    productImage: "https://images.snoonu.com/brand_product/2024-11/fab1a664-8508-4aef-a494-39ab323def75_output.png",
    productName: "Adjustable Dumbbell Bench"
  },
  {
    id: "camp-11",
    merchant: "Cute Lillies",
    logo: "https://www.gorafeeq.com/_next/image?url=https%3A%2F%2Fimg2.gorafeeq.com%2Fpublic%2Fassets%2Frestaurant_appimg%2F9025_logo_image_1732181300909.png&w=256&q=75",
    vertical: "Market",
    category: "Flowers & Gifts",
    discount: "20% off up to 50 QAR",
    reward: "15% of discount value",
    rewardExample: "50 QAR discount = 7.50 QAR for you",
    minOrder: "Min order 120 QAR",
    videoReq: "15-60 sec video",
    requirements: [
      "Video must be 15-60 seconds",
      "Show unwrapping + bouquet close-ups",
      "Mention the discount clearly",
      "Keep it family-friendly and tasteful",
      "Aesthetic lighting preferred"
    ],
    budget: "300 referrals available",
    timeline: "Campaign runs until Feb 29, 2026",
    reviewNotes: "Unwrap + reaction + final beauty shot (3-step) is the winning format.",
    productImage: "https://images.snoonu.com/images/9360b3b5-320e-4ac0-92e9-6f4ecdf692b6_FlowerBouquet7738.jpg?format=webp",
    productName: "Flower Bouquet"
  }
];

// ==================== XP SYSTEM ====================
// XP is earned through activity and engagement, not tied to monetary values
// Base XP per approval: 100 XP
// Quality bonus: up to 50 XP
// Engagement bonus: up to 100 XP (based on clicks/conversions)
// Tier bonus multiplier: Rookie 1x, Bronze 1.1x, Silver 1.25x, Gold 1.5x, Platinum 2x

export const XP_CONFIG = {
  baseApprovalXP: 100,
  qualityBonus: 50,
  maxEngagementBonus: 100,
  tierMultipliers: {
    rookie: 1,
    bronze: 1.1,
    silver: 1.25,
    gold: 1.5,
    platinum: 2,
  },
};

// ==================== MOCK LEADERBOARD DATA ====================
export const mockCollaborators: CollaboratorProfile[] = [
  {
    id: 'collab-1',
    handle: '@yusuf_fares',
    avatar: '/YusufFares.jpeg',
    tier: 'platinum',
    approvedCount: 67,
    totalXP: 15850,
    topCampaigns: [
      { merchant: 'McDonalds', logo: 'https://www.mcdonalds.com/content/dam/sites/ArabiaGWS/arabic/nfl/logo/McDonalds_Logo.png', xp: 4200 },
      { merchant: 'Tea Time', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqawVmP77HQWimN-bUvxVpOlpLE8gYHAXCw&s', xp: 3150 },
      { merchant: 'Karak Mqanes', logo: 'https://images.deliveryhero.io/image/talabat/restaurants/logo_94637864896607282057.jpg?width=180', xp: 2800 },
    ],
    joinedDate: 'Oct 2025',
  },
  {
    id: 'collab-2',
    handle: '@david_bratu',
    avatar: '/DavidBratu.jpeg',
    tier: 'gold',
    approvedCount: 34,
    totalXP: 8520,
    topCampaigns: [
      { merchant: 'Korean Beauty', logo: 'https://kbeauty.qa/cdn/shop/files/kb_png_for_website_500x.png?v=1764239313', xp: 2450 },
      { merchant: 'McDonalds', logo: 'https://www.mcdonalds.com/content/dam/sites/ArabiaGWS/arabic/nfl/logo/McDonalds_Logo.png', xp: 1980 },
    ],
    joinedDate: 'Nov 2025',
  },
  {
    id: 'collab-3',
    handle: '@ali_baba',
    avatar: '/AliBaba.jpeg',
    tier: 'silver',
    approvedCount: 18,
    totalXP: 4280,
    topCampaigns: [
      { merchant: 'Toysimo', logo: 'https://images.snoonu.com/brand/header_image/2024-03/010ca983-af9b-4449-9ef0-d35c66da220b_FavoritebrandToysimo.png?format=webp', xp: 2150 },
    ],
    joinedDate: 'Dec 2025',
  },
  {
    id: 'collab-4',
    handle: '@yusuf_frumosul',
    avatar: '/YusufFrumosul.jpeg',
    tier: 'silver',
    approvedCount: 20,
    totalXP: 3200,
    topCampaigns: [
      { merchant: 'Tea Time', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqawVmP77HQWimN-bUvxVpOlpLE8gYHAXCw&s', xp: 1850 },
      { merchant: 'Cat Planet', logo: 'https://images.snoonu.com/brand/header_image/2024-04/8908d507-e801-4afe-b267-80b8fcd2f5b3_Popularbrand7.png?format=webp', xp: 1420 },
    ],
    joinedDate: 'Nov 2025',
  },
  {
    id: 'collab-5',
    handle: '@andrei_popescu',
    avatar: '/AndreiPopescu.jpeg',
    tier: 'bronze',
    approvedCount: 8,
    totalXP: 1680,
    topCampaigns: [
      { merchant: 'Karak Mqanes', logo: 'https://images.deliveryhero.io/image/talabat/restaurants/logo_94637864896607282057.jpg?width=180', xp: 920 },
    ],
    joinedDate: 'Jan 2026',
  },
];

export const mockMerchantLeaderboard: MerchantLeaderboardEntry[] = [
  { id: 'merch-1', merchantId: 'merch-1', name: 'McDonalds', merchant: 'McDonalds', logo: 'https://www.mcdonalds.com/content/dam/sites/ArabiaGWS/arabic/nfl/logo/McDonalds_Logo.png', totalXPAwarded: 42500, collabsEnrolled: 156, tags: ['Most Active', 'Top Engagement'] },
  { id: 'merch-2', merchantId: 'merch-2', name: 'Tea Time', merchant: 'Tea Time', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpqawVmP77HQWimN-bUvxVpOlpLE8gYHAXCw&s', totalXPAwarded: 25800, collabsEnrolled: 98, tags: ['Popular', 'Fast Approval'] },
  { id: 'merch-3', merchantId: 'merch-3', name: 'Korean Beauty', merchant: 'Korean Beauty', logo: 'https://kbeauty.qa/cdn/shop/files/kb_png_for_website_500x.png?v=1764239313', totalXPAwarded: 24200, collabsEnrolled: 67, tags: ['High Value'] },
  { id: 'merch-4', merchantId: 'merch-4', name: 'Karak Mqanes', merchant: 'Karak Mqanes', logo: 'https://images.deliveryhero.io/image/talabat/restaurants/logo_94637864896607282057.jpg?width=180', totalXPAwarded: 17800, collabsEnrolled: 89, tags: ['Trending'] },
  { id: 'merch-5', merchantId: 'merch-5', name: 'Cat Planet', merchant: 'Cat Planet', logo: 'https://images.snoonu.com/brand/header_image/2024-04/8908d507-e801-4afe-b267-80b8fcd2f5b3_Popularbrand7.png?format=webp', totalXPAwarded: 14900, collabsEnrolled: 45, tags: ['Growing'] },
  { id: 'merch-6', merchantId: 'merch-6', name: 'Toysimo', merchant: 'Toysimo', logo: 'https://images.snoonu.com/brand/header_image/2024-03/010ca983-af9b-4449-9ef0-d35c66da220b_FavoritebrandToysimo.png?format=webp', totalXPAwarded: 11700, collabsEnrolled: 34, tags: [] },
];


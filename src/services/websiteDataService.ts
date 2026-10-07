import {
  WebsiteInformation,
  HomepageContent,
  MediaItem,
  WebsiteService,
  WebsiteMenuCategory,
  WebsiteMenuItem,
  WebsiteProduct,
  WebsiteTeamMember,
  WebsiteGalleryItem,
  WebsiteAnnouncement,
  WebsiteBlogPost,
  WebsiteFaq,
  WebsiteNavItem,
  ContentStatus,
  AuditLogItem,
} from '../types';

// =======================================================================
// SEED CMS DATA ACCORDING TO REALISTIC MULTI-TENANT ARCHITECTURE
// =======================================================================

const SEED_INFO: Record<string, WebsiteInformation> = {
  'web-lumina-primary': {
    website_id: 'web-lumina-primary',
    business_name: 'Lumina Health Group',
    tagline: 'Comprehensive Family Medicine & Digital Telehealth',
    description:
      'Lumina Health Group combines board-certified clinical excellence with frictionless telehealth and proactive wellness care across the Greater Boston area.',
    phone: '+1 (617) 555-0182',
    email: 'care@luminahealth.com',
    address: '450 Brookline Ave, Suite 600',
    city: 'Boston',
    postal_code: 'MA 02215',
    country: 'United States',
    opening_hours: {
      monday: { open: '08:00', close: '18:00', is_closed: false },
      tuesday: { open: '08:00', close: '18:00', is_closed: false },
      wednesday: { open: '08:00', close: '18:00', is_closed: false },
      thursday: { open: '08:00', close: '18:00', is_closed: false },
      friday: { open: '08:00', close: '17:00', is_closed: false },
      saturday: { open: '09:00', close: '14:00', is_closed: false },
      sunday: { open: '00:00', close: '00:00', is_closed: true },
    },
    social_links: {
      linkedin: 'https://linkedin.com/company/lumina-health',
      instagram: 'https://instagram.com/luminahealth',
      twitter: 'https://x.com/luminahealth',
      google_maps: 'https://maps.google.com/?q=Lumina+Health+Boston',
    },
    logo_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=160&q=80',
    favicon_url: '/favicon.ico',
    seo_title: 'Lumina Health Group | Board-Certified Clinic & Telehealth Boston',
    seo_description:
      'Book doctor appointments, telehealth consults, and preventive screenings with Lumina Health Group in Boston.',
    og_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    updated_at: '2026-10-06T14:32:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-velvet-vine': {
    website_id: 'web-velvet-vine',
    business_name: 'Velvet & Vine Hospitality',
    tagline: 'Artisanal Wood-Fired Dining & Reserve Natural Wine Cellar',
    description:
      'An intimate Greenwich Village dining destination celebrating wood-fired seasonal culinary arts and a curated cellar of rare natural and biodynamic wines.',
    phone: '+1 (212) 555-0199',
    email: 'reservations@velvetvine.com',
    address: '88 Greenwich Ave',
    city: 'New York',
    postal_code: 'NY 10011',
    country: 'United States',
    opening_hours: {
      monday: { open: '00:00', close: '00:00', is_closed: true },
      tuesday: { open: '17:00', close: '23:00', is_closed: false },
      wednesday: { open: '17:00', close: '23:00', is_closed: false },
      thursday: { open: '17:00', close: '23:00', is_closed: false },
      friday: { open: '17:00', close: '00:00', is_closed: false },
      saturday: { open: '17:00', close: '00:00', is_closed: false },
      sunday: { open: '16:00', close: '22:00', is_closed: false },
    },
    social_links: {
      instagram: 'https://instagram.com/velvetandvinenyc',
      facebook: 'https://facebook.com/velvetandvinenyc',
      google_maps: 'https://maps.google.com/?q=Velvet+Vine+Greenwich+Village',
    },
    logo_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=160&q=80',
    favicon_url: '/favicon.ico',
    seo_title: 'Velvet & Vine | Wood-Fired Dining & Wine Bar NYC',
    seo_description:
      'Reserve a table at Velvet & Vine NYC. Seasonal wood-fired plates and natural biodynamic wines in Greenwich Village.',
    og_image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    updated_at: '2026-10-05T19:20:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-apex-store': {
    website_id: 'web-apex-store',
    business_name: 'Apex Goods Co.',
    tagline: 'Utilitarian Everyday Carry & Architectural Travel Essentials',
    description:
      'Engineered for modern urbanites and global creators. Minimalist technical bags, titanium writing instruments, and Horween leather craft.',
    phone: '+1 (415) 555-0134',
    email: 'concierge@apexgoods.store',
    address: '580 Howard Street',
    city: 'San Francisco',
    postal_code: 'CA 94105',
    country: 'United States',
    opening_hours: {
      monday: { open: '10:00', close: '19:00', is_closed: false },
      tuesday: { open: '10:00', close: '19:00', is_closed: false },
      wednesday: { open: '10:00', close: '19:00', is_closed: false },
      thursday: { open: '10:00', close: '19:00', is_closed: false },
      friday: { open: '10:00', close: '20:00', is_closed: false },
      saturday: { open: '10:00', close: '19:00', is_closed: false },
      sunday: { open: '11:00', close: '18:00', is_closed: false },
    },
    social_links: {
      instagram: 'https://instagram.com/apexgoods',
      twitter: 'https://x.com/apexgoods',
    },
    logo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=160&q=80',
    favicon_url: '/favicon.ico',
    seo_title: 'Apex Goods Co. | Precision Everyday Carry & Technical Gear',
    seo_description:
      'Shop minimalist titanium pens, technical weatherproof packs, and handcrafted leather wallets at Apex Goods Co.',
    og_image_url: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?auto=format&fit=crop&w=1200&q=80',
    updated_at: '2026-10-06T11:15:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-vantage-primary': {
    website_id: 'web-vantage-primary',
    business_name: 'Vantage Capital Advisory',
    tagline: 'Strategic M&A, Capital Structuring & Institutional Tech Advisory',
    description:
      'Independent corporate advisory firm guiding mid-market founders and private equity sponsors through landmark divestitures, debt recapitalizations, and acquisitions.',
    phone: '+1 (212) 555-0145',
    email: 'partners@vantagecap.io',
    address: '375 Park Avenue, 28th Floor',
    city: 'New York',
    postal_code: 'NY 10152',
    country: 'United States',
    opening_hours: {
      monday: { open: '08:30', close: '18:30', is_closed: false },
      tuesday: { open: '08:30', close: '18:30', is_closed: false },
      wednesday: { open: '08:30', close: '18:30', is_closed: false },
      thursday: { open: '08:30', close: '18:30', is_closed: false },
      friday: { open: '08:30', close: '17:30', is_closed: false },
      saturday: { open: '00:00', close: '00:00', is_closed: true },
      sunday: { open: '00:00', close: '00:00', is_closed: true },
    },
    social_links: {
      linkedin: 'https://linkedin.com/company/vantage-capital-advisory',
    },
    logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=160&q=80',
    favicon_url: '/favicon.ico',
    seo_title: 'Vantage Capital Advisory | Strategic M&A Advisory New York',
    seo_description:
      'Trusted boutique advisory for mid-market software and tech-enabled industrial transactions.',
    og_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    updated_at: '2026-10-04T10:00:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },
};

const SEED_HOMEPAGE: Record<string, HomepageContent> = {
  'web-lumina-primary': {
    website_id: 'web-lumina-primary',
    hero_badge: 'Accredited Health Excellence 2026',
    hero_headline: 'Modern Medical Care Centered on Your Whole Health',
    hero_description:
      'Connect with board-certified physicians in minutes via telehealth or schedule a comprehensive in-clinic preventive consultation in Boston.',
    primary_cta_label: 'Book an Appointment',
    primary_cta_link: '/book-appointment',
    secondary_cta_label: 'Explore Clinical Services',
    secondary_cta_link: '/services',
    hero_image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    announcement_banner_active: true,
    announcement_banner_text: 'Extended Telehealth Hours: Virtual appointments now available until 9 PM on weekdays.',
    featured_services_enabled: true,
    featured_products_enabled: false,
    testimonials_enabled: true,
    gallery_preview_enabled: true,
    faq_section_enabled: true,
    updated_at: '2026-10-06T14:32:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-velvet-vine': {
    website_id: 'web-velvet-vine',
    hero_badge: 'Greenwich Village · Est. 2023',
    hero_headline: 'Wood-Fired Gastronomy Meets Rare Biodynamic Vintages',
    hero_description:
      'An intimate table in the heart of downtown Manhattan. Experience seasonal open-hearth culinary creations alongside our 300-label natural cellar.',
    primary_cta_label: 'Reserve a Table',
    primary_cta_link: '/reservations',
    secondary_cta_label: 'Explore Evening Menu',
    secondary_cta_link: '/menu',
    hero_image_url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
    announcement_banner_active: true,
    announcement_banner_text: 'Now accepting reservations for the Autumn 6-Course Truffle & Wild Game Tasting Menu.',
    featured_services_enabled: false,
    featured_products_enabled: false,
    testimonials_enabled: true,
    gallery_preview_enabled: true,
    faq_section_enabled: true,
    updated_at: '2026-10-05T19:20:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-apex-store': {
    website_id: 'web-apex-store',
    hero_badge: 'Autumn 2026 Capsule Released',
    hero_headline: 'Precision Carry Engineered for the Relentless Journey',
    hero_description:
      'Zero-compromise everyday utility. Weatherproof Cordura, aerospace grade titanium, and artisanal bridle leather guaranteed for life.',
    primary_cta_label: 'Shop the Capsule',
    primary_cta_link: '/products',
    secondary_cta_label: 'Read Field Notes',
    secondary_cta_link: '/journal',
    hero_image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    announcement_banner_active: true,
    announcement_banner_text: 'Free expedited worldwide shipping on orders over $150 with code LEVELUP.',
    featured_services_enabled: false,
    featured_products_enabled: true,
    testimonials_enabled: true,
    gallery_preview_enabled: true,
    faq_section_enabled: true,
    updated_at: '2026-10-06T11:15:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },

  'web-vantage-primary': {
    website_id: 'web-vantage-primary',
    hero_badge: 'Ranked Top 10 Mid-Market Tech Advisor',
    hero_headline: 'High-Conviction Advisory for Transformational Transactions',
    hero_description:
      'We partner with founder-led enterprise software and industrial technology firms to execute defining mergers, recapitalizations, and divestitures.',
    primary_cta_label: 'View Closed Mandates',
    primary_cta_link: '/transactions',
    secondary_cta_label: 'Schedule Confidential Review',
    secondary_cta_link: '/contact',
    hero_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    announcement_banner_active: false,
    announcement_banner_text: '',
    featured_services_enabled: true,
    featured_products_enabled: false,
    testimonials_enabled: false,
    gallery_preview_enabled: false,
    faq_section_enabled: true,
    updated_at: '2026-10-04T10:00:00Z',
    updated_by: 'Antoine Mercier (Owner)',
  },
};

const SEED_SERVICES: Record<string, WebsiteService[]> = {
  'web-lumina-primary': [
    {
      id: 'srv-lumina-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Telehealth Virtual Consultation',
      slug: 'telehealth-virtual-consultation',
      category: 'Telehealth',
      description: 'Encrypted HD video visit with a board-certified physician for non-emergent diagnosis and prescription refills.',
      price: 85,
      duration_minutes: 30,
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
      is_booking_enabled: true,
      is_featured: true,
      status: 'published',
      sort_order: 1,
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'srv-lumina-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Comprehensive Annual Wellness Exam',
      slug: 'annual-wellness-exam',
      category: 'Preventive Care',
      description: 'Full in-clinic physical examination, biometric blood panel review, cardiovascular check, and personalized lifestyle plan.',
      price: 240,
      duration_minutes: 60,
      image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
      is_booking_enabled: true,
      is_featured: true,
      status: 'published',
      sort_order: 2,
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'srv-lumina-03',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Pediatric Development Assessment',
      slug: 'pediatric-assessment',
      category: 'Pediatrics',
      description: 'Careful developmental milestones tracking, immunizations review, and growth evaluations for infants and children.',
      price: 150,
      duration_minutes: 45,
      image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      is_booking_enabled: true,
      is_featured: false,
      status: 'published',
      sort_order: 3,
      created_at: '2026-02-01T00:00:00Z',
      updated_at: '2026-10-04T00:00:00Z',
    },
    {
      id: 'srv-lumina-04',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Preventive Cardiovascular Screening',
      slug: 'cardiovascular-screening',
      category: 'Specialist Care',
      description: 'Non-invasive EKG, advanced lipid fractionation, coronary calcium risk assessment, and arterial health profiling.',
      price: 320,
      duration_minutes: 60,
      image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
      is_booking_enabled: true,
      is_featured: true,
      status: 'published',
      sort_order: 4,
      created_at: '2026-02-10T00:00:00Z',
      updated_at: '2026-10-05T00:00:00Z',
    },
  ],

  'web-vantage-primary': [
    {
      id: 'srv-vantage-01',
      website_id: 'web-vantage-primary',
      organization_id: 'tenant-vantage-03',
      name: 'Sell-Side M&A Advisory',
      slug: 'sell-side-advisory',
      category: 'Mergers & Acquisitions',
      description: 'Strategic auction orchestration, confidential buyer outreach, financial modeling, and definitive agreement negotiations.',
      price: 15000,
      duration_minutes: 120,
      is_booking_enabled: false,
      is_featured: true,
      status: 'published',
      sort_order: 1,
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'srv-vantage-02',
      website_id: 'web-vantage-primary',
      organization_id: 'tenant-vantage-03',
      name: 'Growth Capital & Structured Debt',
      slug: 'growth-capital',
      category: 'Capital Advisory',
      description: 'Bespoke mezzanine, unitranche, and minority equity formations to fund domestic and international expansion.',
      price: 12500,
      duration_minutes: 90,
      is_booking_enabled: false,
      is_featured: true,
      status: 'published',
      sort_order: 2,
      created_at: '2026-03-01T00:00:00Z',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ],
};

const SEED_MENU_CATEGORIES: Record<string, WebsiteMenuCategory[]> = {
  'web-velvet-vine': [
    { id: 'cat-starters', website_id: 'web-velvet-vine', name: 'Antipasti & Small Plates', sort_order: 1 },
    { id: 'cat-mains', website_id: 'web-velvet-vine', name: 'Wood-Fired Hearth Mains', sort_order: 2 },
    { id: 'cat-pastas', website_id: 'web-velvet-vine', name: 'Handcrafted Pastas', sort_order: 3 },
    { id: 'cat-desserts', website_id: 'web-velvet-vine', name: 'Dolci & Artisan Cheeses', sort_order: 4 },
    { id: 'cat-cocktails', website_id: 'web-velvet-vine', name: 'Signature Cocktails', sort_order: 5 },
  ],
};

const SEED_MENU_ITEMS: Record<string, WebsiteMenuItem[]> = {
  'web-velvet-vine': [
    {
      id: 'menu-01',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      category_id: 'cat-starters',
      category_name: 'Antipasti & Small Plates',
      name: 'Charred Spanish Octopus',
      description: 'Smoked romesco puree, fingerling crisps, pickled shallots, micro cilantro.',
      price: 26,
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      dietary: ['gluten_free', 'chef_special'],
      is_available: true,
      is_featured: true,
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'menu-02',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      category_id: 'cat-starters',
      category_name: 'Antipasti & Small Plates',
      name: 'Black Truffle & Taleggio Arancini',
      description: 'Crispy carnaroli rice balls, molten taleggio core, shaved seasonal perigord truffle.',
      price: 21,
      image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=400&q=80',
      dietary: ['vegetarian', 'chef_special'],
      is_available: true,
      is_featured: true,
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'menu-03',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      category_id: 'cat-mains',
      category_name: 'Wood-Fired Hearth Mains',
      name: 'Dry-Aged Prime Bone-In Ribeye (18oz)',
      description: '45-day dry aged, oak embers char, bone marrow gremolata, roasted cippolini.',
      price: 68,
      image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80',
      dietary: ['gluten_free'],
      is_available: true,
      is_featured: true,
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'menu-04',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      category_id: 'cat-pastas',
      category_name: 'Handcrafted Pastas',
      name: 'Pappardelle al Cinghiale',
      description: 'Slow-braised Tuscan wild boar ragu, juniper berry, 36-month Parmigiano Reggiano.',
      price: 36,
      image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=400&q=80',
      dietary: ['chef_special'],
      is_available: true,
      is_featured: true,
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'menu-05',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      category_id: 'cat-cocktails',
      category_name: 'Signature Cocktails',
      name: 'Smoked Rosemary Mezcalita',
      description: 'Oaxacan artisanal mezcal, blood orange reduction, smoked sea salt, flamed rosemary sprig.',
      price: 22,
      image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
      dietary: ['vegan'],
      is_available: true,
      is_featured: true,
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
  ],
};

const SEED_PRODUCTS: Record<string, WebsiteProduct[]> = {
  'web-apex-store': [
    {
      id: 'prod-01',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      name: 'Voyager Weatherproof Everyday Pack (28L)',
      slug: 'voyager-weatherproof-everyday-pack',
      sku: 'APX-VYG-BLK-28',
      category: 'Bags & Packs',
      description: 'Constructed from Dimension-Polyant X-Pac VX21 sailcloth with Fidlock V-buckles and YKK Aquaguard zips.',
      price: 295,
      compare_at_price: 340,
      inventory_count: 38,
      track_inventory: true,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
      is_featured: true,
      status: 'published',
      variants_count: 3,
      updated_at: '2026-10-06T00:00:00Z',
    },
    {
      id: 'prod-02',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      name: 'Machined Titanium Bolt-Action Pen',
      slug: 'machined-titanium-bolt-action-pen',
      sku: 'APX-PEN-TI-01',
      category: 'Writing Tools',
      description: 'Grade 5 aerospace titanium body, stone-tumbled finish, accepts Schmidt EasyFlow 9000 refills.',
      price: 110,
      inventory_count: 3,
      track_inventory: true,
      low_stock_threshold: 8,
      image_url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80',
      is_featured: true,
      status: 'published',
      variants_count: 2,
      updated_at: '2026-10-06T00:00:00Z',
    },
    {
      id: 'prod-03',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      name: 'Horween Dublin Leather Card Sleeve',
      slug: 'horween-leather-card-sleeve',
      sku: 'APX-WLT-DBL-04',
      category: 'Leather Goods',
      description: 'Full-grain vegetable-tanned leather from Chicago. Hand-stitched with waxed polyester thread.',
      price: 65,
      inventory_count: 4,
      track_inventory: true,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
      is_featured: true,
      status: 'published',
      variants_count: 4,
      updated_at: '2026-10-06T00:00:00Z',
    },
    {
      id: 'prod-04',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      name: 'All-Weather Merino Wool Base Layer',
      slug: 'all-weather-merino-base-layer',
      sku: 'APX-APP-MRN-03',
      category: 'Apparel',
      description: '200gsm superfine 18.5-micron New Zealand merino wool. Odor-resistant and naturally thermoregulating.',
      price: 125,
      inventory_count: 24,
      track_inventory: true,
      low_stock_threshold: 10,
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      is_featured: false,
      status: 'published',
      variants_count: 5,
      updated_at: '2026-10-06T00:00:00Z',
    },
  ],
};

const SEED_TEAM: Record<string, WebsiteTeamMember[]> = {
  'web-lumina-primary': [
    {
      id: 'team-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Dr. Elena Rostova, MD',
      role: 'Chief Medical Officer & Family Physician',
      bio: 'Harvard Medical School alumna with 14 years of primary care experience, pioneering digital diagnostics and proactive preventative wellness.',
      photo_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      email: 'dr.rostova@luminahealth.com',
      phone: '+1 (617) 555-0182',
      specialties: ['Family Medicine', 'Preventative Cardiology', 'Longevity Medicine'],
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-04T00:00:00Z',
    },
    {
      id: 'team-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Dr. Marcus Vance, MD',
      role: 'Director of Virtual Care & Internal Medicine',
      bio: 'Specialist in remote patient monitoring, chronic disease management, and emergency medical triage via high-fidelity video consults.',
      photo_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      email: 'dr.vance@luminahealth.com',
      specialties: ['Internal Medicine', 'Telehealth Systems', 'Endocrinology'],
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-04T00:00:00Z',
    },
    {
      id: 'team-03',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'Sarah Chen, FNP-BC',
      role: 'Lead Family Nurse Practitioner',
      bio: 'Dedicated clinician focused on adolescent health, women’s preventive screenings, and routine pediatric wellness visits.',
      photo_url: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?auto=format&fit=crop&w=400&q=80',
      email: 's.chen@luminahealth.com',
      specialties: ['Pediatrics', 'Women’s Health', 'Preventative Care'],
      sort_order: 3,
      status: 'published',
      updated_at: '2026-10-04T00:00:00Z',
    },
  ],

  'web-vantage-primary': [
    {
      id: 'team-van-01',
      website_id: 'web-vantage-primary',
      organization_id: 'tenant-vantage-03',
      name: 'Alexander Hayes',
      role: 'Managing Partner & Founder',
      bio: 'Over 20 years leading mid-market technology M&A mandates exceeding $4B in aggregate enterprise value across North America and Europe.',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      email: 'a.hayes@vantagecap.io',
      specialties: ['Sell-Side M&A', 'Enterprise SaaS', 'Board Advisory'],
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'team-van-02',
      website_id: 'web-vantage-primary',
      organization_id: 'tenant-vantage-03',
      name: 'Victoria Sterling',
      role: 'Director, Capital Formations',
      bio: 'Former Goldman Sachs VP specializing in growth recapitalizations, mezzanine facilities, and cross-border strategic partnerships.',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'v.sterling@vantagecap.io',
      specialties: ['Structured Debt', 'Growth Capital', 'Industrial Tech'],
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ],
};

const SEED_GALLERY: Record<string, WebsiteGalleryItem[]> = {
  'web-lumina-primary': [
    {
      id: 'gal-lum-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      title: 'Modern Consultation Suites',
      image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      category: 'Clinic Facilities',
      caption: 'Soundproofed private clinical examination rooms designed for comfort and peace.',
      alt_text: 'Interior view of Lumina Health modern exam room',
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'gal-lum-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      title: 'On-Site Diagnostic Lab',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      category: 'Diagnostics',
      caption: 'Rapid results blood profiling and cardiovascular screening lab.',
      alt_text: 'Laboratory diagnostic equipment',
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
  ],

  'web-velvet-vine': [
    {
      id: 'gal-vv-01',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      title: 'The Open Hearth Kitchen',
      image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      category: 'Ambiance',
      caption: 'Live oak embers cooking seasonal cuts in full view of our guests.',
      alt_text: 'Chefs cooking at wood-fired grill in restaurant',
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
    {
      id: 'gal-vv-02',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      title: 'Subterranean Wine Cellar',
      image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      category: 'Wine Cellar',
      caption: 'Temperature-controlled reserve room with rare bottles from Jura, Piedmont, and Burgundy.',
      alt_text: 'Wine bottles stored in dark wooden cellar',
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-05T00:00:00Z',
    },
  ],
};

const SEED_ANNOUNCEMENTS: Record<string, WebsiteAnnouncement[]> = {
  'web-lumina-primary': [
    {
      id: 'ann-lum-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      title: 'Extended Weekend Telehealth Hours',
      message: 'Urgent and routine virtual consultations are now staffed Saturday & Sunday from 9:00 AM to 5:00 PM EST.',
      badge_label: 'Care Update',
      badge_type: 'update',
      link_url: '/book-appointment',
      link_label: 'Book Weekend Telehealth',
      status: 'published',
      updated_at: '2026-10-06T12:00:00Z',
    },
    {
      id: 'ann-lum-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      title: 'Fall Flu & RSV Immunization Clinic (Draft)',
      message: 'Walk-in seasonal vaccination clinics start October 20th. Walk-ins welcome for all registered patients.',
      badge_label: 'Draft',
      badge_type: 'notice',
      status: 'draft',
      updated_at: '2026-10-05T15:30:00Z',
    },
  ],

  'web-velvet-vine': [
    {
      id: 'ann-vv-01',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      title: 'Autumn Tasting Menu & Rare Cellar Pairings',
      message: 'Chef Matteo has unveiled our 6-course Autumn tasting menu featuring White Truffle and Piemonte Barolo reserves.',
      badge_label: 'Seasonal Special',
      badge_type: 'offer',
      link_url: '/reservations',
      link_label: 'Reserve Tasting Table',
      status: 'published',
      updated_at: '2026-10-05T18:00:00Z',
    },
    {
      id: 'ann-vv-02',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      title: 'Thanksgiving Long Weekend Closure (Draft)',
      message: 'We will be closed November 26th-27th for the holiday to allow our culinary team time with family.',
      badge_label: 'Holiday Hours',
      badge_type: 'notice',
      status: 'draft',
      updated_at: '2026-10-04T12:00:00Z',
    },
  ],

  'web-apex-store': [
    {
      id: 'ann-apx-01',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      title: 'Complimentary Worldwide Carbon-Neutral Shipping',
      message: 'All orders over $150 now qualify for free expedited express delivery with full door-to-door insurance.',
      badge_label: 'Store Offer',
      badge_type: 'offer',
      link_url: '/products',
      link_label: 'Shop Now',
      status: 'published',
      updated_at: '2026-10-06T10:00:00Z',
    },
  ],
};

const SEED_BLOG_POSTS: Record<string, WebsiteBlogPost[]> = {
  'web-lumina-primary': [
    {
      id: 'blog-lum-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      title: '5 Preventative Biomarkers Every Adult Should Track in 2026',
      slug: 'preventative-biomarkers-2026',
      excerpt: 'Beyond standard cholesterol tests, learn how ApoB, hs-CRP, and fasting insulin provide actionable windows into your metabolic longevity.',
      content:
        'Modern medicine is undergoing a profound paradigm shift: transitioning from reactive sick care to proactive, biomarker-guided optimization. When evaluating cardiovascular risk, standard LDL tests often overlook particle concentration. In this clinical guide, Dr. Elena Rostova outlines why ApoB and high-sensitivity C-reactive protein give an unmatched baseline for long-term health.',
      featured_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      author_name: 'Dr. Elena Rostova, MD',
      category: 'Preventive Health',
      tags: ['Biomarkers', 'Cardiology', 'Longevity'],
      read_time_minutes: 5,
      seo_title: '5 Preventative Biomarkers for Longevity | Lumina Health',
      seo_description: 'Discover the essential cardiovascular and metabolic biomarkers to review during your annual physical.',
      status: 'published',
      published_at: '2026-09-28T10:00:00Z',
      updated_at: '2026-10-02T10:00:00Z',
    },
  ],

  'web-vantage-primary': [
    {
      id: 'blog-van-01',
      website_id: 'web-vantage-primary',
      organization_id: 'tenant-vantage-03',
      title: 'Valuation Multiples for Mid-Market B2B SaaS: Q3 2026 Report',
      slug: 'b2b-saas-valuation-multiples-q3-2026',
      excerpt: 'Strategic buyers prioritize net revenue retention and rule of 40 over raw unprofitability. A breakdown of recent transactions.',
      content:
        'Strategic acquirers in 2026 have renewed their discipline around capital efficiency. While median EV/ARR multiples have stabilized between 6.8x and 9.4x for companies generating between $10M and $50M in recurring revenue, premium valuations are strictly reserved for platforms exhibiting NRR exceeding 115%.',
      featured_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      author_name: 'Alexander Hayes',
      category: 'Market Insights',
      tags: ['M&A', 'SaaS', 'Valuation'],
      read_time_minutes: 7,
      seo_title: 'B2B SaaS Valuation Multiples Q3 2026 | Vantage Advisory',
      seo_description: 'In-depth transaction analysis and valuation drivers for enterprise software founders.',
      status: 'published',
      published_at: '2026-09-15T00:00:00Z',
      updated_at: '2026-09-30T00:00:00Z',
    },
  ],
};

const SEED_FAQS: Record<string, WebsiteFaq[]> = {
  'web-lumina-primary': [
    {
      id: 'faq-lum-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      question: 'How do virtual telehealth consultations work?',
      answer: 'After booking your slot, you receive an encrypted SMS and email link to our HIPAA-compliant video portal. No app download is required—it works seamlessly on phone, tablet, or desktop browsers.',
      category: 'Telehealth',
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'faq-lum-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      question: 'Do you accept health insurance for visits?',
      answer: 'We are in-network with Blue Cross Blue Shield, Harvard Pilgrim, Aetna, and Medicare for clinic consultations. Telehealth visits can be submitted for reimbursement via your HSA/FSA or standard superbill.',
      category: 'Billing & Insurance',
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'faq-lum-03',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      question: 'Can prescriptions and lab orders be sent directly to my pharmacy?',
      answer: 'Yes. Our clinicians e-prescribe directly to your preferred pharmacy nationwide and transmit diagnostic orders to Quest or Labcorp locations closest to you.',
      category: 'Prescriptions',
      sort_order: 3,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ],

  'web-velvet-vine': [
    {
      id: 'faq-vv-01',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      question: 'What is your reservation and cancellation policy?',
      answer: 'Reservations are open 30 days in advance. Cancellations made within 24 hours of seating may incur a $45 per person fee to cover ingredients prepared specifically for your party.',
      category: 'Reservations',
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
    {
      id: 'faq-vv-02',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      question: 'Can dietary restrictions and allergies be accommodated?',
      answer: 'Yes. Please note severe allergies upon booking. Our kitchen is glad to tailor multi-course tasting menus for vegetarian, dairy-free, and celiac guests with advance notice.',
      category: 'Dining',
      sort_order: 2,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ],

  'web-apex-store': [
    {
      id: 'faq-apx-01',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      question: 'What is the lifetime warranty policy on Apex packs and gear?',
      answer: 'We guarantee every product against material defects and craftsmanship failures for life. If a seam fails or hardware breaks during normal use, we repair or replace it free of charge.',
      category: 'Warranty & Care',
      sort_order: 1,
      status: 'published',
      updated_at: '2026-10-01T00:00:00Z',
    },
  ],
};

const SEED_NAV: Record<string, WebsiteNavItem[]> = {
  'web-lumina-primary': [
    { id: 'nav-01', website_id: 'web-lumina-primary', label: 'Home', path: '/', is_external: false, sort_order: 1, location: 'header', status: 'published' },
    { id: 'nav-02', website_id: 'web-lumina-primary', label: 'Clinical Services', path: '/services', is_external: false, sort_order: 2, location: 'header', status: 'published' },
    { id: 'nav-03', website_id: 'web-lumina-primary', label: 'Our Physicians', path: '/physicians', is_external: false, sort_order: 3, location: 'header', status: 'published' },
    { id: 'nav-04', website_id: 'web-lumina-primary', label: 'Telehealth Portal', path: '/telehealth', is_external: false, sort_order: 4, location: 'header', status: 'published' },
    { id: 'nav-05', website_id: 'web-lumina-primary', label: 'Health Journal', path: '/blog', is_external: false, sort_order: 5, location: 'header', status: 'published' },
    { id: 'nav-06', website_id: 'web-lumina-primary', label: 'Contact Clinic', path: '/contact', is_external: false, sort_order: 6, location: 'both', status: 'published' },
  ],

  'web-velvet-vine': [
    { id: 'nav-vv-01', website_id: 'web-velvet-vine', label: 'Home', path: '/', is_external: false, sort_order: 1, location: 'header', status: 'published' },
    { id: 'nav-vv-02', website_id: 'web-velvet-vine', label: 'Evening Menu', path: '/menu', is_external: false, sort_order: 2, location: 'header', status: 'published' },
    { id: 'nav-vv-03', website_id: 'web-velvet-vine', label: 'Natural Cellar', path: '/wine', is_external: false, sort_order: 3, location: 'header', status: 'published' },
    { id: 'nav-vv-04', website_id: 'web-velvet-vine', label: 'Reservations', path: '/reservations', is_external: false, sort_order: 4, location: 'header', status: 'published' },
    { id: 'nav-vv-05', website_id: 'web-velvet-vine', label: 'Private Dining', path: '/events', is_external: false, sort_order: 5, location: 'header', status: 'published' },
  ],

  'web-apex-store': [
    { id: 'nav-apx-01', website_id: 'web-apex-store', label: 'Home', path: '/', is_external: false, sort_order: 1, location: 'header', status: 'published' },
    { id: 'nav-apx-02', website_id: 'web-apex-store', label: 'Catalog', path: '/products', is_external: false, sort_order: 2, location: 'header', status: 'published' },
    { id: 'nav-apx-03', website_id: 'web-apex-store', label: 'Materials & Craft', path: '/craft', is_external: false, sort_order: 3, location: 'header', status: 'published' },
    { id: 'nav-apx-04', website_id: 'web-apex-store', label: 'Field Notes', path: '/blog', is_external: false, sort_order: 4, location: 'header', status: 'published' },
    { id: 'nav-apx-05', website_id: 'web-apex-store', label: 'Support & Warranty', path: '/support', is_external: false, sort_order: 5, location: 'both', status: 'published' },
  ],
};

const SEED_MEDIA: Record<string, MediaItem[]> = {
  'web-lumina-primary': [
    {
      id: 'med-lum-01',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'lumina-primary-logo.svg',
      url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
      category: 'brand',
      size_kb: 42,
      mime_type: 'image/svg+xml',
      alt_text: 'Lumina Health Group official mark',
      created_at: '2026-01-15T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
    {
      id: 'med-lum-02',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'clinic-hero-reception.webp',
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
      category: 'heroes',
      size_kb: 340,
      mime_type: 'image/webp',
      alt_text: 'Boston medical clinic reception and patient welcome desk',
      created_at: '2026-02-10T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
    {
      id: 'med-lum-03',
      website_id: 'web-lumina-primary',
      organization_id: 'tenant-lumina-01',
      name: 'dr-rostova-headshot.jpg',
      url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      category: 'team',
      size_kb: 180,
      mime_type: 'image/jpeg',
      alt_text: 'Dr. Elena Rostova MD portrait',
      created_at: '2026-02-12T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
  ],

  'web-velvet-vine': [
    {
      id: 'med-vv-01',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      name: 'velvet-vine-dining-room.jpg',
      url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80',
      category: 'heroes',
      size_kb: 420,
      mime_type: 'image/jpeg',
      alt_text: 'Intimate candlelit dining room in Greenwich Village',
      created_at: '2026-03-01T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
    {
      id: 'med-vv-02',
      website_id: 'web-velvet-vine',
      organization_id: 'tenant-velvet-04',
      name: 'wood-fired-octopus.jpg',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      category: 'gallery',
      size_kb: 210,
      mime_type: 'image/jpeg',
      alt_text: 'Charred octopus plated with romesco',
      created_at: '2026-03-05T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
  ],

  'web-apex-store': [
    {
      id: 'med-apx-01',
      website_id: 'web-apex-store',
      organization_id: 'tenant-apex-02',
      name: 'voyager-pack-studio.jpg',
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      category: 'products',
      size_kb: 310,
      mime_type: 'image/jpeg',
      alt_text: 'Voyager pack angled on concrete pedestal',
      created_at: '2026-01-20T00:00:00Z',
      created_by: 'Antoine Mercier',
    },
  ],
};

const SEED_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    tenant_id: 'tenant-lumina-01',
    actor_name: 'Antoine Mercier',
    actor_role: 'admin',
    action: 'Updated Homepage Hero Headline',
    target: 'web-lumina-primary',
    timestamp: '2026-10-06T14:32:00Z',
    ip: '198.51.100.24',
  },
  {
    id: 'log-02',
    tenant_id: 'tenant-lumina-01',
    actor_name: 'Antoine Mercier',
    actor_role: 'admin',
    action: 'Published Announcement',
    target: 'ann-lum-01',
    timestamp: '2026-10-06T12:00:00Z',
    ip: '198.51.100.24',
  },
  {
    id: 'log-03',
    tenant_id: 'tenant-velvet-04',
    actor_name: 'Antoine Mercier',
    actor_role: 'admin',
    action: 'Updated Autumn Tasting Menu Price',
    target: 'Dry-Aged Ribeye ($68)',
    timestamp: '2026-10-05T19:20:00Z',
    ip: '198.51.100.24',
  },
  {
    id: 'log-04',
    tenant_id: 'tenant-apex-02',
    actor_name: 'Antoine Mercier',
    actor_role: 'admin',
    action: 'Updated Product Inventory Level',
    target: 'Machined Titanium Pen (3 remaining)',
    timestamp: '2026-10-06T11:15:00Z',
    ip: '198.51.100.24',
  },
];

// In-Memory Mutative Store
class WebsiteDataStore {
  private infoMap: Record<string, WebsiteInformation> = { ...SEED_INFO };
  private homepageMap: Record<string, HomepageContent> = { ...SEED_HOMEPAGE };
  private servicesMap: Record<string, WebsiteService[]> = { ...SEED_SERVICES };
  private menuCategoriesMap: Record<string, WebsiteMenuCategory[]> = { ...SEED_MENU_CATEGORIES };
  private menuItemsMap: Record<string, WebsiteMenuItem[]> = { ...SEED_MENU_ITEMS };
  private productsMap: Record<string, WebsiteProduct[]> = { ...SEED_PRODUCTS };
  private teamMap: Record<string, WebsiteTeamMember[]> = { ...SEED_TEAM };
  private galleryMap: Record<string, WebsiteGalleryItem[]> = { ...SEED_GALLERY };
  private announcementsMap: Record<string, WebsiteAnnouncement[]> = { ...SEED_ANNOUNCEMENTS };
  private blogMap: Record<string, WebsiteBlogPost[]> = { ...SEED_BLOG_POSTS };
  private faqsMap: Record<string, WebsiteFaq[]> = { ...SEED_FAQS };
  private navMap: Record<string, WebsiteNavItem[]> = { ...SEED_NAV };
  private mediaMap: Record<string, MediaItem[]> = { ...SEED_MEDIA };
  private auditLogs: AuditLogItem[] = [...SEED_AUDIT_LOGS];

  // ===================== AUDIT LOGS =====================
  public getAuditLogs(tenantId?: string): AuditLogItem[] {
    if (!tenantId) return this.auditLogs;
    return this.auditLogs.filter((l) => l.tenant_id === tenantId);
  }

  public logAction(tenantId: string, action: string, target: string, actorName = 'Antoine Mercier'): void {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tenant_id: tenantId,
      actor_name: actorName,
      actor_role: 'admin',
      action,
      target,
      timestamp: new Date().toISOString(),
      ip: '198.51.100.24',
    };
    this.auditLogs.unshift(log);
  }

  // ===================== WEBSITE INFORMATION =====================
  public getInformation(websiteId: string): WebsiteInformation | null {
    if (this.infoMap[websiteId]) return { ...this.infoMap[websiteId] };
    const first = Object.values(this.infoMap)[0];
    return first ? { ...first, website_id: websiteId } : null;
  }

  public updateInformation(websiteId: string, data: Partial<WebsiteInformation>, actorName?: string): WebsiteInformation {
    const current = this.getInformation(websiteId) || {
      website_id: websiteId,
      business_name: 'Client Business',
      tagline: 'Digital Experience',
      description: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postal_code: '',
      country: '',
      opening_hours: {},
      social_links: {},
      logo_url: '',
      favicon_url: '',
      seo_title: '',
      seo_description: '',
      og_image_url: '',
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Antoine Mercier',
    };

    const updated: WebsiteInformation = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Antoine Mercier',
    };

    this.infoMap[websiteId] = updated;
    this.logAction(websiteId, 'Updated Business Information & Meta', updated.business_name, actorName);
    return updated;
  }

  // ===================== HOMEPAGE CONTENT =====================
  public getHomepage(websiteId: string): HomepageContent | null {
    if (this.homepageMap[websiteId]) return { ...this.homepageMap[websiteId] };
    const first = Object.values(this.homepageMap)[0];
    return first ? { ...first, website_id: websiteId } : null;
  }

  public updateHomepage(websiteId: string, data: Partial<HomepageContent>, actorName?: string): HomepageContent {
    const current = this.getHomepage(websiteId) || {
      website_id: websiteId,
      hero_badge: '',
      hero_headline: '',
      hero_description: '',
      primary_cta_label: '',
      primary_cta_link: '',
      secondary_cta_label: '',
      secondary_cta_link: '',
      hero_image_url: '',
      announcement_banner_active: false,
      announcement_banner_text: '',
      featured_services_enabled: true,
      featured_products_enabled: false,
      testimonials_enabled: true,
      gallery_preview_enabled: true,
      faq_section_enabled: true,
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Antoine Mercier',
    };

    const updated: HomepageContent = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Antoine Mercier',
    };

    this.homepageMap[websiteId] = updated;
    this.logAction(websiteId, 'Updated Homepage Hero & Sections', updated.hero_headline, actorName);
    return updated;
  }

  // ===================== SERVICES =====================
  public getServices(websiteId: string): WebsiteService[] {
    return this.servicesMap[websiteId] ? [...this.servicesMap[websiteId]] : [];
  }

  public createService(websiteId: string, tenantId: string, data: Omit<WebsiteService, 'id' | 'website_id' | 'organization_id' | 'created_at' | 'updated_at'>, actorName?: string): WebsiteService {
    const list = this.getServices(websiteId);
    const newService: WebsiteService = {
      id: `srv-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.servicesMap[websiteId] = [newService, ...list];
    this.logAction(tenantId, 'Created Service', newService.name, actorName);
    return newService;
  }

  public updateService(websiteId: string, id: string, data: Partial<WebsiteService>, actorName?: string): WebsiteService | null {
    const list = this.getServices(websiteId);
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.servicesMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Service', updated.name, actorName);
    return updated;
  }

  public deleteService(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getServices(websiteId);
    const target = list.find((s) => s.id === id);
    if (!target) return false;
    this.servicesMap[websiteId] = list.filter((s) => s.id !== id);
    this.logAction(target.organization_id, 'Deleted Service', target.name, actorName);
    return true;
  }

  // ===================== MENU =====================
  public getMenuCategories(websiteId: string): WebsiteMenuCategory[] {
    return this.menuCategoriesMap[websiteId] ? [...this.menuCategoriesMap[websiteId]] : [];
  }

  public getMenuItems(websiteId: string): WebsiteMenuItem[] {
    return this.menuItemsMap[websiteId] ? [...this.menuItemsMap[websiteId]] : [];
  }

  public createMenuItem(websiteId: string, tenantId: string, data: Omit<WebsiteMenuItem, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteMenuItem {
    const list = this.getMenuItems(websiteId);
    const newItem: WebsiteMenuItem = {
      id: `menu-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.menuItemsMap[websiteId] = [newItem, ...list];
    this.logAction(tenantId, 'Added Menu Item', `${newItem.name} ($${newItem.price})`, actorName);
    return newItem;
  }

  public updateMenuItem(websiteId: string, id: string, data: Partial<WebsiteMenuItem>, actorName?: string): WebsiteMenuItem | null {
    const list = this.getMenuItems(websiteId);
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.menuItemsMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Menu Item', updated.name, actorName);
    return updated;
  }

  public deleteMenuItem(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getMenuItems(websiteId);
    const target = list.find((m) => m.id === id);
    if (!target) return false;
    this.menuItemsMap[websiteId] = list.filter((m) => m.id !== id);
    this.logAction(target.organization_id, 'Deleted Menu Item', target.name, actorName);
    return true;
  }

  // ===================== PRODUCTS =====================
  public getProducts(websiteId: string): WebsiteProduct[] {
    return this.productsMap[websiteId] ? [...this.productsMap[websiteId]] : [];
  }

  public createProduct(websiteId: string, tenantId: string, data: Omit<WebsiteProduct, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteProduct {
    const list = this.getProducts(websiteId);
    const newProduct: WebsiteProduct = {
      id: `prod-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.productsMap[websiteId] = [newProduct, ...list];
    this.logAction(tenantId, 'Created Product', `${newProduct.name} (SKU: ${newProduct.sku})`, actorName);
    return newProduct;
  }

  public updateProduct(websiteId: string, id: string, data: Partial<WebsiteProduct>, actorName?: string): WebsiteProduct | null {
    const list = this.getProducts(websiteId);
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.productsMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Product', updated.name, actorName);
    return updated;
  }

  public deleteProduct(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getProducts(websiteId);
    const target = list.find((p) => p.id === id);
    if (!target) return false;
    this.productsMap[websiteId] = list.filter((p) => p.id !== id);
    this.logAction(target.organization_id, 'Deleted Product', target.name, actorName);
    return true;
  }

  // ===================== TEAM MEMBERS =====================
  public getTeamMembers(websiteId: string): WebsiteTeamMember[] {
    return this.teamMap[websiteId] ? [...this.teamMap[websiteId]] : [];
  }

  public createTeamMember(websiteId: string, tenantId: string, data: Omit<WebsiteTeamMember, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteTeamMember {
    const list = this.getTeamMembers(websiteId);
    const newMember: WebsiteTeamMember = {
      id: `team-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.teamMap[websiteId] = [...list, newMember];
    this.logAction(tenantId, 'Added Team Member', `${newMember.name} (${newMember.role})`, actorName);
    return newMember;
  }

  public updateTeamMember(websiteId: string, id: string, data: Partial<WebsiteTeamMember>, actorName?: string): WebsiteTeamMember | null {
    const list = this.getTeamMembers(websiteId);
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.teamMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Team Member', updated.name, actorName);
    return updated;
  }

  public deleteTeamMember(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getTeamMembers(websiteId);
    const target = list.find((m) => m.id === id);
    if (!target) return false;
    this.teamMap[websiteId] = list.filter((m) => m.id !== id);
    this.logAction(target.organization_id, 'Removed Team Member', target.name, actorName);
    return true;
  }

  // ===================== GALLERY =====================
  public getGalleryItems(websiteId: string): WebsiteGalleryItem[] {
    return this.galleryMap[websiteId] ? [...this.galleryMap[websiteId]] : [];
  }

  public addGalleryItem(websiteId: string, tenantId: string, data: Omit<WebsiteGalleryItem, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteGalleryItem {
    const list = this.getGalleryItems(websiteId);
    const newItem: WebsiteGalleryItem = {
      id: `gal-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.galleryMap[websiteId] = [newItem, ...list];
    this.logAction(tenantId, 'Added Gallery Photo', newItem.title, actorName);
    return newItem;
  }

  public deleteGalleryItem(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getGalleryItems(websiteId);
    const target = list.find((g) => g.id === id);
    if (!target) return false;
    this.galleryMap[websiteId] = list.filter((g) => g.id !== id);
    this.logAction(target.organization_id, 'Deleted Gallery Photo', target.title, actorName);
    return true;
  }

  // ===================== ANNOUNCEMENTS =====================
  public getAnnouncements(websiteId: string): WebsiteAnnouncement[] {
    return this.announcementsMap[websiteId] ? [...this.announcementsMap[websiteId]] : [];
  }

  public createAnnouncement(websiteId: string, tenantId: string, data: Omit<WebsiteAnnouncement, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteAnnouncement {
    const list = this.getAnnouncements(websiteId);
    const newAnn: WebsiteAnnouncement = {
      id: `ann-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.announcementsMap[websiteId] = [newAnn, ...list];
    this.logAction(tenantId, 'Created Announcement', newAnn.title, actorName);
    return newAnn;
  }

  public updateAnnouncement(websiteId: string, id: string, data: Partial<WebsiteAnnouncement>, actorName?: string): WebsiteAnnouncement | null {
    const list = this.getAnnouncements(websiteId);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.announcementsMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Announcement', updated.title, actorName);
    return updated;
  }

  public deleteAnnouncement(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getAnnouncements(websiteId);
    const target = list.find((a) => a.id === id);
    if (!target) return false;
    this.announcementsMap[websiteId] = list.filter((a) => a.id !== id);
    this.logAction(target.organization_id, 'Deleted Announcement', target.title, actorName);
    return true;
  }

  // ===================== BLOG / ARTICLES =====================
  public getBlogPosts(websiteId: string): WebsiteBlogPost[] {
    return this.blogMap[websiteId] ? [...this.blogMap[websiteId]] : [];
  }

  public createBlogPost(websiteId: string, tenantId: string, data: Omit<WebsiteBlogPost, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteBlogPost {
    const list = this.getBlogPosts(websiteId);
    const newPost: WebsiteBlogPost = {
      id: `blog-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.blogMap[websiteId] = [newPost, ...list];
    this.logAction(tenantId, 'Published Article', newPost.title, actorName);
    return newPost;
  }

  public updateBlogPost(websiteId: string, id: string, data: Partial<WebsiteBlogPost>, actorName?: string): WebsiteBlogPost | null {
    const list = this.getBlogPosts(websiteId);
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.blogMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated Article', updated.title, actorName);
    return updated;
  }

  public deleteBlogPost(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getBlogPosts(websiteId);
    const target = list.find((b) => b.id === id);
    if (!target) return false;
    this.blogMap[websiteId] = list.filter((b) => b.id !== id);
    this.logAction(target.organization_id, 'Deleted Article', target.title, actorName);
    return true;
  }

  // ===================== FAQS =====================
  public getFaqs(websiteId: string): WebsiteFaq[] {
    return this.faqsMap[websiteId] ? [...this.faqsMap[websiteId]] : [];
  }

  public createFaq(websiteId: string, tenantId: string, data: Omit<WebsiteFaq, 'id' | 'website_id' | 'organization_id' | 'updated_at'>, actorName?: string): WebsiteFaq {
    const list = this.getFaqs(websiteId);
    const newFaq: WebsiteFaq = {
      id: `faq-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.faqsMap[websiteId] = [...list, newFaq];
    this.logAction(tenantId, 'Created FAQ Question', newFaq.question, actorName);
    return newFaq;
  }

  public updateFaq(websiteId: string, id: string, data: Partial<WebsiteFaq>, actorName?: string): WebsiteFaq | null {
    const list = this.getFaqs(websiteId);
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.faqsMap[websiteId] = [...list];
    this.logAction(updated.organization_id, 'Updated FAQ', updated.question, actorName);
    return updated;
  }

  public deleteFaq(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getFaqs(websiteId);
    const target = list.find((f) => f.id === id);
    if (!target) return false;
    this.faqsMap[websiteId] = list.filter((f) => f.id !== id);
    this.logAction(target.organization_id, 'Deleted FAQ', target.question, actorName);
    return true;
  }

  // ===================== NAVIGATION =====================
  public getNavItems(websiteId: string): WebsiteNavItem[] {
    return this.navMap[websiteId] ? [...this.navMap[websiteId]] : [];
  }

  public updateNavItems(websiteId: string, items: WebsiteNavItem[], actorName?: string): WebsiteNavItem[] {
    this.navMap[websiteId] = [...items];
    this.logAction(websiteId, 'Updated Website Navigation Structure', `${items.length} menu items`, actorName);
    return this.navMap[websiteId];
  }

  // ===================== MEDIA LIBRARY =====================
  public getMedia(websiteId: string): MediaItem[] {
    return this.mediaMap[websiteId] ? [...this.mediaMap[websiteId]] : [];
  }

  public addMedia(websiteId: string, tenantId: string, item: Omit<MediaItem, 'id' | 'website_id' | 'organization_id' | 'created_at'>, actorName?: string): MediaItem {
    const list = this.getMedia(websiteId);
    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      created_at: new Date().toISOString(),
      ...item,
    };
    this.mediaMap[websiteId] = [newMedia, ...list];
    this.logAction(tenantId, 'Uploaded Media Asset', newMedia.name, actorName);
    return newMedia;
  }

  public deleteMedia(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getMedia(websiteId);
    const target = list.find((m) => m.id === id);
    if (!target) return false;
    this.mediaMap[websiteId] = list.filter((m) => m.id !== id);
    this.logAction(target.organization_id, 'Deleted Media Asset', target.name, actorName);
    return true;
  }
}

export const websiteDataService = new WebsiteDataStore();

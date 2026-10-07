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
  AuditLogItem,
} from '../types';

// =======================================================================
// PRODUCTION WEBSITE CMS BASELINE (No simulation data)
// =======================================================================

const DEFAULT_WEB_ID = 'web-main';

const DEFAULT_INFO: WebsiteInformation = {
  website_id: DEFAULT_WEB_ID,
  business_name: 'LevelUp Workspace',
  tagline: 'Connected Digital Ecosystem',
  description: 'Manage your website, requests, analytics and services from one secure workspace.',
  phone: '',
  email: 'admin@levelup.dev',
  address: '',
  city: '',
  postal_code: '',
  country: '',
  opening_hours: {
    monday: { open: '09:00', close: '18:00', is_closed: false },
    tuesday: { open: '09:00', close: '18:00', is_closed: false },
    wednesday: { open: '09:00', close: '18:00', is_closed: false },
    thursday: { open: '09:00', close: '18:00', is_closed: false },
    friday: { open: '09:00', close: '18:00', is_closed: false },
    saturday: { open: '10:00', close: '16:00', is_closed: false },
    sunday: { open: '00:00', close: '00:00', is_closed: true },
  },
  social_links: {},
  logo_url: '',
  favicon_url: '/favicon.ico',
  seo_title: 'LevelUp Workspace | Digital Ecosystem',
  seo_description: 'Connected digital workspace portal.',
  og_image_url: '',
  updated_at: new Date().toISOString(),
  updated_by: 'Workspace Admin',
};

const DEFAULT_HOMEPAGE: HomepageContent = {
  website_id: DEFAULT_WEB_ID,
  hero_badge: 'Production Ready',
  hero_headline: 'Welcome to LevelUp',
  hero_description: 'Your digital ecosystem, connected in one secure place.',
  primary_cta_label: 'Get Started',
  primary_cta_link: '#',
  secondary_cta_label: 'Learn More',
  secondary_cta_link: '#',
  hero_image_url: '',
  announcement_banner_active: false,
  announcement_banner_text: '',
  featured_services_enabled: true,
  featured_products_enabled: true,
  testimonials_enabled: true,
  gallery_preview_enabled: true,
  faq_section_enabled: true,
  updated_at: new Date().toISOString(),
  updated_by: 'Workspace Admin',
};

const loadStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(`levelup_cms_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`levelup_cms_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save CMS data to storage', err);
  }
};

// In-Memory Mutative Store with Persistence
class WebsiteDataStore {
  private infoMap: Record<string, WebsiteInformation> = loadStorage('info', {
    [DEFAULT_WEB_ID]: DEFAULT_INFO,
  });
  private homepageMap: Record<string, HomepageContent> = loadStorage('homepage', {
    [DEFAULT_WEB_ID]: DEFAULT_HOMEPAGE,
  });
  private servicesMap: Record<string, WebsiteService[]> = loadStorage('services', {
    [DEFAULT_WEB_ID]: [],
  });
  private menuCategoriesMap: Record<string, WebsiteMenuCategory[]> = loadStorage('menu_categories', {
    [DEFAULT_WEB_ID]: [],
  });
  private menuItemsMap: Record<string, WebsiteMenuItem[]> = loadStorage('menu_items', {
    [DEFAULT_WEB_ID]: [],
  });
  private productsMap: Record<string, WebsiteProduct[]> = loadStorage('products', {
    [DEFAULT_WEB_ID]: [],
  });
  private teamMap: Record<string, WebsiteTeamMember[]> = loadStorage('team', {
    [DEFAULT_WEB_ID]: [],
  });
  private galleryMap: Record<string, WebsiteGalleryItem[]> = loadStorage('gallery', {
    [DEFAULT_WEB_ID]: [],
  });
  private announcementsMap: Record<string, WebsiteAnnouncement[]> = loadStorage('announcements', {
    [DEFAULT_WEB_ID]: [],
  });
  private blogMap: Record<string, WebsiteBlogPost[]> = loadStorage('blog', {
    [DEFAULT_WEB_ID]: [],
  });
  private faqsMap: Record<string, WebsiteFaq[]> = loadStorage('faqs', {
    [DEFAULT_WEB_ID]: [],
  });
  private navMap: Record<string, WebsiteNavItem[]> = loadStorage('nav', {
    [DEFAULT_WEB_ID]: [],
  });
  private mediaMap: Record<string, MediaItem[]> = loadStorage('media', {
    [DEFAULT_WEB_ID]: [],
  });
  private auditLogs: AuditLogItem[] = loadStorage('audit_logs', []);

  // ===================== AUDIT LOGS =====================
  public getAuditLogs(tenantId?: string): AuditLogItem[] {
    if (!tenantId) return this.auditLogs;
    return this.auditLogs.filter((l) => l.tenant_id === tenantId);
  }

  public logAction(tenantId: string, action: string, target: string, actorName = 'Admin'): void {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      tenant_id: tenantId,
      actor_name: actorName,
      actor_role: 'admin',
      action,
      target,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1',
    };
    this.auditLogs.unshift(log);
    saveStorage('audit_logs', this.auditLogs);
  }

  // ===================== WEBSITE INFORMATION =====================
  public getInformation(websiteId: string): WebsiteInformation | null {
    if (this.infoMap[websiteId]) return { ...this.infoMap[websiteId] };
    const first = Object.values(this.infoMap)[0];
    return first ? { ...first, website_id: websiteId } : DEFAULT_INFO;
  }

  public updateInformation(websiteId: string, data: Partial<WebsiteInformation>, actorName?: string): WebsiteInformation {
    const current = this.getInformation(websiteId) || { ...DEFAULT_INFO, website_id: websiteId };

    const updated: WebsiteInformation = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Workspace Admin',
    };

    this.infoMap[websiteId] = updated;
    saveStorage('info', this.infoMap);
    this.logAction(websiteId, 'Updated Business Information', updated.business_name, actorName);
    return updated;
  }

  // ===================== HOMEPAGE CONTENT =====================
  public getHomepage(websiteId: string): HomepageContent | null {
    if (this.homepageMap[websiteId]) return { ...this.homepageMap[websiteId] };
    const first = Object.values(this.homepageMap)[0];
    return first ? { ...first, website_id: websiteId } : DEFAULT_HOMEPAGE;
  }

  public updateHomepage(websiteId: string, data: Partial<HomepageContent>, actorName?: string): HomepageContent {
    const current = this.getHomepage(websiteId) || { ...DEFAULT_HOMEPAGE, website_id: websiteId };

    const updated: HomepageContent = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: actorName || 'Workspace Admin',
    };

    this.homepageMap[websiteId] = updated;
    saveStorage('homepage', this.homepageMap);
    this.logAction(websiteId, 'Updated Homepage Sections', updated.hero_headline, actorName);
    return updated;
  }

  // ===================== SERVICES =====================
  public getServices(websiteId: string): WebsiteService[] {
    return this.servicesMap[websiteId] ? [...this.servicesMap[websiteId]] : [];
  }

  public createService(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteService, 'id' | 'website_id' | 'organization_id' | 'created_at' | 'updated_at'>,
    actorName?: string
  ): WebsiteService {
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
    saveStorage('services', this.servicesMap);
    this.logAction(tenantId, 'Created Service', newService.name, actorName);
    return newService;
  }

  public updateService(websiteId: string, id: string, data: Partial<WebsiteService>, actorName?: string): WebsiteService | null {
    const list = this.getServices(websiteId);
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const updated: WebsiteService = {
      ...list[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    list[index] = updated;
    this.servicesMap[websiteId] = list;
    saveStorage('services', this.servicesMap);
    this.logAction(updated.organization_id, 'Updated Service', updated.name, actorName);
    return updated;
  }

  public deleteService(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getServices(websiteId);
    const target = list.find((s) => s.id === id);
    if (!target) return false;
    this.servicesMap[websiteId] = list.filter((s) => s.id !== id);
    saveStorage('services', this.servicesMap);
    this.logAction(target.organization_id, 'Deleted Service', target.name, actorName);
    return true;
  }

  // ===================== MENU CATEGORIES =====================
  public getMenuCategories(websiteId: string): WebsiteMenuCategory[] {
    return this.menuCategoriesMap[websiteId] ? [...this.menuCategoriesMap[websiteId]] : [];
  }

  public getMenuItems(websiteId: string): WebsiteMenuItem[] {
    return this.menuItemsMap[websiteId] ? [...this.menuItemsMap[websiteId]] : [];
  }

  public createMenuItem(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteMenuItem, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteMenuItem {
    const list = this.getMenuItems(websiteId);
    const newItem: WebsiteMenuItem = {
      id: `menu-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.menuItemsMap[websiteId] = [newItem, ...list];
    saveStorage('menu_items', this.menuItemsMap);
    this.logAction(tenantId, 'Added Menu Item', newItem.name, actorName);
    return newItem;
  }

  public updateMenuItem(websiteId: string, id: string, data: Partial<WebsiteMenuItem>, actorName?: string): WebsiteMenuItem | null {
    const list = this.getMenuItems(websiteId);
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.menuItemsMap[websiteId] = list;
    saveStorage('menu_items', this.menuItemsMap);
    this.logAction(updated.organization_id, 'Updated Menu Item', updated.name, actorName);
    return updated;
  }

  public deleteMenuItem(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getMenuItems(websiteId);
    const target = list.find((m) => m.id === id);
    if (!target) return false;
    this.menuItemsMap[websiteId] = list.filter((m) => m.id !== id);
    saveStorage('menu_items', this.menuItemsMap);
    this.logAction(target.organization_id, 'Deleted Menu Item', target.name, actorName);
    return true;
  }

  // ===================== PRODUCTS =====================
  public getProducts(websiteId: string): WebsiteProduct[] {
    return this.productsMap[websiteId] ? [...this.productsMap[websiteId]] : [];
  }

  public createProduct(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteProduct, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteProduct {
    const list = this.getProducts(websiteId);
    const newProduct: WebsiteProduct = {
      id: `prod-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.productsMap[websiteId] = [newProduct, ...list];
    saveStorage('products', this.productsMap);
    this.logAction(tenantId, 'Added Product', newProduct.name, actorName);
    return newProduct;
  }

  public updateProduct(websiteId: string, id: string, data: Partial<WebsiteProduct>, actorName?: string): WebsiteProduct | null {
    const list = this.getProducts(websiteId);
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.productsMap[websiteId] = list;
    saveStorage('products', this.productsMap);
    this.logAction(updated.organization_id, 'Updated Product', updated.name, actorName);
    return updated;
  }

  public deleteProduct(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getProducts(websiteId);
    const target = list.find((p) => p.id === id);
    if (!target) return false;
    this.productsMap[websiteId] = list.filter((p) => p.id !== id);
    saveStorage('products', this.productsMap);
    this.logAction(target.organization_id, 'Deleted Product', target.name, actorName);
    return true;
  }

  // ===================== TEAM MEMBERS =====================
  public getTeam(websiteId: string): WebsiteTeamMember[] {
    return this.teamMap[websiteId] ? [...this.teamMap[websiteId]] : [];
  }

  public getTeamMembers(websiteId: string): WebsiteTeamMember[] {
    return this.getTeam(websiteId);
  }

  public createTeamMember(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteTeamMember, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteTeamMember {
    const list = this.getTeam(websiteId);
    const newMember: WebsiteTeamMember = {
      id: `tm-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.teamMap[websiteId] = [newMember, ...list];
    saveStorage('team', this.teamMap);
    this.logAction(tenantId, 'Added Team Member', newMember.name, actorName);
    return newMember;
  }

  public updateTeamMember(websiteId: string, id: string, data: Partial<WebsiteTeamMember>, actorName?: string): WebsiteTeamMember | null {
    const list = this.getTeam(websiteId);
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.teamMap[websiteId] = list;
    saveStorage('team', this.teamMap);
    this.logAction(updated.organization_id, 'Updated Team Member Profile', updated.name, actorName);
    return updated;
  }

  public deleteTeamMember(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getTeam(websiteId);
    const target = list.find((t) => t.id === id);
    if (!target) return false;
    this.teamMap[websiteId] = list.filter((t) => t.id !== id);
    saveStorage('team', this.teamMap);
    this.logAction(target.organization_id, 'Deleted Team Member', target.name, actorName);
    return true;
  }

  // ===================== GALLERY =====================
  public getGallery(websiteId: string): WebsiteGalleryItem[] {
    return this.galleryMap[websiteId] ? [...this.galleryMap[websiteId]] : [];
  }

  public getGalleryItems(websiteId: string): WebsiteGalleryItem[] {
    return this.getGallery(websiteId);
  }

  public addGalleryItem(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteGalleryItem, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteGalleryItem {
    const list = this.getGallery(websiteId);
    const newItem: WebsiteGalleryItem = {
      id: `gal-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.galleryMap[websiteId] = [newItem, ...list];
    saveStorage('gallery', this.galleryMap);
    this.logAction(tenantId, 'Added Gallery Asset', newItem.title, actorName);
    return newItem;
  }

  public deleteGalleryItem(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getGallery(websiteId);
    const target = list.find((g) => g.id === id);
    if (!target) return false;
    this.galleryMap[websiteId] = list.filter((g) => g.id !== id);
    saveStorage('gallery', this.galleryMap);
    this.logAction(target.organization_id, 'Deleted Gallery Image', target.title, actorName);
    return true;
  }

  // ===================== ANNOUNCEMENTS =====================
  public getAnnouncements(websiteId: string): WebsiteAnnouncement[] {
    return this.announcementsMap[websiteId] ? [...this.announcementsMap[websiteId]] : [];
  }

  public createAnnouncement(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteAnnouncement, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteAnnouncement {
    const list = this.getAnnouncements(websiteId);
    const newAnn: WebsiteAnnouncement = {
      id: `ann-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.announcementsMap[websiteId] = [newAnn, ...list];
    saveStorage('announcements', this.announcementsMap);
    this.logAction(tenantId, 'Published Announcement', newAnn.title, actorName);
    return newAnn;
  }

  public updateAnnouncement(websiteId: string, id: string, data: Partial<WebsiteAnnouncement>, actorName?: string): WebsiteAnnouncement | null {
    const list = this.getAnnouncements(websiteId);
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.announcementsMap[websiteId] = list;
    saveStorage('announcements', this.announcementsMap);
    this.logAction(updated.organization_id, 'Updated Announcement', updated.title, actorName);
    return updated;
  }

  public deleteAnnouncement(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getAnnouncements(websiteId);
    const target = list.find((a) => a.id === id);
    if (!target) return false;
    this.announcementsMap[websiteId] = list.filter((a) => a.id !== id);
    saveStorage('announcements', this.announcementsMap);
    this.logAction(target.organization_id, 'Deleted Announcement', target.title, actorName);
    return true;
  }

  // ===================== BLOG POSTS =====================
  public getBlogPosts(websiteId: string): WebsiteBlogPost[] {
    return this.blogMap[websiteId] ? [...this.blogMap[websiteId]] : [];
  }

  public createBlogPost(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteBlogPost, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteBlogPost {
    const list = this.getBlogPosts(websiteId);
    const newPost: WebsiteBlogPost = {
      id: `post-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.blogMap[websiteId] = [newPost, ...list];
    saveStorage('blog', this.blogMap);
    this.logAction(tenantId, 'Created Blog Article', newPost.title, actorName);
    return newPost;
  }

  public updateBlogPost(websiteId: string, id: string, data: Partial<WebsiteBlogPost>, actorName?: string): WebsiteBlogPost | null {
    const list = this.getBlogPosts(websiteId);
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.blogMap[websiteId] = list;
    saveStorage('blog', this.blogMap);
    this.logAction(updated.organization_id, 'Updated Blog Article', updated.title, actorName);
    return updated;
  }

  public deleteBlogPost(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getBlogPosts(websiteId);
    const target = list.find((b) => b.id === id);
    if (!target) return false;
    this.blogMap[websiteId] = list.filter((b) => b.id !== id);
    saveStorage('blog', this.blogMap);
    this.logAction(target.organization_id, 'Deleted Blog Article', target.title, actorName);
    return true;
  }

  // ===================== FAQS =====================
  public getFaqs(websiteId: string): WebsiteFaq[] {
    return this.faqsMap[websiteId] ? [...this.faqsMap[websiteId]] : [];
  }

  public createFaq(
    websiteId: string,
    tenantId: string,
    data: Omit<WebsiteFaq, 'id' | 'website_id' | 'organization_id' | 'updated_at'>,
    actorName?: string
  ): WebsiteFaq {
    const list = this.getFaqs(websiteId);
    const newFaq: WebsiteFaq = {
      id: `faq-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      updated_at: new Date().toISOString(),
      ...data,
    };
    this.faqsMap[websiteId] = [newFaq, ...list];
    saveStorage('faqs', this.faqsMap);
    this.logAction(tenantId, 'Added FAQ Question', newFaq.question, actorName);
    return newFaq;
  }

  public updateFaq(websiteId: string, id: string, data: Partial<WebsiteFaq>, actorName?: string): WebsiteFaq | null {
    const list = this.getFaqs(websiteId);
    const index = list.findIndex((f) => f.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...data, updated_at: new Date().toISOString() };
    list[index] = updated;
    this.faqsMap[websiteId] = list;
    saveStorage('faqs', this.faqsMap);
    this.logAction(updated.organization_id, 'Updated FAQ', updated.question, actorName);
    return updated;
  }

  public deleteFaq(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getFaqs(websiteId);
    const target = list.find((f) => f.id === id);
    if (!target) return false;
    this.faqsMap[websiteId] = list.filter((f) => f.id !== id);
    saveStorage('faqs', this.faqsMap);
    this.logAction(target.organization_id, 'Deleted FAQ', target.question, actorName);
    return true;
  }

  // ===================== NAVIGATION =====================
  public getNavItems(websiteId: string): WebsiteNavItem[] {
    return this.navMap[websiteId] ? [...this.navMap[websiteId]] : [];
  }

  public updateNavItems(websiteId: string, items: WebsiteNavItem[], actorName?: string): WebsiteNavItem[] {
    this.navMap[websiteId] = [...items];
    saveStorage('nav', this.navMap);
    this.logAction(websiteId, 'Updated Navigation Structure', `${items.length} items`, actorName);
    return this.navMap[websiteId];
  }

  // ===================== MEDIA LIBRARY =====================
  public getMedia(websiteId: string): MediaItem[] {
    return this.mediaMap[websiteId] ? [...this.mediaMap[websiteId]] : [];
  }

  public addMedia(
    websiteId: string,
    tenantId: string,
    item: Omit<MediaItem, 'id' | 'website_id' | 'organization_id' | 'created_at'>,
    actorName?: string
  ): MediaItem {
    const list = this.getMedia(websiteId);
    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      website_id: websiteId,
      organization_id: tenantId,
      created_at: new Date().toISOString(),
      ...item,
    };
    this.mediaMap[websiteId] = [newMedia, ...list];
    saveStorage('media', this.mediaMap);
    this.logAction(tenantId, 'Uploaded Media Asset', newMedia.name, actorName);
    return newMedia;
  }

  public deleteMedia(websiteId: string, id: string, actorName?: string): boolean {
    const list = this.getMedia(websiteId);
    const target = list.find((m) => m.id === id);
    if (!target) return false;
    this.mediaMap[websiteId] = list.filter((m) => m.id !== id);
    saveStorage('media', this.mediaMap);
    this.logAction(target.organization_id, 'Deleted Media Asset', target.name, actorName);
    return true;
  }
}

export const websiteDataService = new WebsiteDataStore();

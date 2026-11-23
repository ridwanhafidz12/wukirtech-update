import { createClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = 'wukirtech-media';

let cachedClient = null;
let currentClientKey = null;

const DEFAULT_SUPABASE_URL = 'https://phmrlopuueudsoukdsah.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_3Wt0_jLcBuQpS9WRsYt4Kg_IngLHTRh';

/**
 * Mendapatkan konfigurasi Supabase dari environment variable (.env) atau default publik
 */
export function getSupabaseConfig() {
  const url = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();
  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return {
    url,
    anonKey,
    isConfigured,
  };
}

/**
 * Mendapatkan client Supabase aktif (singleton)
 */
export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  const key = `${config.url}_${config.anonKey}`;
  if (cachedClient && currentClientKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentClientKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Gagal menginisialisasi client Supabase:', err);
    return null;
  }
}

// ---------------- ROW MAPPERS (Snake Case DB <-> Camel Case App) ----------------

export function mapCategoryFromDb(row) {
  return {
    id: row.id,
    name: row.name || '',
    slug: row.slug || '',
    description: row.description || '',
    badgeColor: row.badge_color || 'bg-primary/10 text-primary border-primary/30',
  };
}

export function mapCategoryToDb(cat) {
  return {
    id: cat.id,
    name: cat.name || '',
    slug: cat.slug || '',
    description: cat.description || '',
    badge_color: cat.badgeColor || 'bg-primary/10 text-primary border-primary/30',
  };
}

export function mapProductFromDb(row) {
  const rawImages = Array.isArray(row.images) && row.images.length > 0
    ? row.images
    : (row.image_url ? [row.image_url] : ['/batik.jpg']);

  return {
    id: row.id,
    name: row.name || '',
    category: row.category || '',
    umkm: row.umkm || '',
    price: row.price || '',
    priceNum: Number(row.price_num) || 0,
    description: row.description || '',
    fullDescription: row.full_description || row.description || '',
    imageUrl: row.image_url || rawImages[0] || '/batik.jpg',
    images: rawImages,
    qrisImage: row.qris_image || '',
    imageAlt: row.image_alt || row.name || '',
    isNew: Boolean(row.is_new),
    phone: row.phone || '628816413617',
    stockStatus: row.stock_status || 'Tersedia',
    weight: row.weight || '350 gram',
    rating: Number(row.rating) || 4.9,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    createdAt: row.created_at,
  };
}

export function mapProductToDb(p) {
  const rawImages = Array.isArray(p.images) && p.images.length > 0
    ? p.images.filter(Boolean)
    : (p.imageUrl ? [p.imageUrl] : ['/batik.jpg']);

  return {
    id: p.id,
    name: p.name || '',
    category: p.category || '',
    umkm: p.umkm || 'UMKM Wukirsari',
    price: p.price || '',
    price_num: Number(p.priceNum) || 0,
    description: p.description || '',
    full_description: p.fullDescription || p.description || '',
    image_url: p.imageUrl || rawImages[0] || '/batik.jpg',
    images: rawImages,
    qris_image: p.qrisImage || '',
    image_alt: p.imageAlt || p.name || '',
    is_new: Boolean(p.isNew),
    phone: p.phone || '628816413617',
    stock_status: p.stockStatus || 'Tersedia',
    weight: p.weight || '350 gram',
    rating: Number(p.rating) || 4.9,
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    specifications: Array.isArray(p.specifications) ? p.specifications : [],
  };
}

export function mapEventFromDb(row) {
  return {
    id: row.id,
    title: row.title || '',
    date: row.date || '',
    dateDisplay: row.date_display || row.date || '',
    time: row.time || '',
    location: row.location || '',
    venueDetail: row.venue_detail || row.location || '',
    coordinates: Array.isArray(row.coordinates) ? row.coordinates : [-7.9088, 110.4150],
    googleMapsUrl: row.google_maps_url || '',
    image: row.image || '',
    category: row.category || 'Budaya',
    status: row.status || 'Akan Datang',
    description: row.description || '',
    fullDescription: row.full_description || row.description || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    tips: row.tips || '',
  };
}

export function mapEventToDb(e) {
  return {
    id: e.id,
    title: e.title || '',
    date: e.date || '',
    date_display: e.dateDisplay || e.date || '',
    time: e.time || '',
    location: e.location || '',
    venue_detail: e.venueDetail || e.location || '',
    coordinates: Array.isArray(e.coordinates) ? e.coordinates : [-7.9088, 110.4150],
    google_maps_url: e.googleMapsUrl || '',
    image: e.image || '',
    category: e.category || 'Budaya',
    status: e.status || 'Akan Datang',
    description: e.description || '',
    full_description: e.fullDescription || e.description || '',
    highlights: Array.isArray(e.highlights) ? e.highlights : [],
    tips: e.tips || '',
  };
}

export function mapNewsFromDb(row) {
  return {
    id: row.id,
    tag: row.tag || '',
    category: row.category || '',
    title: row.title || '',
    subtitle: row.subtitle || '',
    date: row.date || '',
    readTime: row.read_time || '',
    location: row.location || '',
    author: row.author || '',
    image: row.image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    summary: row.summary || '',
    content: Array.isArray(row.content) ? row.content : [],
  };
}

export function mapNewsToDb(n) {
  return {
    id: n.id,
    tag: n.tag || '',
    category: n.category || '',
    title: n.title || '',
    subtitle: n.subtitle || '',
    date: n.date || '',
    read_time: n.readTime || '',
    location: n.location || '',
    author: n.author || '',
    image: n.image || '',
    gallery: Array.isArray(n.gallery) ? n.gallery : [],
    highlights: Array.isArray(n.highlights) ? n.highlights : [],
    summary: n.summary || '',
    content: Array.isArray(n.content) ? n.content : [],
  };
}

export function mapVrSceneFromDb(row) {
  return {
    id: row.id,
    name: row.name || '',
    category: row.category || 'Wisata',
    image: row.image || '/images/destinasi/makam-imogiri.jpg',
    description: row.description || '',
    initialYaw: Number(row.initial_yaw) || 0,
    initialPitch: Number(row.initial_pitch) || 0,
    hotspots: Array.isArray(row.hotspots) ? row.hotspots : [],
    sortOrder: Number(row.sort_order) || 0,
  };
}

export function mapVrSceneToDb(s, sortOrder = 0) {
  return {
    id: s.id,
    name: s.name || 'Ruangan Baru',
    category: s.category || 'Wisata',
    image: s.image || '/images/destinasi/makam-imogiri.jpg',
    description: s.description || '',
    initial_yaw: Number(s.initialYaw) || 0,
    initial_pitch: Number(s.initialPitch) || 0,
    hotspots: Array.isArray(s.hotspots) ? s.hotspots : [],
    sort_order: Number(s.sortOrder !== undefined ? s.sortOrder : sortOrder) || 0,
  };
}

// ---------------- FETCH & CRUD SUPABASE ----------------

export async function fetchAllRelationalData() {
  const client = getSupabaseClient();
  if (!client) return { ok: false, data: null, error: 'Supabase belum dikonfigurasi di .env' };

  try {
    const [catRes, prodRes, evtRes, newsRes, vrConfRes, vrScenesRes] = await Promise.all([
      client.from('categories').select('*').order('created_at', { ascending: true }),
      client.from('products').select('*').order('created_at', { ascending: false }),
      client.from('events').select('*').order('date', { ascending: true }),
      client.from('news').select('*').order('created_at', { ascending: false }),
      client.from('vr_tour_config').select('*').eq('id', 'default').maybeSingle(),
      client.from('vr_scenes').select('*').order('sort_order', { ascending: true }),
    ]);

    const firstError = [catRes, prodRes, evtRes, newsRes, vrConfRes, vrScenesRes].find((r) => r.error)?.error;
    if (firstError) {
      console.warn('Supabase fetch error:', firstError.message);
      return { ok: false, data: null, error: firstError.message };
    }

    const categories = (catRes.data || []).map(mapCategoryFromDb);
    const products = (prodRes.data || []).map(mapProductFromDb);
    const events = (evtRes.data || []).map(mapEventFromDb);
    const news = (newsRes.data || []).map(mapNewsFromDb);
    const scenes = (vrScenesRes.data || []).map(mapVrSceneFromDb);

    const confRow = vrConfRes.data;
    const vrTour = {
      title: confRow?.title || 'VR Tour 360° Desa Wisata Wukirsari',
      subtitle: confRow?.subtitle || 'Jelajah virtual interaktif cagar budaya dan alam Wukirsari, Imogiri',
      theme: confRow?.theme || 'Cultural Heritage & Nature',
      startSceneId: confRow?.start_scene_id || scenes[0]?.id || '',
      scenes,
    };

    return {
      ok: true,
      data: { categories, products, events, news, vrTour },
      error: null,
    };
  } catch (err) {
    console.error('Error in fetchAllRelationalData:', err);
    return { ok: false, data: null, error: err.message };
  }
}

export async function dbInsertProduct(product) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('products').upsert(mapProductToDb(product), { onConflict: 'id' });
  if (error) console.error('dbInsertProduct error:', error.message);
}

export async function dbUpdateProduct(product) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('products').upsert(mapProductToDb(product), { onConflict: 'id' });
  if (error) console.error('dbUpdateProduct error:', error.message);
}

export async function dbDeleteProduct(id) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('products').delete().eq('id', id);
  if (error) console.error('dbDeleteProduct error:', error.message);
}

export async function dbInsertCategory(cat) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('categories').upsert(mapCategoryToDb(cat), { onConflict: 'id' });
  if (error) console.error('dbInsertCategory error:', error.message);
}

export async function dbUpdateCategory(cat) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('categories').upsert(mapCategoryToDb(cat), { onConflict: 'id' });
  if (error) console.error('dbUpdateCategory error:', error.message);
}

export async function dbRenameProductCategory(oldName, newName) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('products').update({ category: newName }).eq('category', oldName);
  if (error) console.error('dbRenameProductCategory error:', error.message);
}

export async function dbDeleteCategory(id) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('categories').delete().eq('id', id);
  if (error) console.error('dbDeleteCategory error:', error.message);
}

export async function dbInsertEvent(evt) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('events').upsert(mapEventToDb(evt), { onConflict: 'id' });
  if (error) console.error('dbInsertEvent error:', error.message);
}

export async function dbUpdateEvent(evt) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('events').upsert(mapEventToDb(evt), { onConflict: 'id' });
  if (error) console.error('dbUpdateEvent error:', error.message);
}

export async function dbDeleteEvent(id) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('events').delete().eq('id', id);
  if (error) console.error('dbDeleteEvent error:', error.message);
}

export async function dbUpdateVrTourConfig(config) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('vr_tour_config').upsert(
    {
      id: 'default',
      title: config.title || 'VR Tour 360° Desa Wisata Wukirsari',
      subtitle: config.subtitle || '',
      theme: config.theme || 'Cultural Heritage & Nature',
      start_scene_id: config.startSceneId || '',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
  if (error) console.error('dbUpdateVrTourConfig error:', error.message);
}

export async function dbUpsertVrScene(scene, sortOrder = 0) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('vr_scenes').upsert(mapVrSceneToDb(scene, sortOrder), { onConflict: 'id' });
  if (error) console.error('dbUpsertVrScene error:', error.message);
}

export async function dbDeleteVrScene(id) {
  const client = getSupabaseClient();
  if (!client) return;
  const { error } = await client.from('vr_scenes').delete().eq('id', id);
  if (error) console.error('dbDeleteVrScene error:', error.message);
}

export async function dbClearAllData() {
  const client = getSupabaseClient();
  if (!client) return;
  await Promise.all([
    client.from('products').delete().neq('id', '__none__'),
    client.from('categories').delete().neq('id', '__none__'),
    client.from('events').delete().neq('id', '__none__'),
    client.from('news').delete().neq('id', '__none__'),
    client.from('vr_scenes').delete().neq('id', '__none__'),
  ]);
}

export async function dbReplaceAllData({ categories, products, events, news, vrTour }) {
  const client = getSupabaseClient();
  if (!client) return;
  await dbClearAllData();

  if (Array.isArray(categories) && categories.length > 0) {
    await client.from('categories').upsert(categories.map(mapCategoryToDb), { onConflict: 'id' });
  }
  if (Array.isArray(products) && products.length > 0) {
    await client.from('products').upsert(products.map(mapProductToDb), { onConflict: 'id' });
  }
  if (Array.isArray(events) && events.length > 0) {
    await client.from('events').upsert(events.map(mapEventToDb), { onConflict: 'id' });
  }
  if (Array.isArray(news) && news.length > 0) {
    await client.from('news').upsert(news.map(mapNewsToDb), { onConflict: 'id' });
  }
  if (vrTour) {
    await dbUpdateVrTourConfig(vrTour);
    if (Array.isArray(vrTour.scenes) && vrTour.scenes.length > 0) {
      await client.from('vr_scenes').upsert(
        vrTour.scenes.map((s, idx) => mapVrSceneToDb(s, idx)),
        { onConflict: 'id' }
      );
    }
  }
}

export async function uploadMediaToCloud(file, folder = 'vr-scenes') {
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: 'Supabase tidak dikonfigurasi' };

  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

    const { error } = await client.storage.from(STORAGE_BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) throw error;

    const { data: publicUrlData } = client.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
    return { ok: true, publicUrl: publicUrlData.publicUrl, filePath };
  } catch (err) {
    console.warn('Gagal upload media ke Supabase Storage:', err.message);
    return { ok: false, error: err.message };
  }
}

export function subscribeToRelationalChanges(onRefresh) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('wukirtech_relational_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vr_tour_config' }, () => onRefresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vr_scenes' }, () => onRefresh())
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Gagal mengaktifkan realtime Supabase:', err);
    return null;
  }
}

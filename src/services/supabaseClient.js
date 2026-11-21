import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'wukirtech_supabase_url';
const STORAGE_KEY_KEY = 'wukirtech_supabase_anon_key';
export const TABLE_NAME = 'wukirtech_app_data';
export const STORAGE_BUCKET = 'wukirtech-media';

let cachedClient = null;
let currentClientKey = null;

/**
 * Mendapatkan konfigurasi Supabase dari environment variable atau localStorage
 */
export function getSupabaseConfig() {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let localUrl = '';
  let localKey = '';
  try {
    localUrl = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
    localKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
  } catch (e) {
    // ignore localStorage errors
  }

  const url = localUrl || envUrl;
  const anonKey = localKey || envKey;
  const isConfigured = Boolean(url && anonKey && url.startsWith('http'));

  return {
    url,
    anonKey,
    source: localUrl ? 'localStorage' : envUrl ? 'env' : 'none',
    isConfigured,
  };
}

/**
 * Menyimpan konfigurasi Supabase ke localStorage agar admin bisa langsung
 * mengkonfigurasi dari dashboard tanpa perlu deploy ulang .env
 */
export function saveSupabaseConfig({ url, anonKey }) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();

  if (cleanUrl) {
    localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
  } else {
    localStorage.removeItem(STORAGE_KEY_URL);
  }

  if (cleanKey) {
    localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
  } else {
    localStorage.removeItem(STORAGE_KEY_KEY);
  }

  cachedClient = null;
  currentClientKey = null;
  return getSupabaseClient();
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
  currentClientKey = null;
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

/**
 * SQL Schema Script untuk Supabase SQL Editor
 */
export function getSetupSqlScript() {
  return `-- =======================================================
-- SKRIP SETUP DATABASE WUKIRTECH (MULTI-DEVICE SYNC)
-- Jalankan skrip ini sekali di Supabase Dashboard -> SQL Editor
-- =======================================================

-- 1. Buat tabel penyimpanan data terpusat
CREATE TABLE IF NOT EXISTS public.wukirtech_app_data (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.wukirtech_app_data ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan BACA publik (agar HP pengunjung & teman dapat memuat data)
DROP POLICY IF EXISTS "Allow public read wukirtech_app_data" ON public.wukirtech_app_data;
CREATE POLICY "Allow public read wukirtech_app_data" 
  ON public.wukirtech_app_data 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- 4. Kebijakan TULIS publik (agar Admin dapat menyimpan dari mana saja)
DROP POLICY IF EXISTS "Allow public write wukirtech_app_data" ON public.wukirtech_app_data;
CREATE POLICY "Allow public write wukirtech_app_data" 
  ON public.wukirtech_app_data 
  FOR ALL 
  TO anon, authenticated 
  USING (true)
  WITH CHECK (true);

-- 5. Aktifkan Realtime agar setiap perubahan langsung terupdate di seluruh HP tanpa reload
ALTER PUBLICATION supabase_realtime ADD TABLE public.wukirtech_app_data;

-- 6. (Opsional) Buat Storage Bucket publik untuk Foto 360 & Produk
INSERT INTO storage.buckets (id, name, public)
VALUES ('wukirtech-media', 'wukirtech-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public access to wukirtech-media" ON storage.objects;
CREATE POLICY "Public access to wukirtech-media" 
  ON storage.objects 
  FOR ALL 
  TO anon, authenticated 
  USING (bucket_id = 'wukirtech-media')
  WITH CHECK (bucket_id = 'wukirtech-media');
`;
}

/**
 * Tes koneksi ke Supabase dan cek apakah tabel wukirtech_app_data sudah ada
 */
export async function testSupabaseConnection() {
  const client = getSupabaseClient();
  if (!client) {
    return {
      ok: false,
      message: 'Supabase belum dikonfigurasi. Masukkan Project URL dan Anon Key.',
      tableExists: false,
    };
  }

  try {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('key, updated_at')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          ok: false,
          tableExists: false,
          message: `Koneksi berhasil, tetapi tabel "${TABLE_NAME}" belum dibuat di Supabase. Silakan salin & jalankan skrip SQL di Supabase SQL Editor.`,
          error: error.message,
        };
      }
      return {
        ok: false,
        tableExists: false,
        message: `Koneksi ditolak: ${error.message} (Cek kembali Anon Key dan URL).`,
        error: error.message,
      };
    }

    return {
      ok: true,
      tableExists: true,
      message: 'Koneksi ke Supabase Berhasil! Database online siap digunakan.',
      data,
    };
  } catch (err) {
    return {
      ok: false,
      tableExists: false,
      message: `Gagal menghubungi Supabase: ${err.message || 'Periksa koneksi internet.'}`,
      error: err,
    };
  }
}

/**
 * Mengambil seluruh data aplikasi dari Cloud Supabase
 */
export async function fetchAppDataFromCloud() {
  const client = getSupabaseClient();
  if (!client) return { ok: false, data: null, error: 'Not configured' };

  try {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('key, data, updated_at');

    if (error) {
      console.warn('Gagal memuat data dari Supabase:', error.message);
      return { ok: false, data: null, error: error.message };
    }

    const result = {
      products: null,
      categories: null,
      events: null,
      news: null,
      vrTour: null,
      updatedAtMap: {},
    };

    if (Array.isArray(data)) {
      data.forEach((row) => {
        result.updatedAtMap[row.key] = row.updated_at;
        if (row.key === 'products' && Array.isArray(row.data)) {
          result.products = row.data;
        } else if (row.key === 'categories' && Array.isArray(row.data)) {
          result.categories = row.data;
        } else if (row.key === 'events' && Array.isArray(row.data)) {
          result.events = row.data;
        } else if (row.key === 'news' && Array.isArray(row.data)) {
          result.news = row.data;
        } else if (row.key === 'vr_tour' && row.data) {
          result.vrTour = row.data;
        }
      });
    }

    return { ok: true, data: result, error: null };
  } catch (err) {
    console.error('Error in fetchAppDataFromCloud:', err);
    return { ok: false, data: null, error: err.message };
  }
}

/**
 * Menyimpan satu koleksi (products, events, vr_tour, dll) ke Supabase
 */
export async function saveCollectionToCloud(key, data) {
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: 'Not configured' };

  try {
    const { error } = await client.from(TABLE_NAME).upsert(
      {
        key,
        data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    );

    if (error) throw error;
    return { ok: true, error: null };
  } catch (err) {
    console.error(`Gagal menyimpan koleksi "${key}" ke Supabase:`, err);
    return { ok: false, error: err.message || err };
  }
}

/**
 * Mengunggah SEMUA data lokal (dari laptop saat ini) ke Supabase sekaligus
 * Berguna saat pertama kali menghubungkan laptop ke Cloud
 */
export async function syncAllToCloud({ products, categories, events, news, vrTour }) {
  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const rows = [
    { key: 'products', data: products, updated_at: new Date().toISOString() },
    { key: 'categories', data: categories, updated_at: new Date().toISOString() },
    { key: 'events', data: events, updated_at: new Date().toISOString() },
    { key: 'news', data: news, updated_at: new Date().toISOString() },
    { key: 'vr_tour', data: vrTour, updated_at: new Date().toISOString() },
  ];

  try {
    const { error } = await client
      .from(TABLE_NAME)
      .upsert(rows, { onConflict: 'key' });

    if (error) throw error;

    return {
      ok: true,
      message: 'Semua data (VR Tour, Produk, Agenda, Berita) berhasil disinkronkan ke Cloud Supabase!',
    };
  } catch (err) {
    return {
      ok: false,
      message: `Gagal sinkronisasi data: ${err.message}`,
      error: err,
    };
  }
}

/**
 * Upload file gambar (misal foto panorama 360 atau foto produk) ke Supabase Storage
 */
export async function uploadMediaToCloud(file, folder = 'vr-scenes') {
  const client = getSupabaseClient();
  if (!client) return { ok: false, error: 'Supabase tidak dikonfigurasi' };

  try {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrlData } = client.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      ok: true,
      publicUrl: publicUrlData.publicUrl,
      filePath,
    };
  } catch (err) {
    console.warn('Gagal upload media ke Supabase Storage:', err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
}

/**
 * Langganan Realtime Supabase
 */
export function subscribeToAppDataChanges(onUpdate) {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('wukirtech_app_data_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        (payload) => {
          if (payload?.new && payload.new.key) {
            onUpdate(payload.new.key, payload.new.data, payload.new.updated_at);
          }
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Gagal mengaktifkan realtime Supabase:', err);
    return null;
  }
}

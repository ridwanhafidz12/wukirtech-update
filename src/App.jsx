import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import AgendaPage from '@/pages/AgendaPage';
import GaleriPage from '@/pages/GaleriPage';
import PlannerPage from '@/pages/PlannerPage';
import ProdukPage from '@/pages/ProdukPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import SearchPage from '@/pages/SearchPage';
import AdminPage from '@/pages/AdminPage';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider } from '@/context/DataContext';

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="galeri" element={<GaleriPage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="produk" element={<ProdukPage />} />
          <Route path="produk/:id" element={<ProductDetailPage />} />
          <Route path="cari" element={<SearchPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
      <Toaster />
    </DataProvider>
  );
}

export default App;
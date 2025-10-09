import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import AgendaPage from '@/pages/AgendaPage';
import GaleriPage from '@/pages/GaleriPage';
import ProdukPage from '@/pages/ProdukPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="galeri" element={<GaleriPage />} />
          <Route path="produk" element={<ProdukPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
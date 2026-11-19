import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Share2,
  ArrowRight,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/context/DataContext';
import Panorama360Viewer from '@/components/vr/Panorama360Viewer';

const VrTourPage = () => {
  const { vrTour } = useData();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const scenes = vrTour?.scenes || [];
  const requestedSceneId = searchParams.get('scene');

  const [currentSceneId, setCurrentSceneId] = useState(
    () => requestedSceneId || vrTour?.startSceneId || scenes[0]?.id || ''
  );

  const currentScene = useMemo(
    () => scenes.find((s) => s.id === currentSceneId) || scenes[0] || null,
    [scenes, currentSceneId]
  );

  const handleSelectScene = (sceneId) => {
    setCurrentSceneId(sceneId);
    setSearchParams({ scene: sceneId }, { replace: true });
  };

  const handleShareLink = async () => {
    const shareUrl = `${window.location.origin}/vr-tour${
      currentScene ? `?scene=${encodeURIComponent(currentScene.id)}` : ''
    }`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Tautan Tur Disalin',
        description: shareUrl,
      });
    } catch {
      toast({
        title: 'Tautan Siap Dibagikan',
        description: shareUrl,
      });
    }
  };

  const connectedRooms = useMemo(() => {
    if (!currentScene) return [];
    const navs = (currentScene.hotspots || []).filter((h) => h.type === 'nav');
    return navs
      .map((h) => ({
        hotspotId: h.id,
        label: h.label,
        scene: scenes.find((s) => s.id === h.targetSceneId),
      }))
      .filter((item) => Boolean(item.scene));
  }, [currentScene, scenes]);

  if (!currentScene) {
    return (
      <div className="min-h-screen pt-28 pb-16 container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground mb-4">Tur virtual belum tersedia saat ini.</p>
        <Link to="/">
          <Button size="sm">Kembali ke Beranda</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{vrTour.title || 'VR Tour 360°'} - WukirTech</title>
        <meta
          name="description"
          content={vrTour.subtitle || 'VR Tour 360° interaktif Desa Wisata Wukirsari.'}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/15 to-background pt-20 sm:pt-24 pb-12">
        <div className="container mx-auto px-3 sm:px-6 max-w-7xl space-y-4">
          {/* Header Bar Ringkas */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/40 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-primary font-semibold mb-0.5">
                <span className="inline-flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> VR Tour 360° Interaktif
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{scenes.length} Titik Panorama</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-foreground truncate">
                {vrTour.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleShareLink}
                className="h-8 rounded-xl text-xs"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5" /> Bagikan Link
              </Button>

              <Link to="/">
                <Button size="sm" variant="ghost" className="h-8 rounded-xl text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Beranda
                </Button>
              </Link>
            </div>
          </div>

          {/* Viewport Utama VR Tour 360° */}
          <div className="space-y-3">
            <Panorama360Viewer
              scene={currentScene}
              allScenes={scenes}
              onSelectScene={handleSelectScene}
              className="h-[54vh] sm:h-[64vh] lg:h-[68vh] min-h-[340px] shadow-2xl"
            />

            {/* Deskripsi Singkat Mobile */}
            {currentScene.description && (
              <div className="sm:hidden bg-card/80 border border-border/30 rounded-xl p-3 text-xs">
                <h2 className="font-bold text-foreground mb-0.5">{currentScene.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{currentScene.description}</p>
              </div>
            )}
          </div>

          {/* Menu Ruangan & Peta Mini Koneksi */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Daftar Ruangan Thumbnail (8 cols) */}
            <div className="lg:col-span-8 bg-card/80 border border-border/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-foreground">Daftar Ruangan Panorama</h2>
                <span className="text-[11px] text-muted-foreground">Klik untuk berpindah lokasi</span>
              </div>
              <div className="flex items-stretch gap-3 overflow-x-auto pb-1">
                {scenes.map((scene, idx) => {
                  const isActive = scene.id === currentScene.id;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => handleSelectScene(scene.id)}
                      className={`w-48 flex-shrink-0 text-left rounded-xl overflow-hidden border transition-all ${
                        isActive
                          ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                          : 'border-border/30 bg-secondary/30 hover:bg-secondary/60'
                      }`}
                    >
                      <div className="relative aspect-[16/9] bg-black/40">
                        <img
                          src={scene.image}
                          alt={scene.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/batik.jpg';
                          }}
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="p-2.5">
                        <h3 className="text-xs font-bold text-foreground line-clamp-1">
                          {scene.name}
                        </h3>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" />
                          {scene.hotspots?.length || 0} hotspot
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Peta Mini Koneksi Ruangan Aktif (4 cols) */}
            <div className="lg:col-span-4 bg-card/80 border border-border/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1">Peta Koneksi Ruangan</h2>
                <p className="text-[11px] text-muted-foreground mb-3 line-clamp-1">
                  Dari: <strong className="text-foreground">{currentScene.name}</strong>
                </p>

                {connectedRooms.length > 0 ? (
                  <div className="space-y-2">
                    {connectedRooms.map((conn) => (
                      <button
                        key={conn.hotspotId}
                        type="button"
                        onClick={() => handleSelectScene(conn.scene.id)}
                        className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-secondary/40 hover:bg-primary/15 border border-border/30 hover:border-primary/40 text-left transition-colors"
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-foreground block truncate">
                            {conn.scene.name}
                          </span>
                          <span className="text-[10px] text-primary block truncate">
                            {conn.label}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground py-3">
                    Belum ada jalur keluar dari ruangan ini.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VrTourPage;

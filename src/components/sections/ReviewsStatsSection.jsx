import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS_ROW_1 = [
  {
    id: 'rev-1',
    name: 'Isti Wulandari',
    initials: 'IW',
    avatar: '',
    rating: 5,
    text: 'Seru banget! Pemandu wisata di Makam Raja Imogiri sangat ramah dan paham sejarah Mataram. Setelah ziarah langsung mampir mencanting batik.',
    trip: 'Makam Raja Imogiri • 16 Nov',
    photos: [
      '/images/destinasi/makam-imogiri.jpg',
      '/images/destinasi/masjid-pajimatan.jpg',
      '/batik.jpg',
    ],
  },
  {
    id: 'rev-2',
    name: 'Erika Simbolon',
    initials: 'ES',
    avatar: '',
    rating: 5,
    text: 'Workshop membatik di Giriloyo asyik sekali, ibu-ibu pembatiknya sabar mengajari dari awal pegang canting sampai pewarnaan alam.',
    trip: 'Kampung Batik Giriloyo • 15 Nov',
    photos: [
      '/batik.jpg',
      '/batik-1.jpg',
      '/batik-2.png',
    ],
  },
  {
    id: 'rev-3',
    name: 'Ike Yuli',
    initials: 'IY',
    avatar: '',
    rating: 5,
    text: 'Sumpah seru banget ke Grojogan Pucung dan Bukit Watu Gagak, suasananya masih asri dan sejuk, pas banget buat healing bareng teman.',
    trip: 'Grojogan Pucung • 14 Nov',
    photos: [
      '/images/destinasi/grojogan-pucung.jpg',
      '/images/destinasi/watu-gagak.jpg',
      '/images/destinasi/sungai-oya.jpg',
    ],
  },
  {
    id: 'rev-4',
    name: 'Hamzah Wisnu',
    initials: 'HW',
    avatar: '',
    rating: 5,
    text: 'Pengalaman yang sangat berkesan. Sunset di Watu Gagak juara, lalu malamnya mencicipi wedang uwuh hangat dan pecel kembang turi.',
    trip: 'Bukit Watu Gagak • 12 Nov',
    photos: [
      '/images/destinasi/watu-gagak.jpg',
      '/uwuh.jpg',
      '/images/destinasi/pecel-imogiri.jpg',
    ],
  },
  {
    id: 'rev-5',
    name: 'Nadia Kusuma',
    initials: 'NK',
    avatar: '',
    rating: 5,
    text: 'Anak-anak senang sekali ikut dolanan tradisional dan tanam padi di sawah Wukirsari. Edukatif dan warganya sangat menyambut.',
    trip: 'Kampung Dolanan • 10 Nov',
    photos: [
      '/images/destinasi/kampung-dolanan.jpg',
      '/sawah.jpg',
      '/kipas.jpg',
    ],
  },
];

const REVIEWS_ROW_2 = [
  {
    id: 'rev-6',
    name: 'Vanny Febriyanti',
    initials: 'VF',
    avatar: '',
    rating: 5,
    text: 'Tour keluarga yang ketiga kalinya ke Wukirsari. Piknik di tepi Embung Wukirsari rapi, bersih, dan makanannya enak semua.',
    trip: 'Embung Wukirsari • 9 Nov',
    photos: [
      '/images/destinasi/embung-wukirsari.jpg',
      '/images/destinasi/pecel-imogiri.jpg',
      '/uwuh.jpg',
    ],
  },
  {
    id: 'rev-7',
    name: 'Yiyi Purnama SE',
    initials: 'YP',
    avatar: '',
    rating: 5,
    text: 'Pertama kali menyaksikan tradisi Nguras Enceh langsung di Pajimatan Imogiri, prosesinya khidmat dan penuh nilai budaya Nusantara.',
    trip: 'Tradisi Nguras Enceh • 7 Nov',
    photos: [
      '/images/destinasi/nguras-enceh.jpg',
      '/images/destinasi/enceh-siyem.jpg',
      '/images/destinasi/makam-imogiri.jpg',
    ],
  },
  {
    id: 'rev-8',
    name: 'Amalia Lubis',
    initials: 'AL',
    avatar: '',
    rating: 5,
    text: 'Karya wayang kulit di Dusun Pucung detailnya luar biasa. Bisa lihat langsung proses tatah sungging dan beli suvenir untuk oleh-oleh.',
    trip: 'Sanggar Wayang Pucung • 5 Nov',
    photos: [
      '/wayang.jpeg',
      '/images/destinasi/grojogan-pucung.jpg',
      '/kipas.jpg',
    ],
  },
  {
    id: 'rev-9',
    name: 'Widya Puspita Sari',
    initials: 'WP',
    avatar: '',
    rating: 5,
    text: 'Kirab Budaya Hari Lahir Wukirsari meriah sekali! Bregada dari 16 padukuhan tampil kompak dan kulinernya ramah di kantong.',
    trip: 'Kirab Budaya Wukirsari • 2 Nov',
    photos: [
      '/images/destinasi/kirab-budaya.jpg',
      '/images/destinasi/kirab-gunungan.jpg',
      '/images/destinasi/bukit-bego.jpg',
    ],
  },
  {
    id: 'rev-10',
    name: 'Rizky Pratama',
    initials: 'RP',
    avatar: '',
    rating: 5,
    text: 'Camping di Bukit Bego pemandangannya keren banget, pagi hari dapat lautan kabut dan udara segar perbukitan Imogiri.',
    trip: 'Bukit Bego • 30 Okt',
    photos: [
      '/images/destinasi/bukit-bego.jpg',
      '/images/destinasi/puncak-bucu.jpg',
      '/images/destinasi/sungai-oya.jpg',
    ],
  },
];

const ReviewCard = ({ review }) => (
  <div className="w-[310px] sm:w-[360px] flex-shrink-0 pt-5">
    <div className="relative bg-card/90 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-lg hover:border-primary/40 transition-colors flex gap-3 h-[186px]">
      {/* Left Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Avatar overlapping top-left + Name & Stars */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="-mt-8 w-11 h-11 rounded-full bg-secondary border-2 border-card shadow-md flex items-center justify-center text-xs font-extrabold text-primary flex-shrink-0 overflow-hidden">
              {review.avatar ? (
                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
              ) : (
                <span>{review.initials}</span>
              )}
            </div>
            <div className="min-w-0 -mt-1">
              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {review.name}
              </h4>
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* Quote Text */}
          <div className="relative pl-1 pr-1">
            <span className="text-primary/50 font-serif text-lg leading-none select-none mr-1">
              &ldquo;
            </span>
            <p className="inline text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {review.text}
            </p>
            <span className="text-primary/50 font-serif text-lg leading-none select-none ml-1">
              &rdquo;
            </span>
          </div>
        </div>

        {/* Footer Trip Name & Date */}
        <p className="text-[11px] font-medium text-foreground/80 truncate pt-2 border-t border-border/20">
          {review.trip}
        </p>
      </div>

      {/* Right 3 Small Photo Thumbnails */}
      <div className="w-14 sm:w-16 flex-shrink-0 flex flex-col gap-1.5 justify-center">
        {review.photos.slice(0, 3).map((src, idx) => (
          <div
            key={idx}
            className="w-full h-12 rounded-lg overflow-hidden border border-border/30 bg-secondary/40"
          >
            <img
              src={src}
              alt={`${review.trip} ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/batik.jpg';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ReviewsStatsSection = () => {
  return (
    <section
      id="ulasan"
      className="py-12 md:py-20 bg-gradient-to-b from-background via-secondary/15 to-background relative overflow-hidden"
    >
      <style>{`
        @keyframes wukir-marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wukir-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .wukir-track-left {
          animation: wukir-marquee-left 45s linear infinite;
        }
        .wukir-track-right {
          animation: wukir-marquee-right 48s linear infinite;
        }
        .wukir-marquee-wrap:hover .wukir-track-left,
        .wukir-marquee-wrap:hover .wukir-track-right {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header Review Perjalanan */}
      <div className="container mx-auto px-4 md:px-6 max-w-6xl mb-8">
        <div className="max-w-xl">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1.5">
            Review Perjalanan
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Apa kata mereka tentang{' '}
            <span className="text-primary">Desa Wisata Wukirsari?</span>
          </h2>
        </div>
      </div>

      {/* Two Horizontal Rows of Review Cards */}
      <div className="wukir-marquee-wrap space-y-5 overflow-hidden">
        {/* Row 1 */}
        <div className="flex w-max gap-4 px-4 wukir-track-left">
          {[...REVIEWS_ROW_1, ...REVIEWS_ROW_1].map((rev, idx) => (
            <ReviewCard key={`r1-${rev.id}-${idx}`} review={rev} />
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex w-max gap-4 px-4 wukir-track-right">
          {[...REVIEWS_ROW_2, ...REVIEWS_ROW_2].map((rev, idx) => (
            <ReviewCard key={`r2-${rev.id}-${idx}`} review={rev} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsStatsSection;

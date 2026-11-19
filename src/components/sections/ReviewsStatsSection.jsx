import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

const STATS_ITEMS = [
  {
    value: '15.000+',
    label: 'Review Positif',
    size: 'md',
  },
  {
    value: '520.000+',
    label: 'Total Pengunjung',
    size: 'lg',
  },
  {
    value: '17.000+',
    label: 'Kunjungan Wisata',
    size: 'md',
  },
];

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

const GoldenLaurel = ({ isLarge }) => (
  <svg
    viewBox="0 0 220 130"
    className={`mx-auto ${isLarge ? 'w-56 sm:w-64 h-32 sm:h-36' : 'w-44 sm:w-52 h-24 sm:h-28'}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldLeaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Left Branch */}
    <path
      d="M105 112 C65 108, 32 82, 24 32"
      stroke="url(#goldLeaf)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {[
      'M24 34 C15 28, 16 18, 25 22 C30 25, 29 33, 24 34 Z',
      'M29 50 C17 47, 16 37, 26 39 C33 41, 34 49, 29 50 Z',
      'M37 66 C24 66, 22 56, 32 56 C40 56, 42 63, 37 66 Z',
      'M48 81 C35 84, 32 74, 42 72 C50 70, 53 77, 48 81 Z',
      'M62 94 C50 99, 45 90, 55 86 C63 83, 67 90, 62 94 Z',
      'M79 104 C69 112, 62 104, 71 98 C78 94, 84 99, 79 104 Z',
      'M32 34 C39 27, 46 31, 41 39 C38 44, 31 41, 32 34 Z',
      'M40 50 C48 44, 54 49, 48 56 C44 61, 38 57, 40 50 Z',
      'M51 65 C60 60, 65 66, 58 72 C53 76, 48 71, 51 65 Z',
      'M65 79 C75 76, 78 83, 71 87 C65 90, 61 84, 65 79 Z',
      'M81 91 C91 90, 93 97, 85 100 C79 102, 76 96, 81 91 Z',
    ].map((d, i) => (
      <path key={`l-${i}`} d={d} fill="url(#goldLeaf)" />
    ))}

    {/* Right Branch */}
    <path
      d="M115 112 C155 108, 188 82, 196 32"
      stroke="url(#goldLeaf)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {[
      'M196 34 C205 28, 204 18, 195 22 C190 25, 191 33, 196 34 Z',
      'M191 50 C203 47, 204 37, 194 39 C187 41, 186 49, 191 50 Z',
      'M183 66 C196 66, 198 56, 188 56 C180 56, 178 63, 183 66 Z',
      'M172 81 C185 84, 188 74, 178 72 C170 70, 167 77, 172 81 Z',
      'M158 94 C170 99, 175 90, 165 86 C157 83, 153 90, 158 94 Z',
      'M141 104 C151 112, 158 104, 149 98 C142 94, 136 99, 141 104 Z',
      'M188 34 C181 27, 174 31, 179 39 C182 44, 189 41, 188 34 Z',
      'M180 50 C172 44, 166 49, 172 56 C176 61, 182 57, 180 50 Z',
      'M169 65 C160 60, 155 66, 162 72 C167 76, 172 71, 169 65 Z',
      'M155 79 C145 76, 142 83, 149 87 C155 90, 159 84, 155 79 Z',
      'M139 91 C129 90, 127 97, 135 100 C141 102, 144 96, 139 91 Z',
    ].map((d, i) => (
      <path key={`r-${i}`} d={d} fill="url(#goldLeaf)" />
    ))}

    {/* Center Star */}
    <path
      d="M110 102 L113 109 L120 112 L113 115 L110 122 L107 115 L100 112 L107 109 Z"
      fill="url(#goldLeaf)"
    />
  </svg>
);

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

      {/* Part 1: Jumlah Data Pengunjung & Pencapaian (Laurel Wreath Stats) */}
      <div className="container mx-auto px-4 md:px-6 max-w-5xl mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="relative py-4"
        >
          {/* Decorative Sparkles */}
          <Sparkles className="hidden sm:block absolute top-2 left-8 w-5 h-5 text-amber-400/70" />
          <Sparkles className="hidden sm:block absolute top-0 right-12 w-6 h-6 text-amber-400/80" />
          <Sparkles className="hidden sm:block absolute bottom-2 right-4 w-4 h-4 text-amber-400/60" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 items-center text-center">
            {STATS_ITEMS.map((stat) => {
              const isLarge = stat.size === 'lg';
              return (
                <div key={stat.label} className="flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <GoldenLaurel isLarge={isLarge} />
                    <span
                      className={`absolute font-extrabold tracking-tight text-amber-400 drop-shadow-sm ${
                        isLarge
                          ? 'text-2xl sm:text-3xl md:text-4xl -mt-3'
                          : 'text-xl sm:text-2xl md:text-3xl -mt-2'
                      }`}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground -mt-2">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Part 2: Review Perjalanan */}
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

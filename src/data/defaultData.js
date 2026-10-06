export const defaultCategories = [
  {
    id: "cat-1",
    name: "Kuliner",
    slug: "kuliner",
    description: "Makanan & minuman khas tradisional Desa Wukirsari",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "cat-2",
    name: "Kerajinan Tangan",
    slug: "kerajinan-tangan",
    description: "Batik tulis Giriloyo, kipas bambu, dan karya tangan khas",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "cat-3",
    name: "Seni Pertunjukan",
    slug: "seni-pertunjukan",
    description: "Wayang kulit Pucung, karawitan, dan atraksi kesenian",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "cat-4",
    name: "Wisata Alam & Edukasi",
    slug: "wisata-alam",
    description: "Spot wisata alam Watu Gagak, embung, dan paket edukasi",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "cat-5",
    name: "Jasa & Budaya",
    slug: "jasa-budaya",
    description: "Workshop membatik, tata sungging wayang, dan pemandu lokal",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  },
];

export const defaultProducts = [
  {
    id: "prod-1",
    name: "Wedang Uwuh Bu Endang",
    category: "Kuliner",
    umkm: "UMKM Wukirsari",
    price: "Rp20.000 / 10pcs",
    priceNum: 20000,
    description: "Minuman rempah hangat tradisional khas Imogiri yang menyehatkan tubuh dan kaya antioksidan.",
    fullDescription: "Wedang Uwuh Bu Endang diracik menggunakan perpaduan rempah-rempah pilihan warisan turun-temurun dari Imogiri, Bantul. Terdiri dari kayu secang yang memberikan rona merah alami, jahe emprit bakar yang pedas menghangatkan, cengkeh, kayu manis, pala, serta daun pala dan serai wangi. Setiap kantong sudah dilengkapi dengan gula batu kristal higienis. Minuman ini sangat nikmat diseduh saat cuaca dingin, bermanfaat untuk meningkatkan stamina, meredakan masuk angin, melancarkan sirkulasi darah, dan kaya akan antioksidan alami.",
    imageAlt: "Tiga gelas wedang uwuh hangat disajikan di atas meja",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/831f4e5dfdf72e4880aa6b7ee71b46b8.jpg",
    images: [
      "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/831f4e5dfdf72e4880aa6b7ee71b46b8.jpg",
      "/uwuh.jpg",
    ],
    isNew: false,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.9,
    weight: "250 gram",
    highlights: [
      "100% Rempah Alami Pilihan Tanpa Pengawet",
      "Sudah Termasuk Gula Batu Alami Siap Seduh",
      "Kaya Antioksidan & Menghangatkan Tubuh",
      "Produksi UMKM Asli Binaan Desa Wukirsari"
    ],
    specifications: [
      { label: "Bahan Utama", value: "Secang, Jahe Emprit, Cengkeh, Kapulaga, Kayu Manis, Daun Pala" },
      { label: "Isi Kemasan", value: "10 Bungkus Siap Seduh" },
      { label: "Pemanis", value: "Gula Batu Kristal Alami Terpisah" },
      { label: "Masa Simpan", value: "12 Bulan di tempat kering dan sejuk" },
      { label: "Asal Wilayah", value: "Imogiri, Desa Wukirsari, Bantul, D.I. Yogyakarta" }
    ],
    createdAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "Handmade Batik Giriloyo",
    category: "Kerajinan Tangan",
    umkm: "Handmade batik",
    price: "Rp750.000",
    priceNum: 750000,
    description: "Batik tulis Giriloyo dengan motif klasik tradisi keraton dan pewarnaan berkualitas.",
    fullDescription: "Kain batik tulis otentik karya para pembatik perempuan Paguyuban Giriloyo, Wukirsari. Dibuat dengan metode canting tulis tradisional secara teliti selama berminggu-minggu menggunakan lilin malam alami dan kain mori primissima pilihan kelas satu. Motif klasik sarat dengan filosofi keraton Mataram yang melambangkan keharmonisan jiwa, keteguhan hati, dan kemakmuran hidup. Pewarnaan ramah lingkungan yang tahan luntur menjadikan kain ini koleksi berharga baik untuk busana formal maupun pusaka keluarga.",
    imageAlt: "Batik tulis Giriloyo dengan motif klasik",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg",
    images: [
      "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg",
      "/batik.jpg",
      "/batik-1.jpg",
      "/batik-2.png"
    ],
    isNew: false,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 5.0,
    weight: "350 gram",
    highlights: [
      "100% Batik Tulis Canting Tangan Asli Giriloyo",
      "Kain Mori Primissima Halus dan Sejuk",
      "Pewarnaan Tahan Cuci & Tidak Luntur",
      "Dilengkapi Sertifikat Autentikasi Pengrajin Wukirsari"
    ],
    specifications: [
      { label: "Teknik Pembuatan", value: "Full Tulis Canting Tangan (Dua Sisi)" },
      { label: "Bahan Kain", value: "Katun Mori Primissima Super Halus" },
      { label: "Ukuran Kain", value: "245 cm x 115 cm (Standar Busana / Kemeja)" },
      { label: "Lama Pengerjaan", value: "3 - 4 Minggu per helai kain" },
      { label: "Motif", value: "Klasik Wahyu Tumurun / Sidomukti Giriloyo" },
      { label: "Asal Wilayah", value: "Kampung Batik Giriloyo, Wukirsari, Imogiri" }
    ],
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "prod-3",
    name: "Wayang Kulit Arjuna",
    category: "Seni Pertunjukan",
    umkm: "Ituk Wayang",
    price: "Rp600.000",
    priceNum: 600000,
    description: "Wayang kulit tokoh Arjuna buatan pengrajin Pucung dengan tatah sungging halus kulit kerbau pilihan.",
    fullDescription: "Mahakarya seni wayang kulit khas Dusun Pucung, Desa Wukirsari—sentra tatah sungging wayang kulit terkemuka di Indonesia. Tokoh ksatria penengah Pandawa, Raden Arjuna, dipahat dengan ketelitian ornamen tatahan yang rumit dan pewarnaan (sungging) emas prada bertingkat. Menggunakan kulit kerbau kering berkualitas tinggi yang tidak mudah melengkung, dipadukan dengan gapit (tangkai) dari tanduk kerbau asli yang kokoh dan berkilau alami. Sangat cocok sebagai hiasan dinding prestisius, hadiah kehormatan, maupun instrumen pagelaran wayang.",
    imageAlt: "Wayang kulit dari Pucung",
    imageUrl: "/wayang.jpeg",
    images: [
      "/wayang.jpeg",
      "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/3dd1c78d54698e2fa97c00ef157f5362.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.8,
    weight: "400 gram",
    highlights: [
      "Kulit Kerbau Asli Berkualitas Super Kuat",
      "Tatah Sungging Halus dengan Sentuhan Prada",
      "Gapit Tanduk Kerbau Asli Kokoh & Eksklusif",
      "Dibuat Langsung oleh Maestro Pengrajin Pucung"
    ],
    specifications: [
      { label: "Tokoh Wayang", value: "Raden Arjuna (Janaka)" },
      { label: "Material Wayang", value: "Kulit Kerbau Pilihan 100%" },
      { label: "Material Gapit", value: "Tanduk Kerbau Asli (Bukan Plastik)" },
      { label: "Tinggi Wayang", value: "Kurang lebih 65 cm (dengan tangkai)" },
      { label: "Teknik Pewarnaan", value: "Sungging Manual Cat Pigmen & Prada Emas" },
      { label: "Asal Sentra", value: "Dusun Pucung, Wukirsari, Imogiri" }
    ],
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "prod-4",
    name: "Kipas Tangan Zainal",
    category: "Kerajinan Tangan",
    umkm: "Zainal Kipas",
    price: "Rp25.000",
    priceNum: 25000,
    description: "Kipas tangan ramah lingkungan dari bambu halus berpadu kain motif batik khas Wukirsari.",
    fullDescription: "Kipas tangan lipat ramah lingkungan yang memadukan bilah bambu apus pilihan yang dihaluskan tanpa serabut dengan bentangan kain perca bermotif batik khas Wukirsari. Ringan, praktis dibawa di dalam tas, serta memberikan hembusan angin sejuk yang nyaman. Merupakan salah satu produk ekonomi kreatif ramah lingkungan yang banyak digemari sebagai cinderamata pernikahan, oleh-oleh wisatawan desa, maupun suvenir acara kenegaraan.",
    imageAlt: "Kipas bambu dengan motif batik",
    imageUrl: "/kipas.jpg",
    images: [
      "/kipas.jpg",
      "/batik-1.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.7,
    weight: "80 gram",
    highlights: [
      "Bilah Bambu Pilihan Halus & Tidak Mudah Patah",
      "Kain Perca Batik Otentik Ramah Lingkungan",
      "Bisa Dipesan Custom Nama untuk Souvenir Acara",
      "Harga Terjangkau Kualitas Pengrajin Lokal"
    ],
    specifications: [
      { label: "Bahan Rangka", value: "Bambu Apus Alami Halus" },
      { label: "Bahan Daun Kipas", value: "Kain Katun Motif Batik Wukirsari" },
      { label: "Diameter Bentang", value: "38 cm (Saat Dibuka)" },
      { label: "Panjang Rangka", value: "21 cm (Saat Dilipat)" },
      { label: "Kapasitas Pesanan", value: "Menerima Pesanan Massal (>500 pcs)" }
    ],
    createdAt: "2026-02-05T10:00:00.000Z",
  },
  {
    id: "prod-5",
    name: "Thiwul Mbak Iswati",
    category: "Kuliner",
    umkm: "Mbak Iswati",
    price: "Rp15.000 / porsi",
    priceNum: 15000,
    description: "Makanan tradisional olahan singkong manis gurih dengan taburan kelapa parut segar.",
    fullDescription: "Thiwul Mbak Iswati menyajikan cita rasa nostalgia kuliner tradisional khas Imogiri dan perbukitan Wukirsari. Diolah dari gaplek singkong fermentasi alami yang ditumbuk menjadi butiran tepung pulen, kemudian dikukus bersama gula jawa murni nira kelapa lokal. Disajikan dengan parutan kelapa muda gurih berbumbu sedikit garam laut alami. Teksturnya kenyal, manis legit, bebas gluten, dan mengenyangkan.",
    imageAlt: "Thiwul instan disajikan dengan kelapa parut",
    imageUrl: "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/1af69d4a5467c90cf617e50609d8d0cb.jpg",
    images: [
      "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/1af69d4a5467c90cf617e50609d8d0cb.jpg",
      "/sawah.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.9,
    weight: "300 gram",
    highlights: [
      "100% Olahan Singkong Alami Bebas Pengawet",
      "Pemanis Alami Gula Kelapa Jawa Murni",
      "Makanan Sehat Rendah Glikemik & Bebas Gluten",
      "Bisa Dipesan Instan Kering untuk Oleh-Oleh Jarak Jauh"
    ],
    specifications: [
      { label: "Bahan Baku", value: "Singkong Gaplek Pilihan, Gula Jawa Kelapa, Kelapa Parut" },
      { label: "Pilihan Kemasan", value: "Siap Santap (Besek Daun Pisang) / Kemasan Instan Kering" },
      { label: "Ketahanan", value: "1 Hari (Matang Segar) / 6 Bulan (Varian Instan Kering)" },
      { label: "Saran Penyajian", value: "Nikmat disantap hangat bersama teh nasgitel atau kopi lokal" }
    ],
    createdAt: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "prod-6",
    name: "Batik Sungsang",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp900.000",
    priceNum: 900000,
    description: "Batik Sungsang dengan motif abstrak dan filosofi mendalam dalam pewarnaan cerah modern.",
    fullDescription: "Koleksi eksklusif batik tulis kontemporer dari Paguyuban Batik Giriloyo yang mengangkat motif legendaris 'Batik Sungsang'. Pola geometris dan organis terbalik mencerminkan falsafah keseimbangan kosmos Jawa dan dinamika kehidupan modern. Menggunakan pewarnaan bergradasi halus dengan proses lorotan bertahap yang membutuhkan ketelatenan tinggi, menghasilkan visual estetik yang berwibawa.",
    imageAlt: "Batik Sungsang dengan motif abstrak dan warna cerah",
    imageUrl: "/sungsang.jpg",
    images: [
      "/sungsang.jpg",
      "/batik.jpg",
      "/batik-1.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.9,
    weight: "350 gram",
    highlights: [
      "Motif Unik Sungsang Filosofis & Bernilai Seni Tinggi",
      "Pewarnaan Canting Tulis Halus & Bersih",
      "Kain Lembut Jatuh Nyaman Dikenakan",
      "Karya Terbatas Eksklusif Paguyuban Giriloyo"
    ],
    specifications: [
      { label: "Kategori Produk", value: "Kain Panjang Batik Tulis Halus" },
      { label: "Material Kain", value: "Katun Primissima Santung Berkualitas" },
      { label: "Dimensi", value: "250 cm x 115 cm" },
      { label: "Perawatan", value: "Cuci dengan sabun lerak atau detergen khusus batik" }
    ],
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "prod-7",
    name: "Tatik Batik",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp950.000",
    priceNum: 950000,
    description: "Kain dan tas batik bermotif cantik tersusun rapi dengan sentuhan etnik kontemporer.",
    fullDescription: "Kreasi busana dan kain batik tulis paduan warna elegan yang diproduksi oleh pengrajin Tatik Batik di lingkungan Giriloyo. Mengusung warna-warna hangat bumi (earth tone) seperti sogan, terakota, dan indigo alami. Cocok untuk bahan kemeja pria resmi, kebaya modern wanita, maupun kain lilit serbaguna.",
    imageAlt: "Kain dan tas batik bermotif cantik tersusun rapi di rak kayu",
    imageUrl: "/batik-1.jpg",
    images: [
      "/batik-1.jpg",
      "/batik-2.png",
      "/batik.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.8,
    weight: "350 gram",
    highlights: [
      "Warna Alami Earth-Tone Modern Nan Elegan",
      "Serat Kain Rapat & Awet Bertahun-tahun",
      "Bisa Pesan Kembar untuk Seragam Keluarga / Kantor"
    ],
    specifications: [
      { label: "Material", value: "Katun Mori Primissima Super Halus" },
      { label: "Ukuran", value: "240 cm x 110 cm" },
      { label: "Pewarna", value: "Pewarna Ramah Lingkungan Tahan Luntur" }
    ],
    createdAt: "2026-02-18T10:00:00.000Z",
  },
  {
    id: "prod-8",
    name: "Kampung Batik Giriloyo",
    category: "Kerajinan Tangan",
    umkm: "Paguyuban Batik Giriloyo",
    price: "Rp1.200.000",
    priceNum: 1200000,
    description: "Karya istimewa perajin batik Giriloyo dengan motif flora khas pedesaan Yogyakarta.",
    fullDescription: "Kain batik masterpiece bertema alam pedesaan Wukirsari, menghadirkan untaian sulur daun, burung kepodang, dan ornamen parang seling kembang. Ditulis bolak-balik dengan ketelitian luar biasa oleh ibu-ibu pembatik senior yang telah menggeluti batik selama lebih dari 30 tahun. Simbol keanggunan wanita nusantara dan keagungan budaya Jogja.",
    imageAlt: "Kain batik khas Paguyuban Giriloyo",
    imageUrl: "/batik.jpg",
    images: [
      "/batik.jpg",
      "/batik-1.jpg",
      "/sungsang.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 5.0,
    weight: "380 gram",
    highlights: [
      "Karya Masterpiece Pembatik Senior Giriloyo",
      "Motif Flora & Fauna Tradisional Penuh Filosofi",
      "Dua Sisi Tembus Canting Tulis Sempurna",
      "Termasuk Box Kemasan Eksklusif dari Bambu Anyam"
    ],
    specifications: [
      { label: "Kelas Kualitas", value: "Batik Tulis Halus Koleksi Premium" },
      { label: "Kain", value: "Mori Sutra Katun Halus 60s" },
      { label: "Ukuran", value: "250 cm x 115 cm" },
      { label: "Sertifikasi", value: "Cap Paguyuban Batik Tulis Giriloyo" }
    ],
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "prod-9",
    name: "Wedang Uwuh Rempah",
    category: "Kuliner",
    umkm: "Wedang Uwuh HJ. Jazimah",
    price: "Rp20.000 / pcs",
    priceNum: 20000,
    description: "Racikan komplit rempah alami khas Imogiri, mudah diseduh dan menghangatkan badan.",
    fullDescription: "Racikan rempah seduh legendaris dari HJ. Jazimah di kawasan Wukirsari Imogiri. Menggunakan jahe merah organik kering pilihan yang memberikan sensasi pedas mantap dan meredakan letih lelah sehabis seharian beraktivitas. Sangat cocok dinikmati bersama camilan khas desa dan teman bersantai sore hari.",
    imageAlt: "Wedang uwuh kemasan siap seduh",
    imageUrl: "/uwuh.jpg",
    images: [
      "/uwuh.jpg",
      "https://horizons-cdn.hostinger.com/73e774d8-1f03-44b2-ba9c-4491a99e3f2f/831f4e5dfdf72e4880aa6b7ee71b46b8.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.9,
    weight: "200 gram",
    highlights: [
      "Jahe Merah Pilihan Pedas Menghangatkan",
      "Kemasan Rapi dan Higienis",
      "Praktis Tinggal Seduh dengan Air Mendidih"
    ],
    specifications: [
      { label: "Komposisi", value: "Jahe Merah, Secang, Kapulaga, Daun Manis Jangan, Gula Batu" },
      { label: "Izin Usaha", value: "P-IRT Terdaftar" },
      { label: "Kadaluarsa", value: "1 Tahun" }
    ],
    createdAt: "2026-02-22T10:00:00.000Z",
  },
  {
    id: "prod-10",
    name: "Shalsabila Batik",
    category: "Kerajinan Tangan",
    umkm: "Shalsabila Batik",
    price: "Rp1.150.000",
    priceNum: 1150000,
    description: "Batik sutra dan katun primissima dengan warna tahan lama dan corak anggun.",
    fullDescription: "Kain batik Shalsabila menyajikan sentuhan kontemporer untuk generasi muda yang mencintai warisan budaya nusantara. Memadukan corak klasik dengan teknik pewarnaan modern yang segar, cocok untuk acara formal perkantoran, jamuan makan malam, maupun pesta pernikahan adat.",
    imageAlt: "Kain batik Shalsabila",
    imageUrl: "/batik-2.png",
    images: [
      "/batik-2.png",
      "/batik.jpg",
      "/batik-1.jpg"
    ],
    isNew: true,
    phone: "628816413617",
    stockStatus: "Tersedia",
    rating: 4.9,
    weight: "350 gram",
    highlights: [
      "Corak Anggun Pas untuk Generasi Muda",
      "Warna Cerah Awet Tidak Memudar",
      "Bahan Adem Nyaman Seharian"
    ],
    specifications: [
      { label: "Material", value: "Katun Primissima Pilihan" },
      { label: "Ukuran", value: "240 cm x 115 cm" },
      { label: "Proses", value: "Canting Tulis Kombinasi" }
    ],
    createdAt: "2026-02-25T10:00:00.000Z",
  },
];

export const defaultEvents = [
  {
    id: "evt-1",
    title: "Festival Layang-layang",
    date: "2026-07-20",
    time: "14:00 - Selesai",
    location: "Lapangan Wukirsari",
    category: "Budaya",
    description: "Kompetisi layang-layang hias tradisional dan modern untuk semua umur diiringi kesenian desa.",
    status: "Akan Datang",
  },
  {
    id: "evt-2",
    title: "Ulang Tahun Desa Wukirsari",
    date: "2026-08-17",
    time: "09:00 - Selesai",
    location: "Balai Desa Wukirsari",
    category: "Budaya",
    description: "Perayaan hari jadi Desa Wukirsari dengan berbagai pertunjukan seni budaya, bazaar UMKM, dan kirab tumpeng.",
    status: "Akan Datang",
  },
  {
    id: "evt-3",
    title: "Merti Desa & Kirab Budaya",
    date: "2026-10-05",
    time: "13:00 - 17:00",
    location: "Lapangan Desa",
    category: "Adat",
    description: "Upacara adat wujud syukur atas hasil bumi dan kelestarian alam dimeriahkan arak-arakan budaya.",
    status: "Akan Datang",
  },
  {
    id: "evt-4",
    title: "Sedekah Alam Watu Gagak",
    date: "2026-12-22",
    time: "07:00 - 10:00",
    location: "Watu Gagak",
    category: "Wisata Alam",
    description: "Ritual tahunan dan doa bersama sebagai wujud terima kasih serta menjaga kelestarian alam semesta.",
    status: "Akan Datang",
  },
  {
    id: "evt-5",
    title: "Pentas Seni Akhir Tahun",
    date: "2026-12-31",
    time: "19:00 - Selesai",
    location: "Panggung Terbuka Embung",
    category: "Seni Pertunjukan",
    description: "Pertunjukan musik, tari tradisional, dan teater oleh para pemuda desa untuk menyambut tahun baru.",
    status: "Akan Datang",
  },
];

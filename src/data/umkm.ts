export interface UMKM {
  id: string;
  slug: string;
  nama: string;
  kategori: 'Kuliner' | 'Kerajinan' | 'Pertanian' | 'Jasa' | 'Perdagangan' | 'Fashion';
  pemilik: string;
  deskripsi: string;
  kontak: string;
  alamat: string;
  nib?: 'Ada' | 'Tidak';
  foto: string[];
  unggulan?: boolean;
}

export const umkmData: UMKM[] = [
  {
    id: '1',
    slug: 'keripik-tempe-mak-e',
    nama: 'Keripik Tempe Mak E',
    kategori: 'Kuliner',
    pemilik: 'Bu Siti Aminah',
    deskripsi: 'Keripik tempe renyah dan gurih khas Winong, dibuat dari kedelai pilihan dan bumbu rempah rahasia keluarga secara tradisional. Bebas pengawet.',
    kontak: '6281234567891',
    alamat: 'Dusun Sukamaju RT 02/RW 01, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1598442879685-6f81e355c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    unggulan: true
  },
  {
    id: '2',
    slug: 'kerajinan-bambu-lestari',
    nama: 'Kerajinan Bambu Lestari',
    kategori: 'Kerajinan',
    pemilik: 'Pak Budi Santoso',
    deskripsi: 'Berbagai macam kerajinan anyaman bambu seperti tampah, tenggok, tempat tisu, dan hiasan dinding khas pedesaan.',
    kontak: '6281234567892',
    alamat: 'Dusun Krajan RT 05/RW 02, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    unggulan: true
  },
  {
    id: '3',
    slug: 'kopi-robusta-winong',
    nama: 'Kopi Robusta Winong Asli',
    kategori: 'Pertanian',
    pemilik: 'Kelompok Tani Tunas Makmur',
    deskripsi: 'Kopi robusta asli dari perkebunan lereng Desa Winong. Diproses secara natural medium roast untuk cita rasa mantap.',
    kontak: '6281234567893',
    alamat: 'Dusun Puncak RT 01/RW 03, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    unggulan: true
  },
  {
    id: '4',
    slug: 'tenun-griya-lestari',
    nama: 'Tenun Griya Lestari',
    kategori: 'Fashion',
    pemilik: 'Ibu Sari',
    deskripsi: 'Kain tenun ikat tradisional dengan pewarna alami tumbuhan lokal Winong. Ditenun halus dengan motif warisan leluhur.',
    kontak: '6281234567894',
    alamat: 'Dusun Krajan RT 01/RW 01, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    unggulan: true
  },
  {
    id: '5',
    slug: 'olahan-singkong-berkah',
    nama: 'Keripik Singkong & Gethuk Winong',
    kategori: 'Kuliner',
    pemilik: 'Pak Darmanto',
    deskripsi: 'Olahan singkong manis dan gurih dari kebun warga lokal. Bebas pengawet, cocok untuk oleh-oleh khas Gemarang.',
    kontak: '6281234567895',
    alamat: 'Dusun Sukamaju RT 03/RW 02, Desa Winong',
    nib: 'Tidak',
    foto: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: '6',
    slug: 'madu-hutan-murni-winong',
    nama: 'Madu Hutan Murni Winong',
    kategori: 'Pertanian',
    pemilik: 'Pak Joko',
    deskripsi: 'Madu murni hasil budidaya lebah liar hutan Winong. Teruji keasliannya dan kaya khasiat stamina.',
    kontak: '6281234567896',
    alamat: 'Dusun Sukamaju RT 04/RW 03, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1587049352847-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ],
    unggulan: true
  },
  {
    id: '7',
    slug: 'bengkel-motor-jaya',
    nama: 'Bengkel Motor Jaya Winong',
    kategori: 'Jasa',
    pemilik: 'Mas Yanto',
    deskripsi: 'Melayani servis rutin, tune-up, ganti oli, dan perbaikan sepeda motor dengan teknisi berpengalaman.',
    kontak: '6281234567897',
    alamat: 'Jl. Raya Desa Winong No. 45',
    nib: 'Tidak',
    foto: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: '8',
    slug: 'toko-kelontong-serba-ada',
    nama: 'Toko Kelontong Serba Ada',
    kategori: 'Perdagangan',
    pemilik: 'Ibu Ani',
    deskripsi: 'Menyediakan kebutuhan bahan pokok sembako lengkap, jajanan anak, dan perlengkapan rumah tangga.',
    kontak: '6281234567898',
    alamat: 'Dusun Krajan RT 02/RW 01, Desa Winong',
    nib: 'Ada',
    foto: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

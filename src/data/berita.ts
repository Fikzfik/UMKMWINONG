export interface Berita {
  id: string;
  slug: string;
  judul: string;
  tanggal: string;
  penulis: string;
  ringkasan: string;
  konten: string;
  foto: string;
}

export const beritaData: Berita[] = [
  {
    id: '1',
    slug: 'pelatihan-digital-marketing-umkm-winong',
    judul: 'Pelatihan Digital Marketing untuk UMKM Desa Winong',
    tanggal: '2026-07-15',
    penulis: 'Admin Desa',
    ringkasan: 'Pemerintah Desa Winong mengadakan pelatihan digital marketing untuk membantu UMKM lokal memperluas pasar.',
    konten: '<p>Pada hari Rabu (15/07), Pemerintah Desa Winong bekerjasama dengan Dinas Koperasi dan UKM Kabupaten Madiun telah sukses menyelenggarakan acara Pelatihan Digital Marketing. Acara ini dihadiri oleh 30 pelaku UMKM di wilayah Desa Winong.</p><p>Tujuan utama dari pelatihan ini adalah untuk memberikan pembekalan kepada para pelaku usaha tentang pentingnya pemasaran digital di era modern. Peserta diajarkan cara membuat akun media sosial bisnis, mendaftar ke marketplace, serta strategi foto produk yang menarik.</p>',
    foto: '/placeholder-berita-1.jpg'
  },
  {
    id: '2',
    slug: 'panen-raya-kopi-robusta',
    judul: 'Panen Raya Kopi Robusta Kelompok Tani Tunas Makmur',
    tanggal: '2026-06-28',
    penulis: 'Admin Desa',
    ringkasan: 'Kelompok Tani Tunas Makmur merayakan panen raya kopi robusta dengan hasil panen yang meningkat tahun ini.',
    konten: '<p>Musim panen tahun ini membawa berkah tersendiri bagi para petani kopi di Desa Winong. Hasil panen kopi robusta yang dikelola oleh Kelompok Tani Tunas Makmur dilaporkan meningkat hingga 20% dibandingkan tahun lalu.</p><p>Kepala Desa Winong turut hadir dalam acara syukuran panen raya ini. Beliau berharap kedepannya kualitas kopi dari Winong bisa terus ditingkatkan dan mampu bersaing di pasar nasional.</p>',
    foto: '/placeholder-berita-2.jpg'
  },
  {
    id: '3',
    slug: 'kerja-bakti-rutin-warga',
    judul: 'Kerja Bakti Rutin Warga Sambut Musim Hujan',
    tanggal: '2026-06-10',
    penulis: 'Kaur Pembangunan',
    ringkasan: 'Warga Desa Winong bergotong royong membersihkan selokan dan fasilitas umum sebagai antisipasi datangnya musim hujan.',
    konten: '<p>Dalam rangka mengantisipasi datangnya musim penghujan, seluruh warga Desa Winong secara serentak mengadakan kerja bakti. Kegiatan ini difokuskan pada pembersihan selokan, pemangkasan dahan pohon yang membahayakan, dan perbaikan jalan desa yang berlubang.</p>',
    foto: '/placeholder-berita-3.jpg'
  }
];

"""
Module untuk mencari mahasiswa dengan nilai tertinggi dan terendah.
Memenuhi persyaratan: Fungsi untuk mencari mahasiswa dengan nilai tertinggi/terendah
"""

def cari_nilai_tertinggi_terendah(data_mahasiswa):
    """
    Mencari mahasiswa dengan nilai tertinggi dan terendah.
    
    Args:
        data_mahasiswa (list): List berisi dictionary data mahasiswa
    
    Returns:
        tuple: (mahasiswa_tertinggi, mahasiswa_terendah) atau (None, None) jika data kosong
    """
    if not data_mahasiswa:
        print("Error: Tidak ada data mahasiswa")
        return None, None
        
    try:
        tertinggi = max(data_mahasiswa, key=lambda x: x['nilai_akhir'])
        terendah = min(data_mahasiswa, key=lambda x: x['nilai_akhir'])
        
        print(f"\nNilai Tertinggi: {tertinggi['nama']} ({tertinggi['nilai_akhir']})")
        print(f"Nilai Terendah: {terendah['nama']} ({terendah['nilai_akhir']})")
        
        return tertinggi, terendah
        
    except KeyError:
        print("Error: Format data mahasiswa tidak valid")
        return None, None

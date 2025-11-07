"""
Module untuk menampilkan data mahasiswa dalam format tabel.
Memenuhi persyaratan: Fungsi untuk menampilkan data dalam format tabel
"""
from utils.print_table import print_table

def tampilkan_data(data_mahasiswa):
    """
    Menampilkan data mahasiswa dalam format tabel terstruktur.
    
    Args:
        data_mahasiswa (list): List berisi dictionary data mahasiswa
    """
    if not data_mahasiswa:
        print("\nTidak ada data mahasiswa.")
        return
        
    headers = ['nama', 'nim', 'nilai_uts', 'nilai_uas', 'nilai_tugas', 'nilai_akhir', 'grade']
    print("\nDATA NILAI MAHASISWA")
    print("=" * 80)
    print_table(data_mahasiswa, headers)
    print("=" * 80)

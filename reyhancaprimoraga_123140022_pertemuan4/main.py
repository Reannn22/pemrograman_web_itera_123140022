import json
import os
from modules.tambah_mahasiswa import tambah_mahasiswa
from modules.nilai_akhir_dan_grade import hitung_semua_nilai_dan_grade
from modules.tampilkan_data import tampilkan_data
from modules.cari_tertinggi_terendah import cari_nilai_tertinggi_terendah
from modules.filter_berdasarkan_grade import filter_grade
from modules.rata_rata_kelas import hitung_rata_rata

def load_data():
    """Load data from JSON file"""
    try:
        with open('data/mahasiswa.json', 'r') as f:
            return json.load(f)['mahasiswa']
    except FileNotFoundError:
        return []

def save_data(data):
    """Save data to JSON file"""
    with open('data/mahasiswa.json', 'w') as f:
        json.dump({'mahasiswa': data}, f, indent=4)

def main():
    data_mahasiswa = load_data()
    data_mahasiswa = hitung_semua_nilai_dan_grade(data_mahasiswa)
    
    while True:
        print("\nProgram Pengelolaan Data Nilai Mahasiswa")
        print("1. Tampilkan Data")
        print("2. Tambah Data Mahasiswa")
        print("3. Cari Nilai Tertinggi/Terendah")
        print("4. Filter Berdasarkan Grade")
        print("5. Hitung Rata-rata Kelas")
        print("6. Keluar")
        
        pilihan = input("\nPilih menu (1-6): ")
        
        if pilihan == '1':
            tampilkan_data(data_mahasiswa)
            
        elif pilihan == '2':
            mhs_baru = tambah_mahasiswa()
            if mhs_baru:
                data_mahasiswa.append(mhs_baru)
                data_mahasiswa = hitung_semua_nilai_dan_grade(data_mahasiswa)
                save_data(data_mahasiswa)
                print("Data berhasil ditambahkan")
                
        elif pilihan == '3':
            tertinggi, terendah = cari_nilai_tertinggi_terendah(data_mahasiswa)
            print("\nMahasiswa dengan nilai tertinggi:")
            tampilkan_data([tertinggi])
            print("\nMahasiswa dengan nilai terendah:")
            tampilkan_data([terendah])
            
        elif pilihan == '4':
            grade = input("Masukkan grade (A/B/C/D/E): ")
            filtered = filter_grade(data_mahasiswa, grade)
            tampilkan_data(filtered)
            
        elif pilihan == '5':
            rata_rata = hitung_rata_rata(data_mahasiswa)
            print(f"\nRata-rata nilai kelas: {rata_rata}")
            
        elif pilihan == '6':
            print("Terima kasih!")
            break
            
        else:
            print("Pilihan tidak valid")

if __name__ == '__main__':
    main()

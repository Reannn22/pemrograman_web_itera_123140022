def hitung_rata_rata(data_mahasiswa):
    """Menghitung rata-rata nilai kelas"""
    if not data_mahasiswa:
        return 0
        
    total = sum(mhs['nilai_akhir'] for mhs in data_mahasiswa)
    return round(total / len(data_mahasiswa), 2)

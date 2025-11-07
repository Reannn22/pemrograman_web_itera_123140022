from .hitung_nilai_akhir import hitung_nilai_akhir
from .tentukan_grade import tentukan_grade

def hitung_semua_nilai_dan_grade(data_mahasiswa):
    """Menghitung nilai akhir dan grade untuk semua mahasiswa"""
    for mhs in data_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(
            mhs['nilai_uts'],
            mhs['nilai_uas'],
            mhs['nilai_tugas']
        )
        mhs['nilai_akhir'] = round(nilai_akhir, 2)
        mhs['grade'] = tentukan_grade(nilai_akhir)
    return data_mahasiswa

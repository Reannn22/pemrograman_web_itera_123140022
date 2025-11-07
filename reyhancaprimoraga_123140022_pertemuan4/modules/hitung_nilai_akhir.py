"""
Module untuk menghitung nilai akhir mahasiswa.
Memenuhi persyaratan: Fungsi untuk menghitung nilai akhir (30% UTS + 40% UAS + 30% Tugas)
"""

def hitung_nilai_akhir(nilai_uts, nilai_uas, nilai_tugas):
    """
    Menghitung nilai akhir berdasarkan bobot: UTS 30%, UAS 40%, Tugas 30%
    
    Args:
        nilai_uts (float): Nilai UTS (0-100)
        nilai_uas (float): Nilai UAS (0-100)
        nilai_tugas (float): Nilai Tugas (0-100)
    
    Returns:
        float: Nilai akhir atau None jika input tidak valid
    """
    try:
        for nilai in [nilai_uts, nilai_uas, nilai_tugas]:
            if not 0 <= float(nilai) <= 100:
                raise ValueError("Nilai harus antara 0-100")
                
        nilai_akhir = (0.3 * float(nilai_uts) + 
                      0.4 * float(nilai_uas) + 
                      0.3 * float(nilai_tugas))
        return round(nilai_akhir, 2)
        
    except ValueError as e:
        print(f"Error: {str(e)}")
        return None

"""Module untuk menambah data mahasiswa baru."""

def validasi_nilai(nilai, nama_nilai):
    """Validasi input nilai"""
    try:
        nilai = float(nilai)
        if 0 <= nilai <= 100:
            return True, nilai
        else:
            print(f"Error: {nama_nilai} harus antara 0-100")
            return False, None
    except ValueError:
        print(f"Error: {nama_nilai} harus berupa angka")
        return False, None

def tambah_mahasiswa():
    """
    Input data mahasiswa baru dengan validasi.
    
    Returns:
        dict: Data mahasiswa baru atau None jika input tidak valid
    """
    print("\nInput Data Mahasiswa Baru")
    print("-" * 30)
    
    nama = input("Nama: ").strip()
    if not nama:
        print("Error: Nama tidak boleh kosong")
        return None
        
    nim = input("NIM: ").strip()
    if not nim.isdigit():
        print("Error: NIM harus berupa angka")
        return None
        
    # Validasi nilai
    nilai_inputs = {
        'nilai_uts': 'Nilai UTS',
        'nilai_uas': 'Nilai UAS',
        'nilai_tugas': 'Nilai Tugas'
    }
    
    nilai_dict = {}
    for key, label in nilai_inputs.items():
        valid, nilai = validasi_nilai(input(f"{label}: "), label)
        if not valid:
            return None
        nilai_dict[key] = nilai
    
    return {
        'nama': nama,
        'nim': nim,
        **nilai_dict
    }

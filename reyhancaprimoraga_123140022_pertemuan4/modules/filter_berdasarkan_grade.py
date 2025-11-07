"""
Module untuk memfilter mahasiswa berdasarkan grade.
Memenuhi persyaratan: Filter mahasiswa berdasarkan grade
"""

def filter_grade(data_mahasiswa, grade):
    """
    Filter mahasiswa berdasarkan grade tertentu.
    
    Args:
        data_mahasiswa (list): List berisi dictionary data mahasiswa
        grade (str): Grade yang ingin difilter (A/B/C/D/E)
    
    Returns:
        list: List mahasiswa dengan grade yang sesuai
    """
    grade = grade.upper()
    if grade not in ['A', 'B', 'C', 'D', 'E']:
        print("Error: Grade tidak valid (A/B/C/D/E)")
        return []
        
    filtered = [mhs for mhs in data_mahasiswa if mhs.get('grade') == grade]
    
    if not filtered:
        print(f"Tidak ada mahasiswa dengan grade {grade}")
    
    return filtered

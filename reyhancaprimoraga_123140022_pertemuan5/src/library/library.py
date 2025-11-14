"""
Module: library.py
Class Library untuk mengelola koleksi item perpustakaan.
Menerapkan: Encapsulation (private attributes).
"""


class Library:
    """
    Class untuk mengelola koleksi item perpustakaan.
    
    Attributes:
        __items (list): List private yang menyimpan semua item
    """
    
    def __init__(self):
        """Inisialisasi library dengan koleksi kosong."""
        self.__items = []  # private attribute - tidak dapat diakses langsung
    
    def add_item(self, item):
        """
        Menambahkan item baru ke perpustakaan.
        
        Args:
            item (LibraryItem): Object item (Book atau Magazine)
        """
        self.__items.append(item)
    
    def list_items(self):
        """
        Menampilkan semua item yang tersedia di perpustakaan.
        Menggunakan polymorphism: memanggil display_info() setiap item.
        """
        if not self.__items:
            print("\nPerpustakaan kosong. Tidak ada item tersedia.\n")
            return
        
        print(f"\n=== DAFTAR SEMUA ITEM ({len(self.__items)} item) ===\n")
        for idx, item in enumerate(self.__items, 1):
            print(f"{idx}. ", end="")
            item.display_info()
        print()
    
    def search_by_title(self, keyword):
        """
        Mencari item berdasarkan kata kunci judul (case-insensitive).
        
        Args:
            keyword (str): Kata kunci pencarian
            
        Returns:
            list: List of items yang sesuai dengan keyword
        """
        return [
            item for item in self.__items 
            if keyword.lower() in item.title.lower()
        ]
    
    def search_by_id(self, item_id):
        """
        Mencari item berdasarkan ID unik.
        
        Args:
            item_id (int): ID item yang dicari
            
        Returns:
            LibraryItem or None: Object item jika ditemukan, None jika tidak
        """
        for item in self.__items:
            if item._id == item_id:
                return item
        return None
    
    def get_total_items(self):
        """
        Mendapatkan jumlah total item di perpustakaan.
        
        Returns:
            int: Jumlah item
        """
        return len(self.__items)

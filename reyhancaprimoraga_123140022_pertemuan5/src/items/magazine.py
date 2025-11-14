"""
Module: magazine.py
Representasi Majalah sebagai subclass dari LibraryItem.
Menerapkan: Inheritance, Polymorphism.
"""

from .library_item import LibraryItem


class Magazine(LibraryItem):
    """
    Class untuk merepresentasikan Majalah di perpustakaan.
    
    Attributes:
        _issue (str): Nomor edisi majalah (protected)
        _month (str): Bulan terbit majalah (protected)
    """
    
    def __init__(self, item_id, title, issue, month):
        """
        Inisialisasi object Magazine.
        
        Args:
            item_id (int): ID unik majalah
            title (str): Judul majalah
            issue (str): Nomor edisi
            month (str): Bulan terbit
        """
        super().__init__(item_id, title)
        self._issue = issue
        self._month = month
    
    @property
    def issue(self):
        """Property untuk membaca nomor edisi (read-only)."""
        return self._issue
    
    @property
    def month(self):
        """Property untuk membaca bulan terbit (read-only)."""
        return self._month
    
    def display_info(self):
        """
        Implementasi polymorphism: menampilkan informasi majalah.
        Override dari method abstract LibraryItem.display_info().
        """
        print(f"[MAGAZINE] ID: {self._id}, Judul: {self._title}, Issue: {self._issue}, Bulan: {self._month}")
    
    def get_item_type(self):
        """Override method abstract: mengembalikan tipe item."""
        return "Magazine"
    
    def __str__(self):
        """String representation dari Magazine."""
        return f"Magazine: {self._title} (Issue {self._issue}, {self._month})"

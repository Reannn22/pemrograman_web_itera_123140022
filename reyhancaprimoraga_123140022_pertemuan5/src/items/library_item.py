"""
Module: library_item.py
Abstract Base Class untuk semua item perpustakaan.
Menerapkan: Abstract Class, Protected Attributes, Property Decorator.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract base class untuk semua item perpustakaan.
    
    Attributes:
        _id (int): ID unik item (protected)
        _title (str): Judul item (protected)
    """
    
    def __init__(self, item_id, title):
        """
        Inisialisasi item perpustakaan.
        
        Args:
            item_id (int): ID unik untuk item
            title (str): Judul item
        """
        self._id = item_id
        self._title = title
    
    @property
    def title(self):
        """Property untuk membaca judul item (read-only)."""
        return self._title
    
    @property
    def item_id(self):
        """Property untuk membaca ID item (read-only)."""
        return self._id
    
    @abstractmethod
    def display_info(self):
        """
        Method abstrak - harus diimplementasikan oleh setiap subclass.
        Menampilkan informasi detail item perpustakaan.
        """
        pass
    
    @abstractmethod
    def get_item_type(self):
        """
        Method abstrak untuk mendapatkan tipe item.
        
        Returns:
            str: Tipe item (misal: "Book", "Magazine")
        """
        pass

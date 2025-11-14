"""
Module: book.py
Representasi Buku sebagai subclass dari LibraryItem.
Menerapkan: Inheritance, Polymorphism, Property Decorator.
"""

from .library_item import LibraryItem


class Book(LibraryItem):
    """
    Class untuk merepresentasikan Buku di perpustakaan.
    
    Attributes:
        _author (str): Nama penulis buku (protected)
        _pages (int): Jumlah halaman (protected)
    """
    
    def __init__(self, item_id, title, author, pages):
        """
        Inisialisasi object Book.
        
        Args:
            item_id (int): ID unik buku
            title (str): Judul buku
            author (str): Nama penulis
            pages (int): Jumlah halaman
        """
        super().__init__(item_id, title)
        self._author = author
        self._pages = pages
    
    @property
    def author(self):
        """Property untuk membaca nama penulis (read-only)."""
        return self._author
    
    @property
    def pages(self):
        """Property untuk membaca jumlah halaman (read-only)."""
        return self._pages
    
    def display_info(self):
        """
        Implementasi polymorphism: menampilkan informasi buku.
        Override dari method abstract LibraryItem.display_info().
        """
        print(f"[BOOK] ID: {self._id}, Judul: {self._title}, Author: {self._author}, Pages: {self._pages}")
    
    def get_item_type(self):
        """Override method abstract: mengembalikan tipe item."""
        return "Book"
    
    def __str__(self):
        """String representation dari Book."""
        return f"Book: {self._title} by {self._author} ({self._pages} pages)"

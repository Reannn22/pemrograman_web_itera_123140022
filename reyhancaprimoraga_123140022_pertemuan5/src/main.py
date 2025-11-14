"""
Module: main.py
Program utama Sistem Manajemen Perpustakaan Sederhana.
Menerapkan: Abstract Class, Inheritance, Encapsulation, Polymorphism.
"""

import sys
import os

# Menambahkan path untuk import
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from items import Book, Magazine
from library import Library
from utils.helpers import display_menu, input_with_type


def main():
    """
    Fungsi utama program.
    Menjalankan CLI menu untuk Sistem Manajemen Perpustakaan.
    """
    lib = Library()
    
    # Data contoh inisial
    lib.add_item(Book(1, "Clean Code", "Robert Martin", 350))
    lib.add_item(Book(2, "Python Basics", "Guido van Rossum", 280))
    lib.add_item(Magazine(101, "National Geographic", "202", "March"))
    lib.add_item(Magazine(102, "Science Weekly", "202402", "February"))
    
    print("\n✨ Selamat datang di Sistem Manajemen Perpustakaan! ✨")
    print("📚 Program berhasil dimulai dengan 4 item contoh.\n")
    
    while True:
        display_menu()
        pilih = input("\nMasukkan pilihan (0-4): ").strip()
        
        if pilih == "1":
            print("\n" + "="*50)
            print("TAMBAH ITEM BARU")
            print("="*50)
            
            jenis = input("Jenis item (book/magazine)? ").strip().lower()
            
            if jenis not in ["book", "magazine"]:
                print("❌ Jenis item tidak valid.\n")
                continue
            
            try:
                item_id = input_with_type("ID item: ", int)
                title = input("Judul: ").strip()
                
                if not title:
                    print("❌ Judul tidak boleh kosong.\n")
                    continue
                
                if jenis == "book":
                    author = input("Penulis: ").strip()
                    pages = input_with_type("Jumlah halaman: ", int)
                    new_item = Book(item_id, title, author, pages)
                
                else:  # magazine
                    issue = input("Nomor edisi: ").strip()
                    month = input("Bulan: ").strip()
                    new_item = Magazine(item_id, title, issue, month)
                
                lib.add_item(new_item)
                print(f"\n✅ Item berhasil ditambahkan!\n")
                
            except ValueError:
                print("❌ Input tidak valid.\n")
        
        elif pilih == "2":
            lib.list_items()
        
        elif pilih == "3":
            print("\n" + "="*50)
            print("CARI BERDASARKAN JUDUL")
            print("="*50)
            
            keyword = input("Masukkan kata kunci judul: ").strip()
            
            if not keyword:
                print("❌ Kata kunci tidak boleh kosong.\n")
                continue
            
            results = lib.search_by_title(keyword)
            
            if results:
                print(f"\n✅ Ditemukan {len(results)} item:\n")
                for idx, item in enumerate(results, 1):
                    print(f"{idx}. ", end="")
                    item.display_info()
                print()
            else:
                print(f"\n❌ Tidak ada item dengan judul '{keyword}'.\n")
        
        elif pilih == "4":
            print("\n" + "="*50)
            print("CARI BERDASARKAN ID")
            print("="*50)
            
            try:
                item_id = input_with_type("Masukkan ID item: ", int)
                result = lib.search_by_id(item_id)
                
                if result:
                    print(f"\n✅ Item ditemukan:\n")
                    result.display_info()
                    print()
                else:
                    print(f"\n❌ Item dengan ID {item_id} tidak ditemukan.\n")
            
            except ValueError:
                print("❌ ID harus berupa angka.\n")
        
        elif pilih == "0":
            print("\n" + "="*50)
            print("Terima kasih telah menggunakan sistem kami!")
            print("="*50 + "\n")
            break
        
        else:
            print("\n❌ Pilihan tidak valid. Silakan pilih 0-4.\n")


if __name__ == "__main__":
    main()

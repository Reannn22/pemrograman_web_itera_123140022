"""
Module: helpers.py
Fungsi-fungsi helper untuk mendukung program utama.
"""

import os


def clear_screen():
    """Membersihkan layar console."""
    os.system('cls' if os.name == 'nt' else 'clear')


def display_menu():
    """Menampilkan menu utama program."""
    print("\n" + "="*50)
    print("        SISTEM MANAJEMEN PERPUSTAKAAN")
    print("="*50)
    print("1. Tambah Item (Book/Magazine)")
    print("2. Tampilkan Semua Item")
    print("3. Cari Berdasarkan Judul")
    print("4. Cari Berdasarkan ID")
    print("0. Keluar")
    print("="*50)


def input_with_type(prompt, input_type=str):
    """
    Input dengan validasi tipe data.
    
    Args:
        prompt (str): Teks pertanyaan
        input_type (type): Tipe data yang diharapkan
        
    Returns:
        input_type: Nilai input yang sudah dikonversi
    """
    while True:
        try:
            user_input = input(prompt)
            return input_type(user_input)
        except ValueError:
            print(f"❌ Input tidak valid. Harap masukkan {input_type.__name__}.")

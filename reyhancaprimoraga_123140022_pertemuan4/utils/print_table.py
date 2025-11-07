def print_table(data, headers):
    """Print data in tabular format"""
    if not data:
        print("Tidak ada data untuk ditampilkan")
        return
        
    # Calculate column widths
    widths = {header: len(header) for header in headers}
    for row in data:
        for header in headers:
            widths[header] = max(widths[header], len(str(row.get(header, ''))))
    
    # Print headers
    header_line = " | ".join(f"{header:<{widths[header]}}" for header in headers)
    print(header_line)
    print("-" * len(header_line))
    
    # Print rows
    for row in data:
        row_str = " | ".join(f"{str(row.get(header, '')):<{widths[header]}}" for header in headers)
        print(row_str)

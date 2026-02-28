import sqlite3

db_file = 'mm5.db'
tables_to_keep = [
    'Albums', 'Artists', 'ArtistsAlbums', 'ArtistsSongs', 
    'Genres', 'GenresSongs', 'PlaylistSongs', 'Playlists', 'Songs'
]

# This function tells SQLite: "If you see IUNICODE, just treat it like normal text"
def ignore_collation(string1, string2):
    if string1 == string2:
        return 0
    return 1 if string1 > string2 else -1

try:
    conn = sqlite3.connect(db_file)
    
    # 1. Register the missing collation so SQLite doesn't crash
    conn.create_collation("IUNICODE", ignore_collation)
    
    # 2. Allow manual schema changes for stubborn virtual tables
    conn.execute("PRAGMA writable_schema = ON;") 
    cursor = conn.cursor()

    # Get current tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    all_tables = [row[0] for row in cursor.fetchall()]

    tables_to_drop = [
        t for t in all_tables 
        if t not in tables_to_keep and not t.startswith('sqlite_')
    ]

    for table in tables_to_drop:
        try:
            # Try the standard drop first
            cursor.execute(f"DROP TABLE IF EXISTS {table};")
            print(f"Dropped: {table}")
        except sqlite3.Error:
            # If it's a virtual table or tokenizer issue, delete from master
            print(f"Removing {table} from master schema...")
            cursor.execute(f"DELETE FROM sqlite_master WHERE name = '{table}';")

    # 3. Clean up any leftover Indexes or Triggers tied to deleted tables
    cursor.execute(f"DELETE FROM sqlite_master WHERE type IN ('index', 'trigger', 'view') AND tbl_name NOT IN ({','.join(['?']*len(tables_to_keep))})", tables_to_keep)

    conn.execute("PRAGMA writable_schema = OFF;")
    conn.commit()
    
    # 4. Reclaim the space (this should work now that IUNICODE is defined)
    print("Shrinking file size (VACUUM)...")
    cursor.execute("VACUUM;")
    print("Success! Your mm5.db is now fully cleaned and optimized.")

except sqlite3.Error as e:
    print(f"A major error occurred: {e}")
finally:
    if conn:
        conn.close()

import sqlite3, shutil, os
from mutagen.id3 import ID3, ID3NoHeaderError
import internetarchive as ia

DB_PATH = r"C:\xampp\htdocs\yathish1618.github.io\music-catalogue2\MM5.DB"
TEMP_DIR = r"C:\temp\upload_staging"
IA_IDENTIFIER = "mk9x2wr5qt"  # what you chose on archive.org

os.makedirs(TEMP_DIR, exist_ok=True)

# Fetch already uploaded filenames from archive.org
print("Checking archive.org for already uploaded files...")
try:
    item = ia.get_item(IA_IDENTIFIER)
    uploaded = set(f['name'] for f in item.files)
    print(f"Already uploaded: {len(uploaded)} files")
except Exception as e:
    uploaded = set()
    print(f"Could not fetch item (probably first run): {e}")

conn = sqlite3.connect(DB_PATH)
cursor = conn.execute("SELECT ID, SongPath FROM Songs ORDER BY DateAdded DESC LIMIT 100")
rows = cursor.fetchall()
conn.close()

for song_id, song_path in rows:
    filename = f"{song_id}.mp3"

    if filename in uploaded:
        print(f"Skipping {filename} - already on archive.org")
        continue

    song_path = "D" + song_path

    if not os.path.exists(song_path):
        print(f"Missing file, skipping: {song_path}")
        continue

    dest = os.path.join(TEMP_DIR, filename)
    shutil.copy2(song_path, dest)

    try:
        audio = ID3(dest)
        audio.delete()
        audio.save(dest)
    except ID3NoHeaderError:
        pass

    print(f"Uploading {filename} - {song_path} ...")

    r = ia.upload(
        IA_IDENTIFIER,
        files=[dest],
        metadata=dict(
            title=IA_IDENTIFIER,
            mediatype='data'
        )
    )

    os.remove(dest)
    print(f"Done: {filename}")

print("Finished.")

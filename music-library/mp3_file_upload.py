import sqlite3, shutil, os
from mutagen.id3 import ID3, ID3NoHeaderError
import internetarchive as ia
import time

DB_PATH = r"C:\xampp\htdocs\yathish1618.github.io\music-library\MM5.DB"
TEMP_DIR = r"C:\temp\upload_staging"
IA_IDENTIFIER = "mk9x2wr5qt"
MAX_RETRIES = 5
RETRY_DELAY = 10 

os.makedirs(TEMP_DIR, exist_ok=True)

# 1. Fetch already uploaded files
print("Checking archive.org for already uploaded files...")
try:
    item = ia.get_item(IA_IDENTIFIER)
    uploaded = set(f['name'] for f in item.files)
except Exception as e:
    uploaded = set()
    print(f"Could not fetch item (probably first run): {e}")

# 2. Get all songs from DB
conn = sqlite3.connect(DB_PATH)
cursor = conn.execute("SELECT ID, SongPath FROM Songs ORDER BY DateAdded DESC")
all_rows = cursor.fetchall()
conn.close()

# 3. Filter pending files BEFORE the loop
# We create a list of only the files that aren't in the 'uploaded' set yet
pending_uploads = [
    (song_id, song_path) for song_id, song_path in all_rows 
    if f"{song_id}.mp3" not in uploaded
]

# 4. Summary Display
total_db = len(all_rows)
already_done = len(uploaded)
to_process = len(pending_uploads)

print("-" * 30)
print(f"Total songs in DB:    {total_db}")
print(f"Already on Archive:   {already_done}")
print(f"Pending uploads:      {to_process}")
print("-" * 30)

if to_process == 0:
    print("Everything is up to date. Exiting.")
    exit()

# 5. Only loop through pending items
for song_id, song_path in pending_uploads:
    filename = f"{song_id}.mp3"
    
    # Path correction logic
    song_path = "D" + song_path if not song_path.startswith("D:") else song_path

    if not os.path.exists(song_path):
        print(f"⚠️ Missing local file: {song_path}")
        continue

    dest = os.path.join(TEMP_DIR, filename)
    shutil.copy2(song_path, dest)

    # Strip ID3 Tags
    try:
        audio = ID3(dest)
        audio.delete()
        audio.save(dest)
    except ID3NoHeaderError:
        pass

    # Upload with retry logic
    success = False
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"🚀 [{to_process} left] Uploading {filename} (attempt {attempt})...")
            ia.upload(
                IA_IDENTIFIER,
                files=[dest],
                metadata=dict(title=IA_IDENTIFIER, mediatype='data')
            )
            success = True
            to_process -= 1 # Decrement our local counter
            break
        except Exception as e:
            print(f"  ❌ Error on attempt {attempt}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            else:
                print(f"  🛑 Failed after {MAX_RETRIES} attempts, skipping {filename}")

    if os.path.exists(dest):
        os.remove(dest)

print("Finished.")

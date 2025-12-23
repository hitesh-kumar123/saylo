import os
import zipfile
import urllib.request
import shutil

FFMPEG_URL = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
TARGET_DIR = os.path.join(os.getcwd(), "ffmpeg")
ZIP_PATH = os.path.join(TARGET_DIR, "ffmpeg.zip")

def install_ffmpeg():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)

    print(f"Downloading FFmpeg from {FFMPEG_URL}...")
    try:
        urllib.request.urlretrieve(FFMPEG_URL, ZIP_PATH)
        print("Download complete.")
    except Exception as e:
        print(f"Failed to download: {e}")
        return

    print("Extracting...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        # Extract all to a temp dir
        zip_ref.extractall(TARGET_DIR)
    
    # Move ffmpeg.exe to the root of TARGET_DIR
    # The zip usually contains a subfolder like 'ffmpeg-6.0-essentials_build/bin/ffmpeg.exe'
    found = False
    for root, dirs, files in os.walk(TARGET_DIR):
        if "ffmpeg.exe" in files:
            source = os.path.join(root, "ffmpeg.exe")
            destination = os.path.join(TARGET_DIR, "ffmpeg.exe")
            shutil.move(source, destination)
            found = True
            print(f"ffmpeg.exe placed in {destination}")
            break
            
    if not found:
        print("Could not find ffmpeg.exe in the downloaded archive.")
    
    # Cleanup
    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
    
    # Remove subfolders
    for item in os.listdir(TARGET_DIR):
        item_path = os.path.join(TARGET_DIR, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)

    print("FFmpeg installation successful.")

if __name__ == "__main__":
    install_ffmpeg()

import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("AIzaSyBgA8T-MD7EY0igvnuv71nzmC4d6ifBqa4")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-pro")
GEMINI_API_URL = os.getenv("GEMINI_API_URL", "https://api.gemini.com/v1/")
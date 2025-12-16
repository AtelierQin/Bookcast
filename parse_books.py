
import re
import json
import random
import urllib.parse
import os

# Define the input file path
input_file_path = '/Users/hq/Documents/Bookcast/GB top 100.md'

if not os.path.exists(input_file_path):
    print(f"Error: File not found at {input_file_path}")
    exit(1)

with open(input_file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

books = []

categories = ['Business', 'Psychology', 'Science', 'Fiction', 'Biography', 'History', 'Philosophy', 'Self-Help']

for line in lines:
    line = line.strip()
    # Skip empty lines or lines that don't look like table rows
    if not line.startswith('|') or not line.endswith('|'):
        continue
    
    # Skip header and separator lines
    if '排名' in line or '---' in line:
        continue
        
    parts = [p.strip() for p in line.split('|')]
    
    # parts[0] is empty string (before first |)
    # parts[1] is Rank
    # parts[2] is Title
    # parts[3] is Chinese Title
    # parts[4] is Author
    # parts[5] is Country
    # parts[6] is empty string (after last |)
    
    if len(parts) < 6:
        continue
        
    try:
        rank_str = parts[1]
        if not rank_str.isdigit():
            continue
            
        rank = int(rank_str)
        title_raw = parts[2]
        # Remove ** bold markers
        title_en = title_raw.replace('**', '').strip()
        # Remove quotes if present
        title_en = title_en.strip('"')
        
        title_zh = parts[3]
        author = parts[4]
        country = parts[5]
        
        # Simple logic to assign categories based on keywords (mock)
        category = random.choice(categories)
        lower_title = title_en.lower()
        if 'history' in lower_title or 'sapiens' in lower_title or 'guns' in lower_title:
            category = 'History'
        elif 'startup' in lower_title or 'business' in lower_title or 'management' in lower_title or 'zero to one' in lower_title:
            category = 'Business'
        elif 'psychology' in lower_title or 'thinking' in lower_title or 'mind' in lower_title:
            category = 'Psychology'
        elif 'fiction' in lower_title or 'harry potter' in lower_title or 'rings' in lower_title or 'dune' in lower_title or '1984' in lower_title:
            category = 'Fiction'
        elif 'biography' in lower_title or 'steve jobs' in lower_title or 'elon musk' in lower_title or 'einstein' in lower_title:
            category = 'Biography'
        elif 'habit' in lower_title or 'meaning' in lower_title or 'influence' in lower_title:
            category = 'Self-Help'
            
        # Mock year
        year = random.randint(1980, 2021)
        
        # Create cover URL
        cover_text = title_en
        if len(cover_text) > 20:
            cover_text = cover_text[:20] + '...'
        cover_url = f"https://placehold.co/300x450/2563eb/white?text={urllib.parse.quote(cover_text)}"

        books.append({
            "rank": rank,
            "title": title_en,
            "title_zh": title_zh,
            "author": author,
            "country": country,
            "year": year,
            "category": category,
            "description": f"《{title_zh}》 ({title_en}) is a highly recommended book by {author}.",
            "cover": cover_url
        })
    except Exception as e:
        # Silently skip malformed lines but print warning to stderr
        import sys
        print(f"Warning: Failed to parse line: {line}. Error: {e}", file=sys.stderr)
        continue

# Sort by rank just in case
books.sort(key=lambda x: x['rank'])

print("export const books = " + json.dumps(books, indent=2, ensure_ascii=False) + ";")

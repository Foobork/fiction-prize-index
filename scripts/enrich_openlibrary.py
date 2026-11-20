#!/usr/bin/env python3
"""
Enrichment script for Fiction Prize Index.
Queries Open Library's public search API to verify/retrieve ISBNs, Open Library IDs,
and page counts for books in data/books.json.
"""

import json
import urllib.parse
import urllib.request
import time
import sys

BOOKS_PATH = "data/books.json"

def fetch_openlibrary_metadata(title: str, author: str):
    query = f"{title} {author}"
    url = f"https://openlibrary.org/search.json?q={urllib.parse.quote(query)}&limit=1"
    
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "FictionPrizeIndex/1.0 (https://github.com)"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            docs = data.get("docs", [])
            if not docs:
                return None
            doc = docs[0]
            return {
                "key": doc.get("key"),
                "isbn": doc.get("isbn", [None])[0],
                "number_of_pages_median": doc.get("number_of_pages_median"),
                "cover_i": doc.get("cover_i")
            }
    except Exception as e:
        print(f"Error fetching metadata for '{title}': {e}", file=sys.stderr)
        return None

def main():
    with open(BOOKS_PATH, "r", encoding="utf-8") as f:
        books = json.load(f)

    print(f"Loaded {len(books)} books. Checking Open Library metadata...")
    enriched_count = 0

    for book in books:
        if not book.get("openLibraryKey") or not book.get("pageCount"):
            print(f"Checking '{book['title']}' by {book['authorName']}...")
            meta = fetch_openlibrary_metadata(book["title"], book["authorName"])
            if meta:
                if not book.get("openLibraryKey") and meta.get("key"):
                    book["openLibraryKey"] = meta["key"]
                if not book.get("pageCount") and meta.get("number_of_pages_median"):
                    book["pageCount"] = meta["number_of_pages_median"]
                if not book.get("isbn13") and meta.get("isbn"):
                    book["isbn13"] = meta["isbn"]
                enriched_count += 1
            time.sleep(1) # Courtesy rate limit

    with open(BOOKS_PATH, "w", encoding="utf-8") as f:
        json.dump(books, f, indent=2, ensure_ascii=False)

    print(f"Enrichment complete. Updated {enriched_count} books.")

if __name__ == "__main__":
    main()

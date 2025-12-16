# Bookcast Top 100

A responsive web application displaying the Top 100 books from Goodbooks.io, featuring filtering, searching, and a modern card-based UI.

## Features

- **Book Display**: Shows rank, title (English/Chinese), author, country, year, and category.
- **Search**: Real-time search by book title (EN/ZH) or author.
- **Filtering**: Filter by Category, Author, and Publication Year (Decade).
- **Responsive Design**: Optimized for mobile, tablet, and desktop using Tailwind CSS.
- **Mock Data**: Includes simulated data for Year and Category for demonstration purposes.

## How to Run

Since this project uses ES6 Modules (`import`/`export`), you need to serve the files via a local HTTP server to avoid CORS errors.

### Method 1: Using Python (Recommended)
If you have Python installed:

1. Open your terminal/command prompt.
2. Navigate to the project folder.
3. Run:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and go to `http://localhost:8000`.

### Method 2: VS Code Live Server
If you use VS Code, simply right-click `index.html` and select "Open with Live Server".

## File Structure

- `index.html`: Main entry point and UI structure.
- `script.js`: Application logic (rendering, filtering).
- `books.js`: Data file containing the book list (generated from markdown).
- `parse_books.py`: Utility script used to generate `books.js`.

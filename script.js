// DOM Elements
const bookGrid = document.getElementById('bookGrid');
const bookList = document.getElementById('bookList');
const bookListBody = document.getElementById('bookListBody');
const searchInput = document.getElementById('searchInput');
const authorFilter = document.getElementById('authorFilter');
const yearFilter = document.getElementById('yearFilter');
const resultCount = document.getElementById('resultCount');
const noResults = document.getElementById('noResults');
const resetFiltersBtn = document.getElementById('resetFilters');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// Helper function to fix truncated cover URLs
function getValidCoverUrl(book) {
    if (!book.cover) {
        return `https://placehold.co/300x450/cccccc/666666?text=No+Cover`;
    }
    
    // If URL is truncated (contains ...), generate a new one based on rank
    if (book.cover.includes('...')) {
        return `https://placehold.co/300x450/2563eb/white?text=Book+${book.rank}`;
    }
    
    return book.cover;
}

// State
let currentBooks = [...books];
let currentView = 'grid'; // 'grid' or 'list'

// Initialize
function init() {
    populateFilters();
    renderBooks(currentBooks);
    setupEventListeners();
}

// Populate Filter Dropdowns
function populateFilters() {
    // Authors
    const authors = [...new Set(books.map(book => book.author))].sort();
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorFilter.appendChild(option);
    });
}

// Render Books
function renderBooks(booksToRender) {
    if (booksToRender.length === 0) {
        noResults.classList.remove('hidden');
        resultCount.textContent = '找到 0 本书';
        bookGrid.classList.add('hidden');
        bookList.classList.add('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    resultCount.textContent = `共找到 ${booksToRender.length} 本书`;

    if (currentView === 'grid') {
        renderGridView(booksToRender);
    } else {
        renderListView(booksToRender);
    }
}

// Render Grid View
function renderGridView(booksToRender) {
    bookGrid.classList.remove('hidden');
    bookList.classList.add('hidden');
    bookGrid.innerHTML = '';

    booksToRender.forEach(book => {
        const card = document.createElement('div');
        card.className = 'group book-card bg-[var(--bg-secondary)] rounded-3xl shadow-apple hover:shadow-apple-hover transition-all duration-300 overflow-hidden border border-[var(--divider)] flex flex-col h-full transform hover:-translate-y-1';
        
        card.innerHTML = `
            <div class="relative w-full aspect-video overflow-hidden bg-[var(--bg-tertiary)]">
                <div class="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110" style="background-image: url('${book.cover}')"></div>
                <img src="${book.cover}" alt="${book.title}" class="relative w-full h-full object-contain p-4 z-10 transition-transform duration-500 group-hover:scale-105 drop-shadow-lg">
                <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                    #${book.rank}
                </div>
            </div>
            
            <div class="p-6 flex-grow flex flex-col">
                <div class="description-tooltip">
                    <p class="text-sm text-[var(--text-primary)] leading-relaxed">${book.description}</p>
                </div>
                
                <div class="flex justify-between items-center mb-3">
                    <span class="text-xs font-medium text-[var(--accent)] tracking-wide uppercase bg-[var(--accent)]/10 px-2 py-1 rounded-md">
                        ${book.year}
                    </span>
                    <span class="text-xs text-[var(--text-secondary)] font-medium bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                        ${book.country}
                    </span>
                </div>
                
                <h3 class="font-semibold text-xl text-[var(--text-primary)] leading-snug mb-1 line-clamp-1" title="${book.title}">
                    ${book.title}
                </h3>
                <h4 class="text-sm text-[var(--text-secondary)] mb-4 font-normal line-clamp-1">
                    ${book.title_zh}
                </h4>
                
                <div class="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 flex-grow description-container">
                    <div class="description-text line-clamp-3" data-full-text="${book.description.replace(/"/g, '&quot;')}">
                        ${book.description}
                    </div>
                    <button class="expand-btn hidden">展开更多</button>
                </div>
                
                <div class="mt-auto pt-4 border-t border-[var(--divider)] flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-xs font-bold text-[var(--text-secondary)] ring-2 ring-[var(--bg-secondary)]">
                        ${book.author.charAt(0)}
                    </div>
                    <span class="text-sm font-medium text-[var(--text-primary)] truncate" title="${book.author}">
                        ${book.author}
                    </span>
                </div>
            </div>
        `;
        
        bookGrid.appendChild(card);
        
        // Setup expand/collapse functionality for description
        const descContainer = card.querySelector('.description-container');
        const descText = descContainer.querySelector('.description-text');
        const expandBtn = descContainer.querySelector('.expand-btn');
        
        const isTextLong = book.description.length > 150;
        
        if (isTextLong) {
            expandBtn.classList.remove('hidden');
            
            expandBtn.addEventListener('click', function() {
                if (descText.classList.contains('line-clamp-3')) {
                    descText.classList.remove('line-clamp-3');
                    descText.classList.add('line-clamp-none');
                    expandBtn.textContent = '收起';
                } else {
                    descText.classList.remove('line-clamp-none');
                    descText.classList.add('line-clamp-3');
                    expandBtn.textContent = '展开更多';
                }
            });
        }
    });
}

// Render List View
function renderListView(booksToRender) {
    bookList.classList.remove('hidden');
    bookGrid.classList.add('hidden');
    bookListBody.innerHTML = '';

    booksToRender.forEach(book => {
        const row = document.createElement('tr');
        row.className = 'list-row';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap" data-label="排名">
                <div class="list-rank">#${book.rank}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap" data-label="封面">
                <img src="${book.cover}" alt="${book.title}" class="list-cover" onerror="this.src='https://placehold.co/48x72/cccccc/666666?text=No+Cover'">
            </td>
            <td class="px-6 py-4" data-label="书名">
                <div class="flex flex-col book-info-compact">
                    <h3 class="text-sm font-semibold text-[var(--text-primary)] line-clamp-1" title="${book.title}">
                        ${book.title}
                    </h3>
                    <h4 class="text-xs text-[var(--text-secondary)] line-clamp-1" title="${book.title_zh}">
                        ${book.title_zh}
                    </h4>
                    <p class="text-xs text-[var(--text-secondary)] line-clamp-2 max-w-xs">
                        ${book.description}
                    </p>
                    <div class="flex items-center gap-2 text-xs text-[var(--text-secondary)] book-meta-compact">
                        <span class="font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
                            ${book.year}
                        </span>
                        <span class="bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                            ${book.country}
                        </span>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell" data-label="作者">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
                        ${book.author.charAt(0)}
                    </div>
                    <span class="text-sm text-[var(--text-primary)]" title="${book.author}">
                        ${book.author}
                    </span>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell" data-label="年份">
                <span class="text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-md">
                    ${book.year}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap hidden lg:table-cell" data-label="国家">
                <span class="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-md">
                    ${book.country}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right" data-label="操作">
                <a href="#" class="list-action-btn" onclick="event.preventDefault(); showBookDetails(${book.rank}); return false;">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    查看
                </a>
            </td>
        `;
        
        bookListBody.appendChild(row);
        
        // Add click event to the entire row (except action button)
        row.addEventListener('click', function(e) {
            if (!e.target.closest('.list-action-btn')) {
                showBookDetails(book.rank);
            }
        });
    });
}

// Show book details (placeholder function)
function showBookDetails(rank) {
    // Access the global books array
    const book = window.books.find(b => b.rank === rank);
    if (book) {
        alert(`书籍详情：\n\n排名: #${book.rank}\n书名: ${book.title}\n中文书名: ${book.title_zh}\n作者: ${book.author}\n国家: ${book.country}\n年份: ${book.year}\n\n简介: ${book.description}`);
    }
}

// Filter Logic
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedAuthor = authorFilter.value;
    const selectedYear = yearFilter.value;

    const filtered = books.filter(book => {
        // Search
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm) || 
            book.title_zh.includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm);
            
        // Author
        const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
        
        // Year
        let matchesYear = true;
        if (selectedYear) {
            const year = book.year;
            if (selectedYear === '2010s') matchesYear = year >= 2010 && year <= 2019;
            else if (selectedYear === '2000s') matchesYear = year >= 2000 && year <= 2009;
            else if (selectedYear === '1990s') matchesYear = year >= 1990 && year <= 1999;
            else if (selectedYear === '1980s') matchesYear = year >= 1980 && year <= 1989;
            else if (selectedYear === 'older') matchesYear = year < 1980;
        }

        return matchesSearch && matchesAuthor && matchesYear;
    });

    currentBooks = filtered;
    renderBooks(filtered);
}

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', filterBooks);
    authorFilter.addEventListener('change', filterBooks);
    yearFilter.addEventListener('change', filterBooks);
    
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        authorFilter.value = '';
        yearFilter.value = '';
        filterBooks();
    });
    
    // View toggle buttons
    gridViewBtn.addEventListener('click', () => {
        if (currentView !== 'grid') {
            currentView = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            renderBooks(currentBooks);
        }
    });
    
    listViewBtn.addEventListener('click', () => {
        if (currentView !== 'list') {
            currentView = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            renderBooks(currentBooks);
        }
    });
}

// Start
init();

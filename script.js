// DOM Elements
const bioText = document.getElementById('bio-text');
const bioContent = document.getElementById('author-bio');
const editBioBtn = document.getElementById('edit-bio-btn');
const saveBioBtn = document.getElementById('save-bio-btn');
const bioModal = document.getElementById('bio-modal');
const bookModal = document.getElementById('book-modal');
const addBookBtn = document.getElementById('add-book-btn');
const bookForm = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');
const currentYearSpan = document.getElementById('current-year');
const closeModalBtns = document.querySelectorAll('.close-modal');


// Sample books data (will be replaced with localStorage data if available)
const sampleBooks = [
{
id: 'book1',
title: 'Shadows of Desire',
wattpadUrl: 'https://www.wattpad.com/story/sample1',
description: 'A dark romance that explores the shadows within us all. When Eliza meets the enigmatic Adrian, she's drawn into a world of passion and danger that will test the limits of her sanity.',
coverUrl: 'https://source.unsplash.com/random/600x900/?dark,book,1'
},
{
id: 'book2',
title: 'The Philosophy of Pain',
wattpadUrl: 'https://www.wattpad.com/story/sample2',
description: 'A philosophical journey through the mind of a woman who discovers that her greatest suffering may be the key to her ultimate liberation.',
coverUrl: 'https://source.unsplash.com/random/600x900/?dark,book,2'
},
{
id: 'book3',
title: 'Whispers in the Void',
wattpadUrl: 'https://www.wattpad.com/story/sample3',
description: 'When the line between reality and nightmare blurs, Sophia must confront the darkness of her past to save her future.',
coverUrl: 'https://source.unsplash.com/random/600x900/?dark,book,3'
}
];


// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
// Set current year in footer
currentYearSpan.textContent = new Date().getFullYear();


// Load books from localStorage or use sample data
loadBooks();

// Load bio from localStorage or use default
loadBio();

// Add event listeners
setupEventListeners();

// Add page transition effect
animatePageLoad();

});


// Page load animation
function animatePageLoad() {
const pageTransition = document.querySelector('.page-transition');


// Initial state (covering the screen)
pageTransition.style.transform = 'translateY(0)';

// After a short delay, reveal the page
setTimeout(() => {
    pageTransition.style.transform = 'translateY(-100%)';
}, 300);

}


// Setup all event listeners
function setupEventListeners() {
// Bio editing
editBioBtn.addEventListener('click', openBioModal);
saveBioBtn.addEventListener('click', saveBio);


// Book adding/editing
addBookBtn.addEventListener('click', () => openBookModal());
bookForm.addEventListener('submit', saveBook);

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        bioModal.style.display = 'none';
        bookModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bioModal) bioModal.style.display = 'none';
    if (e.target === bookModal) bookModal.style.display = 'none';
});

// Navigation highlighting
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

}


// Bio Functions
function openBioModal() {
const bioContent = document.querySelectorAll('.author-bio p');
let bioText = '';


bioContent.forEach(paragraph => {
    bioText += paragraph.textContent + '\n\n';
});

document.getElementById('bio-text').value = bioText.trim();
bioModal.style.display = 'block';

}


function saveBio() {
const newBio = bioText.value.trim();


if (newBio) {
    // Split by double newlines to create paragraphs
    const paragraphs = newBio.split(/\n\s*\n/);
    let bioHTML = '';
    
    paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
            bioHTML += `<p>${paragraph.trim()}</p>`;
        }
    });
    
    bioContent.innerHTML = bioHTML;
    
    // Save to localStorage
    localStorage.setItem('authorBio', newBio);
    
    // Close modal
    bioModal.style.display = 'none';
}

}


function loadBio() {
const savedBio = localStorage.getItem('authorBio');


if (savedBio) {
    const paragraphs = savedBio.split(/\n\s*\n/);
    let bioHTML = '';
    
    paragraphs.forEach(paragraph => {
        if (paragraph.trim()) {
            bioHTML += `<p>${paragraph.trim()}</p>`;
        }
    });
    
    bioContent.innerHTML = bioHTML;
}

}


// Book Functions
function loadBooks() {
let books = JSON.parse(localStorage.getItem('books')) || sampleBooks;


// Clear the container
booksContainer.innerHTML = '';

// Add each book
books.forEach(book => {
    addBookToDOM(book);
});

}


function addBookToDOM(book) {
const bookCard = document.createElement('div');
bookCard.className = 'book-card';
bookCard.dataset.id = book.id;


bookCard.innerHTML = `
    <img src="${book.coverUrl}" alt="${book.title}" class="book-cover">
    <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-description">${book.description}</p>
        <a href="${book.wattpadUrl}" target="_blank" class="read-button">Read on Wattpad</a>
    </div>
    <div class="book-actions">
        <button class="edit-book-btn" onclick="openBookModal('${book.id}')"><i class="fas fa-edit"></i></button>
        <button class="delete-book-btn" onclick="deleteBook('${book.id}')"><i class="fas fa-trash"></i></button>
    </div>
`;

booksContainer.appendChild(bookCard);

}


function openBookModal(bookId = null) {
// Reset form
bookForm.reset();
document.getElementById('book-id').value = '';


if (bookId) {
    // Edit existing book
    const books = JSON.parse(localStorage.getItem('books')) || sampleBooks;
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-wattpad-url').value = book.wattpadUrl;
        document.getElementById('book-description').value = book.description;
        document.getElementById('book-id').value = book.id;
    }
}

bookModal.style.display = 'block';

}


function saveBook(e) {
e.preventDefault();


const bookId = document.getElementById('book-id').value || 'book_' + Date.now();
const title = document.getElementById('book-title').value;
const wattpadUrl = document.getElementById('book-wattpad-url').value;
const description = document.getElementById('book-description').value;

// Get cover image from Wattpad URL (in a real implementation, you would fetch this)
// For now, we'll use a placeholder
const coverUrl = `https://source.unsplash.com/random/600x900/?dark,book,${Math.floor(Math.random() * 100)}`;

const newBook = {
    id: bookId,
    title,
    wattpadUrl,
    description,
    coverUrl
};

// Get existing books
let books = JSON.parse(localStorage.getItem('books')) || sampleBooks;

// Check if we're editing or adding
const existingIndex = books.findIndex(b => b.id === bookId);

if (existingIndex >= 0) {
    // Update existing book
    books[existingIndex] = newBook;
} else {
    // Add new book
    books.push(newBook);
}

// Save to localStorage
localStorage.setItem('books', JSON.stringify(books));

// Reload books
loadBooks();

// Close modal
bookModal.style.display = 'none';

}


function deleteBook(bookId) {
if (confirm('Are you sure you want to delete this book?')) {
let books = JSON.parse(localStorage.getItem('books')) || sampleBooks;
books = books.filter(book => book.id !== bookId);


    // Save to localStorage
    localStorage.setItem('books', JSON.stringify(books));
    
    // Reload books
    loadBooks();
}

}


// Make functions available globally
window.openBookModal = openBookModal;
window.deleteBook = deleteBook;
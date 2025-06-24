const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' }); // Adjust path as needed

// Verify MongoDB URI - using MONGODB_URI (common convention)
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
    console.error('❌ MongoDB connection URI not found in environment variables');
    console.error('Please set MONGODB_URI in your .env file');
    process.exit(1);
}

// ISBN Generation Functions
function generateUniqueISBN(usedISBNs, format = 13) {
    let isbn;
    let attempts = 0;
    const maxAttempts = 100;

    do {
        isbn = generateISBN(format);
        attempts++;
        if (attempts > maxAttempts) {
            throw new Error('Failed to generate unique ISBN after maximum attempts');
        }
    } while (usedISBNs.has(isbn));

    return isbn;
}

function generateISBN(format = 13) {
    const prefix = format === 13 ? '978' : '';
    let isbn = prefix;

    const digits = format === 13 ? 9 : 9;
    for (let i = 0; i < digits; i++) {
        isbn += Math.floor(Math.random() * 10);
    }

    return isbn + calculateCheckDigit(isbn, format);
}

function calculateCheckDigit(isbn, format) {
    if (format === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(isbn[i]) * (10 - i);
        }
        const remainder = sum % 11;
        return remainder === 0 ? '0' : remainder === 1 ? 'X' : (11 - remainder).toString();
    } else {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
        }
        const remainder = sum % 10;
        return remainder === 0 ? '0' : (10 - remainder).toString();
    }
}

// Schemas
const authorSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    dailyFee: { type: Number, default: 1.99 },
    publishedYear: { type: Number },
    availableCopies: { type: Number },
    totalCopies: { type: Number }
});

const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);
// 1. Define all authors
const authors = [
    { name: "George Orwell" },
    { name: "Harper Lee" },
    { name: "F. Scott Fitzgerald" },
    { name: "J. D. Salinger" },
    { name: "Ray Bradbury" },
    { name: "William Golding" },
    { name: "John Steinbeck" },
    { name: "Ann Frank" },
    { name: "John Green" },
    { name: "Jane Austen" },
    { name: "Charlotte Brontë" },
    { name: "J.R.R. Tolkien" },
    { name: "Veronica Roth" },
    { name: "Aldous Huxley" },
    { name: "Fyodor Dostoevsky" },
    { name: "Oscar Wilde" },
    { name: "Victor Hugo" },
    { name: "Emily Brontë" },
    { name: "Charles Dickens" }
];

// 2. Define all books with author names (will be converted to IDs)
const usedISBNs = new Set();
    const booksData = [
        {
            title: "1984",
            author: "George Orwell",
            genre: "Dystopian",
            price: 10.5,
            description: "A chilling prediction of totalitarian regimes.",
            stock: 8,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            genre: "Fiction",
            price: 9.99,
            description: "A powerful story about racial injustice in the American South.",
            stock: 12,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            genre: "Classic",
            price: 12.99,
            description: "A novel set in the Roaring Twenties.",
            stock: 5,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Catcher in the Rye",
            author: "J. D. Salinger",
            genre: "Classic",
            price: 9.99,
            description: "The Catcher in the Rye is an all-time classic in coming-of-age literature.",
            stock: 5,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1398034300i/5107.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Animal Farm",
            author: "George Orwell",
            genre: "Dystopian",
            price: 5.99,
            description: "A farm is taken over by its overworked, mistreated animals.",
            stock: 8,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1325861570i/7613.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Fahrenheit 451",
            author: "Ray Bradbury",
            genre: "Fiction",
            price: 12.99,
            description: "Guy Montag is a fireman. His job is to destroy the most illegal of commodities.",
            stock: 12,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1383718290i/13079982.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Lord of the Flies",
            author: "William Golding",
            genre: "Classic",
            price: 9.99,
            description: "At the dawn of the next world war, a plane crashes on an uncharted island.",
            stock: 5,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327869409i/7624.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Of Mice and Men",
            author: "John Steinbeck",
            genre: "Fiction",
            price: 11.99,
            description: "A unique perspective on life's hardships.",
            stock: 8,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511302904i/890.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Diary of a Young Girl",
            author: "Ann Frank",
            genre: "Memoir",
            price: 2.51,
            description: "Facing hunger, fear of discovery and death, and the petty frustrations of confined living.",
            stock: 12,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1560816565i/48855.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Fault in our Stars",
            author: "John Green",
            genre: "Young Adult",
            price: 9.99,
            description: "Insightful, bold, irreverent, and raw, The Fault in Our Stars is award-winning.",
            stock: 12,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1360206420i/11870085.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            genre: "Classic",
            price: 8.5,
            description: "A brilliant comedy of manners, Pride and Prejudice explores the nature of love.",
            stock: 10,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320399351i/1885.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Jane Eyre",
            author: "Charlotte Brontë",
            genre: "Gothic Fiction",
            price: 9.99,
            description: "A young governess falls in love with her mysterious employer.",
            stock: 8,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557343311i/10210.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            genre: "Fantasy",
            price: 12.5,
            description: "Bilbo Baggins is swept into a quest to reclaim a treasure guarded by a dragon.",
            stock: 15,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546071216i/5907.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Divergent #1",
            author: "Veronica Roth",
            genre: "Fiction",
            price: 8.99,
            description: "In Beatrice Prior's dystopian Chicago world, society is divided into factions.",
            stock: 14,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1618526890i/13335037.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Brave New World",
            author: "Aldous Huxley",
            genre: "Dystopian",
            price: 10.0,
            description: "A futuristic society engineered for maximum happiness—but at what cost to individuality, freedom, and truth?",
            stock: 11,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1575509280i/5129.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Crime and Punishment",
            author: "Fyodor Dostoevsky",
            genre: "Philosophical Fiction",
            price: 11.25,
            description: "A psychological study of morality and guilt as Raskolnikov commits murder and faces the consequences of his conscience.",
            stock: 6,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1382846449i/7144.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "The Picture of Dorian Gray",
            author: "Oscar Wilde",
            genre: "Classic",
            price: 9.0,
            description: "Dorian Gray remains young and beautiful while a portrait of him ages with each sin, revealing his descent into moral corruption.",
            stock: 9,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1546103428i/5297.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Les Misérables",
            author: "Victor Hugo",
            genre: "Historical Fiction",
            price: 13.0,
            description: "An epic story of justice, redemption, and revolution set in 19th-century France, following ex-convict Jean Valjean.",
            stock: 7,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1411852091i/24280.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "Wuthering Heights",
            author: "Emily Brontë",
            genre: "Gothic Fiction",
            price: 7.99,
            description: "A dark and passionate tale of revenge and doomed love set on the Yorkshire moors.",
            stock: 10,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1631192373i/6185.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        },
        {
            title: "A Tale of Two Cities",
            author: "Charles Dickens",
            genre: "Historical Fiction",
            price: 8.75,
            description: "A powerful novel of love and sacrifice set during the French Revolution.",
            stock: 13,
            image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1554081302i/1953.jpg",
            dailyFee: 0.50,
            publishedYear: 1949
        }
    ];

    return booksData.map(book => ({
        ...book,
        isbn: generateUniqueISBN(usedISBNs, 13),
        availableCopies: book.stock,
        totalCopies: book.stock
    }));

async function prepareBooks() {
    
    return booksData.map(book => ({
        ...book,
        isbn: generateUniqueISBN(usedISBNs, 13),
        availableCopies: book.stock,
        totalCopies: book.stock
    }));
}

// Seeding function
async function seedDatabase() {
    try {
        console.log(`🔗 Connecting to MongoDB...`);

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("📚 Connected to MongoDB");

        // Clear existing data
        console.log("🧹 Clearing existing data...");
        await Promise.all([
            Book.deleteMany({}),
            Author.deleteMany({})
        ]);

        // Seed authors
        console.log("⏳ Seeding authors...");
        const authorDocs = await Author.insertMany(authors);
        console.log(`✅ ${authorDocs.length} authors inserted`);

        // Create author name to ID mapping
        const authorMap = {};
        authorDocs.forEach(author => {
            authorMap[author.name] = author._id;
        });

        // Prepare books with unique ISBNs
        console.log("🔠 Generating book data with unique ISBNs...");
        const booksWithReferences = (await prepareBooks()).map(book => ({
            ...book,
            author: authorMap[book.author]
        }));

        // Seed books in batches
        console.log("⏳ Seeding books...");
        const BATCH_SIZE = 5; // Reduced batch size for safety
        for (let i = 0; i < booksWithReferences.length; i += BATCH_SIZE) {
            const batch = booksWithReferences.slice(i, i + BATCH_SIZE);
            await Book.insertMany(batch);
            console.log(`  → Batch ${Math.floor(i / BATCH_SIZE) + 1} completed (${Math.min(i + BATCH_SIZE, booksWithReferences.length)}/${booksWithReferences.length})`);
        }

        console.log("🎉 Database seeded successfully!");
        console.log(`📊 Total books inserted: ${booksWithReferences.length}`);
    } catch (err) {
        console.error("❌ Database seeding failed:", err.message);
        if (err.code === 11000) {
            console.error("Duplicate key error - check your ISBN generation");
        }
        console.error("Full error:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedDatabase();
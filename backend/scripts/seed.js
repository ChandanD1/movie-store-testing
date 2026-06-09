console.log('>>> [SEED] Starting seed script...');
console.log('>>> [SEED] Loading path and dotenv...');
const path = require('path');
const dotenv = require('dotenv');

console.log('>>> [SEED] Configuring dotenv...');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('>>> [SEED] Loading native mongodb driver...');
const { MongoClient, ObjectId } = require('mongodb');
console.log('>>> [SEED] Native mongodb driver loaded.');

const seedMovies = [
  {
    _id: new ObjectId("66503c00d11019688bc8a9b1"),
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIaXf.jpg",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    price: 199,
    rating: 4.8,
    releaseYear: 2010,
    genre: "Sci-Fi",
    countInStock: 1000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    price: 399,
    rating: 4.9,
    releaseYear: 2024,
    genre: "Sci-Fi",
    countInStock: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
    price: 299,
    rating: 4.9,
    releaseYear: 2008,
    genre: "Action",
    countInStock: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "RRR",
    description: "A fictional tale of two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
    trailerUrl: "https://www.youtube.com/embed/NgBoMJy386M",
    price: 249,
    rating: 4.9,
    releaseYear: 2022,
    genre: "Action",
    countInStock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Baahubali: The Beginning",
    description: "In ancient India, an adventurous and daring man falls in love with a woman warrior and helps her rescue her queen from captivity.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/o5e3Z5gV1M179j21VpS6t4f1r8J.jpg",
    trailerUrl: "https://www.youtube.com/embed/VdafjyDK3ko",
    price: 199,
    rating: 4.8,
    releaseYear: 2015,
    genre: "Action",
    countInStock: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "K.G.F: Chapter 2",
    description: "In the blood-drenched Kolar Gold Fields, Rocky's name strikes fear into his foes. His allies look up to him, but the government sees him as a threat.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/d5N79GvYqH5g8C06s2oN2s9P4d.jpg",
    trailerUrl: "https://www.youtube.com/embed/JKa05nyUook",
    price: 249,
    rating: 4.9,
    releaseYear: 2022,
    genre: "Action",
    countInStock: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Dangal",
    description: "Biographical sports drama about Mahavir Singh Phogat, who trained his daughters Geeta and Babita Phogat to become India's first world-class female wrestlers.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/w9kR4O1s8VCHWw4iFwL4q637V1o.jpg",
    trailerUrl: "https://www.youtube.com/embed/x_7YlGv9u1g",
    price: 149,
    rating: 4.9,
    releaseYear: 2016,
    genre: "Drama",
    countInStock: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "3 Idiots",
    description: "Two friends search for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/wbE5SRTZFtQxgj2nIo4HJpQDk0k.jpg",
    trailerUrl: "https://www.youtube.com/embed/K0eDlFX9GMc",
    price: 149,
    rating: 4.8,
    releaseYear: 2009,
    genre: "Drama",
    countInStock: 14,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Jawan",
    description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/kuf6dutps10vSSxraSJX3jPPH9i.jpg",
    trailerUrl: "https://www.youtube.com/embed/MWOlnZjkfAc",
    price: 299,
    rating: 4.7,
    releaseYear: 2023,
    genre: "Action",
    countInStock: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Pushpa: The Rise",
    description: "A red sanders smuggler, Pushpa Raj, rises to power in the Seshachalam forests, facing off against an intense police inspector.",
    posterUrl: "https://images.weserv.nl/?url=https://image.tmdb.org/t/p/w500/k32sP4wK4yFwE71QjJ1U235P2mC.jpg",
    trailerUrl: "https://www.youtube.com/embed/pKctjlxbFDQ",
    price: 199,
    rating: 4.7,
    releaseYear: 2021,
    genre: "Action",
    countInStock: 11,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const run = async () => {
  const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movie-store';
  console.log(`>>> [SEED] Connecting to database at ${dbUri}...`);
  
  const client = new MongoClient(dbUri);

  try {
    await client.connect();
    console.log('>>> [SEED] Database connected successfully via native driver.');

    const db = client.db();

    // Clear old data
    console.log('>>> [SEED] Wiping existing Movie and Order collections...');
    await db.collection('movies').deleteMany({});
    await db.collection('orders').deleteMany({});
    console.log('>>> [SEED] Collections wiped.');

    // Insert seeds
    console.log('>>> [SEED] Inserting seed movie items...');
    const result = await db.collection('movies').insertMany(seedMovies);
    console.log(`>>> [SEED] Successfully seeded ${result.insertedCount} movies!`);
    
    await client.close();
    console.log('>>> [SEED] Connection closed. Seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('>>> [SEED] Error during seeding:', error);
    try {
      await client.close();
    } catch (e) {}
    process.exit(1);
  }
};

run();

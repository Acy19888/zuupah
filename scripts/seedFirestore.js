/**
 * Zuupah Firestore Seed Script
 *
 * Populates the Firestore database with sample books, categories,
 * and a test firmware version for development & testing.
 *
 * Usage:
 *   node scripts/seedFirestore.js
 *
 * Requirements:
 *   npm install firebase-admin
 *   Set GOOGLE_APPLICATION_CREDENTIALS env var OR place serviceAccountKey.json
 *   in the scripts/ folder.
 *
 * Get your service account key:
 *   Firebase Console → Project Settings → Service accounts → Generate new private key
 */

const admin = require('firebase-admin');
const path = require('path');

// ─── Firebase Init ────────────────────────────────────────────────────────────
let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch {
  console.error('❌  serviceAccountKey.json not found in scripts/ folder.');
  console.error('    Firebase Console → Project Settings → Service accounts → Generate new private key');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'zuupah-77bbc',
});

const db = admin.firestore();

// ─── Seed Data ────────────────────────────────────────────────────────────────

const BOOKS = [
  // ── Animals ──
  {
    id: 'book_animals_farm',
    title: 'Farm Friends',
    description: 'Meet the animals on the farm! Tap each animal to hear its sound and name.',
    coverUrl: 'https://placehold.co/300x400/38b6c9/ffffff?text=Farm+Friends',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/farm_friends.zip',
    price: 0,
    isFree: true,
    category: 'animals',
    ageMin: 2,
    ageMax: 5,
    language: 'en',
    fileSize: 12400000, // 12.4 MB
    pageCount: 16,
    tags: ['animals', 'farm', 'sounds', 'beginner'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'book_animals_jungle',
    title: 'Jungle Adventure',
    description: 'Explore the jungle and discover lions, elephants, monkeys and more!',
    coverUrl: 'https://placehold.co/300x400/ff5a1f/ffffff?text=Jungle+Adventure',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/jungle_adventure.zip',
    price: 4.99,
    isFree: false,
    category: 'animals',
    ageMin: 3,
    ageMax: 6,
    language: 'en',
    fileSize: 18700000,
    pageCount: 20,
    tags: ['animals', 'jungle', 'adventure', 'nature'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'book_animals_ocean',
    title: 'Ocean Wonders',
    description: 'Dive into the deep blue sea and meet dolphins, sharks, and colorful fish!',
    coverUrl: 'https://placehold.co/300x400/38b6c9/ffffff?text=Ocean+Wonders',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/ocean_wonders.zip',
    price: 4.99,
    isFree: false,
    category: 'animals',
    ageMin: 3,
    ageMax: 7,
    language: 'en',
    fileSize: 15200000,
    pageCount: 18,
    tags: ['animals', 'ocean', 'sea', 'nature'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },

  // ── ABC / Numbers ──
  {
    id: 'book_abc_letters',
    title: 'My First ABC',
    description: 'Learn the alphabet with fun sounds and words for every letter. A is for Apple!',
    coverUrl: 'https://placehold.co/300x400/ffc400/2d3748?text=My+First+ABC',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/my_first_abc.zip',
    price: 0,
    isFree: true,
    category: 'abc',
    ageMin: 2,
    ageMax: 5,
    language: 'en',
    fileSize: 9800000,
    pageCount: 28,
    tags: ['alphabet', 'letters', 'abc', 'learning', 'beginner'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'book_numbers_123',
    title: 'Count with Me!',
    description: 'Count from 1 to 20 with fun animations and songs. Math has never been this fun!',
    coverUrl: 'https://placehold.co/300x400/ffc400/2d3748?text=Count+with+Me',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/count_with_me.zip',
    price: 3.99,
    isFree: false,
    category: 'numbers',
    ageMin: 2,
    ageMax: 5,
    language: 'en',
    fileSize: 11100000,
    pageCount: 24,
    tags: ['numbers', 'counting', 'math', 'beginner'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },

  // ── Stories ──
  {
    id: 'book_story_bedtime',
    title: 'Goodnight, Little Star',
    description: 'A soothing bedtime story with calming music to help little ones drift off to sleep.',
    coverUrl: 'https://placehold.co/300x400/38b6c9/ffffff?text=Goodnight+Star',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/goodnight_star.zip',
    price: 5.99,
    isFree: false,
    category: 'stories',
    ageMin: 2,
    ageMax: 6,
    language: 'en',
    fileSize: 22300000,
    pageCount: 24,
    tags: ['bedtime', 'story', 'sleep', 'calming'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'book_story_dragon',
    title: 'Zuu the Little Dragon',
    description: 'Follow Zuu the friendly dragon on his first big adventure through the magical forest!',
    coverUrl: 'https://placehold.co/300x400/ff5a1f/ffffff?text=Zuu+the+Dragon',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/zuu_dragon.zip',
    price: 5.99,
    isFree: false,
    category: 'stories',
    ageMin: 3,
    ageMax: 7,
    language: 'en',
    fileSize: 25600000,
    pageCount: 32,
    tags: ['story', 'dragon', 'adventure', 'fantasy'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },

  // ── Science ──
  {
    id: 'book_science_space',
    title: 'Hello, Space!',
    description: 'Blast off to the stars! Learn about planets, rockets, and astronauts.',
    coverUrl: 'https://placehold.co/300x400/2d3748/ffffff?text=Hello+Space',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/hello_space.zip',
    price: 4.99,
    isFree: false,
    category: 'science',
    ageMin: 4,
    ageMax: 7,
    language: 'en',
    fileSize: 19800000,
    pageCount: 20,
    tags: ['space', 'planets', 'science', 'exploration'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'book_science_body',
    title: 'My Amazing Body',
    description: 'Discover how your heart beats, your lungs breathe, and your brain thinks!',
    coverUrl: 'https://placehold.co/300x400/38b6c9/ffffff?text=My+Amazing+Body',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/my_amazing_body.zip',
    price: 4.99,
    isFree: false,
    category: 'science',
    ageMin: 4,
    ageMax: 8,
    language: 'en',
    fileSize: 17400000,
    pageCount: 22,
    tags: ['body', 'health', 'science', 'biology'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },

  // ── Music ──
  {
    id: 'book_music_nursery',
    title: 'Sing Along! Nursery Rhymes',
    description: '20 classic nursery rhymes with interactive sing-along audio. Twinkle Twinkle, Humpty Dumpty & more!',
    coverUrl: 'https://placehold.co/300x400/ffc400/2d3748?text=Nursery+Rhymes',
    audioFileUrl: 'gs://zuupah-77bbc.firebasestorage.app/books/nursery_rhymes.zip',
    price: 6.99,
    isFree: false,
    category: 'music',
    ageMin: 1,
    ageMax: 5,
    language: 'en',
    fileSize: 31200000,
    pageCount: 40,
    tags: ['music', 'songs', 'nursery rhymes', 'singing'],
    isPublished: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

const CATEGORIES = [
  { id: 'all',     label: 'All Books',  icon: 'book-open',    color: '#38b6c9' },
  { id: 'animals', label: 'Animals',    icon: 'paw',          color: '#ff5a1f' },
  { id: 'abc',     label: 'ABC',        icon: 'alphabetical', color: '#ffc400' },
  { id: 'numbers', label: 'Numbers',    icon: 'numeric',      color: '#38b6c9' },
  { id: 'stories', label: 'Stories',    icon: 'book',         color: '#ff5a1f' },
  { id: 'science', label: 'Science',    icon: 'flask',        color: '#ffc400' },
  { id: 'music',   label: 'Music',      icon: 'music',        color: '#38b6c9' },
];

const FIRMWARE_VERSIONS = [
  {
    id: 'fw_1_0_0',
    version: '1.0.0',
    releaseNotes: 'Initial firmware release.\n• Basic book scanning\n• Audio playback\n• Volume control',
    downloadUrl: 'gs://zuupah-77bbc.firebasestorage.app/firmware/zuupah_fw_1.0.0.bin',
    releaseDate: new Date('2025-01-15'),
    isLatest: false,
    fileSize: 524288, // 512 KB
  },
  {
    id: 'fw_1_1_0',
    version: '1.1.0',
    releaseNotes: 'Performance improvements.\n• Faster book recognition\n• Improved audio quality\n• Battery life improvements',
    downloadUrl: 'gs://zuupah-77bbc.firebasestorage.app/firmware/zuupah_fw_1.1.0.bin',
    releaseDate: new Date('2025-03-01'),
    isLatest: false,
    fileSize: 548576,
  },
  {
    id: 'fw_1_2_0',
    version: '1.2.0',
    releaseNotes: 'New features!\n• Bluetooth book transfer (NEW)\n• Sleep timer\n• Language support improvements\n• Bug fixes',
    downloadUrl: 'gs://zuupah-77bbc.firebasestorage.app/firmware/zuupah_fw_1.2.0.bin',
    releaseDate: new Date('2025-06-01'),
    isLatest: true,
    fileSize: 589824,
  },
];

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedBooks() {
  console.log('\n📚  Seeding books...');
  const batch = db.batch();

  for (const book of BOOKS) {
    const ref = db.collection('books').doc(book.id);
    batch.set(ref, book);
  }

  await batch.commit();
  console.log(`✅  ${BOOKS.length} books added.`);
}

async function seedCategories() {
  console.log('\n🏷️   Seeding categories...');
  const batch = db.batch();

  for (const cat of CATEGORIES) {
    const ref = db.collection('categories').doc(cat.id);
    batch.set(ref, cat);
  }

  await batch.commit();
  console.log(`✅  ${CATEGORIES.length} categories added.`);
}

async function seedFirmware() {
  console.log('\n⚡  Seeding firmware versions...');
  const batch = db.batch();

  for (const fw of FIRMWARE_VERSIONS) {
    const ref = db.collection('firmwareVersions').doc(fw.id);
    batch.set(ref, {
      ...fw,
      releaseDate: admin.firestore.Timestamp.fromDate(fw.releaseDate),
    });
  }

  await batch.commit();
  console.log(`✅  ${FIRMWARE_VERSIONS.length} firmware versions added.`);
}

async function main() {
  console.log('🚀  Zuupah Firestore Seeder');
  console.log('   Project: zuupah-77bbc');
  console.log('─'.repeat(40));

  try {
    await seedBooks();
    await seedCategories();
    await seedFirmware();

    console.log('\n─'.repeat(40));
    console.log('🎉  Seeding complete!');
    console.log(`   📚  ${BOOKS.length} books`);
    console.log(`   🏷️   ${CATEGORIES.length} categories`);
    console.log(`   ⚡  ${FIRMWARE_VERSIONS.length} firmware versions`);
    console.log('\nOpen Firebase Console → Firestore to verify:');
    console.log('https://console.firebase.google.com/project/zuupah-77bbc/firestore\n');
  } catch (err) {
    console.error('❌  Seed failed:', err);
  } finally {
    process.exit(0);
  }
}

main();

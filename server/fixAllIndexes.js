const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return fixAllIndexes();
  })
  .then(() => {
    console.log('✅ All indexes fixed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

async function fixAllIndexes() {
  try {
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Collections in database:');
    collections.forEach((col, i) => {
      console.log(`  ${i + 1}. ${col.name}`);
    });
    
    // Check and clean users collection
    if (collections.some(col => col.name === 'users')) {
      console.log('\n🔍 Examining "users" collection...');
      const usersCollection = db.collection('users');
      const indexes = await usersCollection.listIndexes().toArray();
      
      console.log('📋 Current indexes:');
      indexes.forEach((index, i) => {
        console.log(`  ${i + 1}. ${JSON.stringify(index.key)} - Name: ${index.name}`);
      });
      
      // Drop all custom indexes except _id_
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            await usersCollection.dropIndex(index.name);
            console.log(`✅ Dropped index: ${index.name}`);
          } catch (err) {
            console.log(`⚠️  Could not drop ${index.name}: ${err.message}`);
          }
        }
      }
      
      // Recreate only the email unique index
      console.log('\n🔧 Recreating email unique index...');
      await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });
      console.log('✅ Email unique index created');
    }
    
    // List final indexes
    console.log('\n📋 Final indexes on "users" collection:');
    const usersCollection = db.collection('users');
    const finalIndexes = await usersCollection.listIndexes().toArray();
    finalIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${JSON.stringify(index.key)} - Name: ${index.name}`);
    });
    
  } catch (err) {
    throw new Error(`Failed to fix indexes: ${err.message}`);
  }
}

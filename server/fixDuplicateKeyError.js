const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return fixDuplicateKeyError();
  })
  .then(() => {
    console.log('✅ Fix completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

async function fixDuplicateKeyError() {
  try {
    const db = mongoose.connection.db;
    
    // Get all indexes on the 'users' collection
    const collection = db.collection('users');
    const indexes = await collection.listIndexes().toArray();
    
    console.log('📋 Current indexes on "users" collection:');
    indexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${JSON.stringify(index.key)} - Name: ${index.name}`);
    });
    
    // Drop the problematic 'username_1' index if it exists
    const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
    
    if (hasUsernameIndex) {
      console.log('\n🔍 Found problematic "username_1" index...');
      await collection.dropIndex('username_1');
      console.log('✅ Dropped "username_1" index');
    } else {
      console.log('\n✅ No "username_1" index found - database is clean!');
    }
    
    // Also drop any other indices that might be problematic
    const otherProblematicIndexes = indexes
      .filter(idx => idx.name !== '_id_' && idx.name.includes('username'));
    
    if (otherProblematicIndexes.length > 0) {
      for (const idx of otherProblematicIndexes) {
        console.log(`🔍 Found problematic "${idx.name}" index...`);
        await collection.dropIndex(idx.name);
        console.log(`✅ Dropped "${idx.name}" index`);
      }
    }
    
    // Verify all indexes after cleanup
    const finalIndexes = await collection.listIndexes().toArray();
    console.log('\n📋 Final indexes on "users" collection:');
    finalIndexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${JSON.stringify(index.key)} - Name: ${index.name}`);
    });
    
  } catch (err) {
    throw new Error(`Failed to fix duplicate key error: ${err.message}`);
  }
}

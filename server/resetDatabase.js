const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return resetDatabase();
  })
  .then(() => {
    console.log('\n✅ Database reset completed successfully!');
    console.log('✅ You can now register new users');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

async function resetDatabase() {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    console.log('\n🗑️  Clearing all users from database...');
    const deleteResult = await usersCollection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old user documents`);
    
    // Drop and recreate indexes
    console.log('\n🔧 Recreating indexes...');
    try {
      await usersCollection.dropIndex('email_1');
      console.log('✅ Dropped old email index');
    } catch (err) {
      console.log('⚠️  Email index not found, creating new one...');
    }
    
    // Create fresh indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true, sparse: true });
    console.log('✅ Created fresh email unique index (sparse)');
    
    // Verify
    console.log('\n📋 Final state:');
    const count = await usersCollection.countDocuments({});
    console.log(`  Total users: ${count}`);
    
    const indexes = await usersCollection.listIndexes().toArray();
    console.log('  Indexes:');
    indexes.forEach((idx, i) => {
      console.log(`    ${i + 1}. ${JSON.stringify(idx.key)} (${idx.name})`);
    });
    
  } catch (err) {
    throw new Error(`Failed to reset database: ${err.message}`);
  }
}

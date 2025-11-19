const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return checkAndCleanUsers();
  })
  .then(() => {
    console.log('✅ Database check and cleanup completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

async function checkAndCleanUsers() {
  try {
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get all users first
    const initialUsers = await usersCollection.find({}).toArray();
    
    console.log('\n📊 Database Statistics:');
    console.log(`  Total documents: ${initialUsers.length}`);
    
    // Find documents with null or missing email
    console.log('\n🔍 Checking for null or missing emails...');
    const nullEmailDocs = await usersCollection.find({ email: null }).toArray();
    const missingEmailDocs = await usersCollection.find({ email: { $exists: false } }).toArray();
    
    if (nullEmailDocs.length > 0) {
      console.log(`⚠️  Found ${nullEmailDocs.length} documents with null email`);
      console.log('  Deleting them...');
      const deleteResult = await usersCollection.deleteMany({ email: null });
      console.log(`  ✅ Deleted ${deleteResult.deletedCount} documents with null email`);
    } else {
      console.log('✅ No documents with null email found');
    }
    
    if (missingEmailDocs.length > 0) {
      console.log(`⚠️  Found ${missingEmailDocs.length} documents with missing email`);
      console.log('  Deleting them...');
      const deleteResult = await usersCollection.deleteMany({ email: { $exists: false } });
      console.log(`  ✅ Deleted ${deleteResult.deletedCount} documents with missing email`);
    } else {
      console.log('✅ No documents with missing email found');
    }
    
    // List all remaining users
    console.log('\n📋 All remaining users in database:');
    const finalUsers = await usersCollection.find({}).toArray();
    if (finalUsers.length === 0) {
      console.log('  (No users yet - ready for new registrations!)');
    } else {
      finalUsers.forEach((user, i) => {
        console.log(`  ${i + 1}. Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Status: ${user.status}`);
      });
    }
    
  } catch (err) {
    throw new Error(`Failed to check users: ${err.message}`);
  }
}

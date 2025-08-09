// Script to seed rooms with all required fields for your app
const mongoose = require('mongoose');
const Room = require('./models/Room');
require('dotenv').config();

const rooms = [
  {
    name: 'Room 101',
    description: 'Spacious classroom',
    capacity: 30,
    image: '',
    block: 'A',
    status: 'vacant',
    floor: 1,
    hasWifi: true,
    hasProjector: true,
    nextAvailable: '',
  },
  {
    name: 'Room 102',
    description: 'Standard classroom',
    capacity: 45,
    image: '',
    block: 'A',
    status: 'occupied',
    floor: 1,
    hasWifi: true,
    hasProjector: false,
    nextAvailable: '2:00 PM',
  },
  {
    name: 'Room 201',
    description: 'Large classroom',
    capacity: 60,
    image: '',
    block: 'A',
    status: 'vacant',
    floor: 2,
    hasWifi: true,
    hasProjector: true,
    nextAvailable: '',
  },
  {
    name: 'Room 301',
    description: 'Small classroom',
    capacity: 25,
    image: '',
    block: 'B',
    status: 'vacant',
    floor: 3,
    hasWifi: false,
    hasProjector: true,
    nextAvailable: '',
  },
  {
    name: 'Room 401',
    description: 'Medium classroom',
    capacity: 40,
    image: '',
    block: 'B',
    status: 'occupied',
    floor: 4,
    hasWifi: true,
    hasProjector: true,
    nextAvailable: '4:30 PM',
  },
  {
    name: 'Lab 501',
    description: 'Computer lab',
    capacity: 35,
    image: '',
    block: 'C',
    status: 'vacant',
    floor: 5,
    hasWifi: true,
    hasProjector: false,
    nextAvailable: '',
  },
  {
    name: 'Auditorium',
    description: 'Large auditorium',
    capacity: 200,
    image: '',
    block: 'D',
    status: 'occupied',
    floor: 1,
    hasWifi: true,
    hasProjector: true,
    nextAvailable: '6:00 PM',
  },
  {
    name: 'Room 105',
    description: 'Bright classroom',
    capacity: 50,
    image: '',
    block: 'A',
    status: 'vacant',
    floor: 1,
    hasWifi: true,
    hasProjector: true,
    nextAvailable: '',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Room.deleteMany({});
  await Room.insertMany(rooms);
  console.log('Rooms seeded!');
  mongoose.disconnect();
}

seed();

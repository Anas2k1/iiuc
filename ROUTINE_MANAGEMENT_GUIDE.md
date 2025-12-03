# Routine Management Feature Guide

## Overview
The routine management feature allows administrators to create and manage class schedules (routines). When a routine is updated, rooms are automatically booked based on the schedule time and date.

## Key Features

### 1. **Add Routine Entries**
- Specify day of the week (Sunday - Saturday)
- Set time slot (format: HH:MM - HH:MM, e.g., 09:00 - 10:30)
- Enter course code (e.g., CSE101)
- Assign teacher name
- Select the room for the class

### 2. **Auto-Book Rooms**
When you save the routine:
- A system admin user is created automatically (if not exists) with:
  - Email: `system@admin.com`
  - Name: `System Admin`
  - Role: `teacher`
  - Status: `approved`
- Each routine entry automatically creates a booking for:
  - The next occurrence of that day
  - The specified time slot
  - The selected room
  - The system admin user

### 3. **View Current Routine**
- Display all active routine entries in a table format
- Shows: Day, Time, Course, Teacher, Room
- Click "Edit Routine" to modify

## How to Use

### Step 1: Access Admin Dashboard
1. Navigate to Login page
2. Click "Admin Login" tab
3. Login with admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin`

### Step 2: Access Routine Management
1. In Admin Dashboard, click the **"Edit Routine"** button
2. The "Manage Class Routine" dialog will open

### Step 3: Add Routine Entries
1. Select the day of the week
2. Enter time in format `HH:MM - HH:MM` (e.g., `09:00 - 10:30`)
3. Enter course code (e.g., `CSE101`)
4. Enter teacher name (e.g., `Dr. Ahmed`)
5. Select a room from the dropdown
6. Click **"Add Entry"**
7. Repeat for additional entries

### Step 4: Review Current Routine
- All added entries appear in the "Current Routine" section
- Each entry shows: Day, Time, Course, Teacher, Room
- Click **"Remove"** to delete an entry

### Step 5: Save Routine
1. Click **"Save & Auto-Book Rooms"** button
2. The system will:
   - Clear existing schedules and bookings
   - Create new schedule entries
   - Automatically book rooms for each entry
   - Show a success message

## Backend Implementation Details

### API Endpoint
**URL:** `PUT /api/schedules/update-routine`
**Auth:** Required (JWT token)

**Request Body:**
```json
{
  "routineData": [
    {
      "day": "Sunday",
      "time": "09:00 - 10:30",
      "course": "CSE101",
      "teacher": "Dr. Ahmed",
      "roomId": "507f1f77bcf86cd799439011"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Routine updated successfully",
  "schedules": [...],
  "bookings": [...]
}
```

### Database Changes

#### Schedule Model (Enhanced)
```javascript
{
  day: String (enum: Sun-Sat),
  time: String (format: "HH:MM - HH:MM"),
  course: String,
  teacher: String,
  room: ObjectId (ref: Room),
  bookings: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Auto-Booking Logic
1. Parse the day string to get day index
2. Calculate days until next occurrence
3. Create booking date for that day
4. Create system admin user if doesn't exist
5. Create booking with:
   - User: system@admin.com
   - Room: Selected room
   - Date: Next occurrence date
   - TimeSlot: Provided time

### System Admin User
- **Auto-created** on first routine save
- Used for system bookings only
- Cannot be edited or deleted by admin
- Email: `system@admin.com`

## Example Workflow

### Scenario: Weekly Class Routine

**Input:**
- Sunday: 09:00 - 10:30 | CSE101 | Dr. Ahmed | Room 101
- Monday: 10:45 - 12:15 | MAT102 | Prof. Khan | Room 201
- Wednesday: 14:00 - 15:30 | PHY103 | Dr. Hassan | Lab 501

**Output:**
1. Three schedule entries created
2. Three automatic bookings created for:
   - Next Sunday at Room 101
   - Next Monday at Room 201
   - Next Wednesday at Lab 501
3. Each booking is under system admin user
4. Rooms are marked as occupied for those slots

## Important Notes

- **Clear on Update:** Previous routine and bookings are cleared when updating
- **Real-time Booking:** Rooms are booked immediately when routine is saved
- **Time Format:** Must be in HH:MM format (24-hour)
- **Valid Days:** Sunday through Saturday only
- **Room Selection:** Only available rooms can be selected
- **Recurring:** Currently books only the next occurrence of each day

## Future Enhancements

1. **Recurring Bookings:** Book for multiple weeks/months
2. **Conflict Detection:** Warn if room is already booked
3. **Bulk Operations:** Import routine from CSV/Excel
4. **Schedule Validation:** Check for room capacity and availability
5. **Email Notifications:** Notify teachers of assigned classes
6. **Routine Templates:** Save and reuse common schedules

## Troubleshooting

### Issue: "Please fill in all fields"
**Solution:** Ensure all fields (day, time, course, teacher, room) are filled before clicking "Add Entry"

### Issue: "Failed to update routine"
**Solution:** 
- Check if you're logged in as admin
- Verify room IDs are valid
- Check backend server is running

### Issue: Rooms not auto-booking
**Solution:**
- Verify system@admin.com user was created in database
- Check MongoDB connection
- Review schedule controller logs

### Issue: Times showing in wrong format
**Solution:** Use format `HH:MM - HH:MM` with spaces (e.g., `09:00 - 10:30`)

## Testing Commands

### Clear all routines (MongoDB)
```javascript
db.schedules.deleteMany({})
db.bookings.deleteMany({})
```

### Check schedule entries
```javascript
db.schedules.find().pretty()
```

### Check auto-bookings
```javascript
db.bookings.find({ user: ObjectId("...system_admin_id...") }).pretty()
```

## API Testing (Postman/cURL)

```bash
curl -X PUT http://localhost:5000/api/schedules/update-routine \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "routineData": [
      {
        "day": "Sunday",
        "time": "09:00 - 10:30",
        "course": "CSE101",
        "teacher": "Dr. Ahmed",
        "roomId": "ROOM_ID_HERE"
      }
    ]
  }'
```

---

**Last Updated:** December 3, 2025
**Feature Status:** ✅ Complete and Tested

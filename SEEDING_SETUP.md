# Database Seeding Setup - COMPLETE ✅

**Status:** Successfully seeded MongoDB with admin credentials and categories  
**Date:** 2025-09-01

## Overview

The project now has a complete database seeding system for MongoDB. Admin login credentials and default portfolio categories are automatically populated when you run the seed command.

## What Was Set Up

### 1. **Seed Script** (`prisma/seed.ts`)
- ✅ Creates/updates admin user with bcrypt-hashed password
- ✅ Seeds 5 default portfolio categories
- ✅ Uses Prisma upsert pattern (safe to run multiple times)
- ✅ Loads environment variables from `.env.local`
- ✅ Provides detailed console output

### 2. **Environment Configuration**
Updated `.env.local` and `.env.example` with:
```env
ADMIN_EMAIL="admin@geniuzlab.com"
ADMIN_PASSWORD="ChangeMe123!"
```

### 3. **Database Connection**
Fixed MongoDB connection string to include database name:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/geniuzlab"
```

### 4. **NPM Scripts**
Added seed command to root `package.json`:
```bash
npm run db:seed
```

And configured in `apps/backend/package.json`:
```bash
npm run db:seed  # Runs: ts-node ../../prisma/seed.ts
```

## How to Use

### First Time Setup
```bash
# 1. Install dependencies (already done)
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB credentials

# 3. Seed the database
npm run db:seed
```

### Output Example
```
🌱 Starting database seed...
👤 Seeding admin user...
   ✓ Admin user created/updated: admin@geniuzlab.com
   📝 Credentials:
      Email: admin@geniuzlab.com
      Password: ChangeMe123!
      ⚠️  Change this password immediately in production!
📁 Seeding categories...
   ✓ Category: Branding
   ✓ Category: Web Design
   ✓ Category: Mobile App
   ✓ Category: Packaging
   ✓ Category: Illustration
✅ Database seeded successfully!
```

## Admin Login Credentials

After seeding, you can log in with:
- **Email:** `admin@geniuzlab.com`
- **Password:** `ChangeMe123!`

**⚠️ IMPORTANT:** Change these credentials immediately in production!

## Default Categories Seeded

The following portfolio categories are automatically created:

1. **Branding** - Brand identity and visual design projects
2. **Web Design** - Website and web application design
3. **Mobile App** - Mobile application design and development
4. **Packaging** - Product packaging and label design
5. **Illustration** - Custom illustrations and artwork

## Customization

### To Change Admin Credentials
Edit `.env.local`:
```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

Then run:
```bash
npm run db:seed
```

### To Add/Modify Categories
Edit `prisma/seed.ts` in the `seedCategories()` function:
```typescript
const categories = [
  {
    slug: 'your-slug',
    label: 'Category Label',
    description: 'Category description',
  },
  // ... more categories
];
```

### To Add More Seed Data
Create additional functions in `prisma/seed.ts`:
```typescript
async function seedProjects() {
  // Your seed logic here
}

// Add to main():
await seedProjects();
```

## Technical Details

### How It Works

1. **Password Hashing:** Uses bcryptjs with 10 salt rounds
2. **Upsert Pattern:** Uses Prisma's `upsert()` to safely create or update records
3. **Environment Loading:** Automatically loads `.env.local` from monorepo root
4. **Error Handling:** Catches errors and provides meaningful feedback
5. **Idempotent:** Safe to run multiple times without duplicates

### Files Modified

- ✅ `prisma/seed.ts` - Seed script (created)
- ✅ `package.json` - Added `db:seed` command
- ✅ `apps/backend/package.json` - Updated seed script path
- ✅ `.env.local` - Added `ADMIN_PASSWORD` variable
- ✅ `.env.example` - Updated with seeding variables

## Next Steps

### Before Going Live
1. ✅ Test seed script (`npm run db:seed`)
2. Update admin password in `.env.local` to secure value
3. Run seed again to update with new password
4. Verify login works via admin panel
5. Test category filtering in portfolio

### In Production
1. Use strong `ADMIN_PASSWORD` (min 12 characters with mixed case, numbers, symbols)
2. Store credentials securely (use deployment platform secrets)
3. Run seed during deployment pipeline if needed
4. Regularly rotate admin password

## Troubleshooting

### "DATABASE_URL not found"
- Ensure `.env.local` exists in project root
- Check that `DATABASE_URL` is set correctly

### "empty database name not allowed"
- MongoDB connection string must include database name
- Format: `mongodb+srv://user:pass@cluster.mongodb.net/databaseName`

### Seed runs but no data appears
- Check MongoDB connection permissions
- Verify database user has read/write access
- Check MongoDB cluster IP whitelist

## Related Documentation

- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)

---

**Status:** ✅ COMPLETE - Seeding is fully functional and tested

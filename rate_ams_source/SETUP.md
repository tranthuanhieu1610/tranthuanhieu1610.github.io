# Quick Setup Guide for RateMyAms

Follow these steps to get RateMyAms up and running.

## Step 1: Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name it "RateMyAms" or similar
   - Disable Google Analytics (optional for MVP)

2. **Enable Firestore**
   - In your Firebase project, go to "Firestore Database"
   - Click "Create database"
   - Start in **test mode** (we'll secure it later)
   - Choose your closest region

3. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon `</>`
   - Register your app
   - Copy the config object

4. **Set Up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Paste your Firebase config values:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Seed the Database

Populate your Firestore with initial teacher data:

```bash
# Install tsx globally (if not already installed)
npm install -g tsx

# Or use npx
npx tsx scripts/seed-data.ts
```

You should see:
```
Added teacher: Nguyễn Văn Anh with ID: abc123
Added teacher: Trần Thị Bích with ID: def456
...
✅ Database seeded successfully!
Total teachers added: 12
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/rate-ams-teacher](http://localhost:3000/rate-ams-teacher)

## Step 5: Test the Application

1. **Home Page**: You should see the 12 seeded teachers
2. **Search**: Try searching for a teacher name
3. **Teacher Profile**: Click on a teacher to view their profile
4. **Submit Review**: Click "Rate a Teacher" and submit a test review
5. **Verify**: Check that the review appears on the teacher's profile and stats update

## Step 6: Set Up Firestore Security Rules

Once everything works, update your Firestore rules:

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teachers/{teacher} {
      allow read: if true;
      allow write: if false;
    }

    match /reviews/{review} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

3. Click "Publish"

## Step 7: Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` folder.

## Step 8: Deploy to GitHub Pages

1. Copy everything from `out/` to `/rate-ams-teacher/` in your main repository
2. Commit and push:
   ```bash
   git add .
   git commit -m "Deploy RateMyAms"
   git push
   ```

3. Your site will be live at:
   `https://tranthuanhieu1610.github.io/rate-ams-teacher`

## Troubleshooting

### "Firebase not initialized" error
- Check that `.env.local` exists and has correct values
- Restart the dev server after creating `.env.local`

### Teachers not loading
- Verify you ran the seed script
- Check Firestore console to see if teachers collection exists
- Check browser console for errors

### 404 on production
- Ensure `basePath` in `next.config.ts` matches your deployment path
- Make sure files are in the correct directory on GitHub Pages

### Reviews not submitting
- Check Firestore security rules allow create on reviews collection
- Check browser console for detailed error messages

## Next Steps

1. **Add More Teachers**: Edit `scripts/seed-data.ts` and run it again
2. **Customize Colors**: Edit `tailwind.config.ts`
3. **Add More Tags**: Edit `lib/types.ts` → `REVIEW_TAGS`
4. **Create Components**: Build reusable UI components in `components/`

## Need Help?

- Check the main README.md for detailed documentation
- Review Firebase Console for database issues
- Check browser DevTools console for errors

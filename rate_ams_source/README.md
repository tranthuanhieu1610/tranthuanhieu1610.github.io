# RateMyAms - Rate Your Teachers at Hanoi-Amsterdam High School

A Rate My Professors-style web application specifically designed for students at Hanoi-Amsterdam High School for the Gifted (Hanoi-Amsterdam High School) to rate and review their teachers.

## 🎯 Features

- **Teacher Directory**: Browse and search all teachers
- **Detailed Ratings**: Rate teachers on quality and difficulty
- **Student Reviews**: Read and write detailed reviews
- **Would Take Again**: See what percentage of students would take the teacher again
- **Tag System**: Quick insights with tags like "Engaging", "Tough grader", "Helpful", etc.
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Database**: Firebase Firestore
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- Firebase project set up
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
cd rate_ams_source
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase configuration details

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000/rate-ams-teacher](http://localhost:3000/rate-ams-teacher) in your browser

## 🗄️ Database Setup

### Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Set up the following collections:
   - `teachers` - Stores teacher information
   - `reviews` - Stores student reviews

### Seeding Initial Data

To populate your database with sample teachers:

```bash
# Make sure you have tsx installed globally or use npx
npx tsx scripts/seed-data.ts
```

This will create initial teacher entries in your Firestore database.

## 📁 Project Structure

```
rate_ams_source/
├── app/
│   ├── page.tsx                    # Home page with teacher search
│   ├── layout.tsx                  # Root layout with header/footer
│   ├── globals.css                 # Global styles
│   ├── teacher/
│   │   └── [id]/
│   │       └── page.tsx            # Teacher profile page
│   └── submit-review/
│       └── page.tsx                # Review submission form
├── components/                     # Reusable UI components (future)
├── lib/
│   ├── firebase.ts                 # Firebase initialization
│   ├── firebase-utils.ts           # Firestore CRUD functions
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # Utility functions
├── scripts/
│   └── seed-data.ts                # Database seeding script
├── public/                         # Static assets
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── package.json                    # Dependencies
```

## 🎨 Color Scheme

The rating system uses color-coding similar to RateMyProfessors:

- **Green** (#4CAF50): 4.0-5.0 (Excellent)
- **Light Green** (#8BC34A): 3.5-3.9 (Good)
- **Yellow** (#FFC107): 2.5-3.4 (Average)
- **Orange** (#FF9800): 2.0-2.4 (Poor)
- **Red** (#F44336): 1.0-1.9 (Bad)

## 📝 Available Tags

Students can tag reviews with descriptive labels:
- Gives lots of homework
- Engaging
- Strict
- Helpful
- Clear explanations
- Tough grader
- Caring
- Accessible outside class
- Inspiring
- Skip class? You won't pass
- Amazing lectures
- Participation matters
- Get ready to read
- Test heavy
- Group projects

## 🔧 Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

This will create an optimized static export in the `out/` directory.

### Linting

```bash
npm run lint
```

## 🚢 Deployment

The app is configured for GitHub Pages deployment:

1. Build the project:
```bash
npm run build
```

2. Copy the contents of the `out/` folder to `/rate-ams-teacher/` in your GitHub Pages repository

3. The site will be available at: `https://yourusername.github.io/rate-ams-teacher`

## 🔐 Firebase Security Rules

Remember to set up appropriate Firestore security rules. For the MVP without authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all teachers and reviews
    match /teachers/{teacher} {
      allow read: if true;
      allow write: if false; // Only allow writes through admin/seed scripts
    }

    match /reviews/{review} {
      allow read: if true;
      allow create: if true; // Allow anyone to create reviews
      allow update, delete: if false; // Prevent editing/deleting
    }
  }
}
```

## 📊 Data Models

### Teacher
```typescript
interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: string;
  avgRating: number;
  avgDifficulty: number;
  wouldTakeAgain: number; // Percentage (0-100)
  totalReviews: number;
  createdAt: Date;
}
```

### Review
```typescript
interface Review {
  id: string;
  teacherId: string;
  rating: number; // 1-5
  difficulty: number; // 1-5
  wouldTakeAgain: boolean;
  course: string;
  tags: string[];
  comment: string;
  timestamp: Date;
}
```

## 🤝 Contributing

This is a student project for Hanoi-Amsterdam High School. If you're a student and want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Disclaimer

All reviews are anonymous and reflect individual student opinions. This platform is for educational purposes to help students make informed decisions about their class selections.

## 📄 License

This project is for educational use at Hanoi-Amsterdam High School for the Gifted.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the Firebase console for database errors
2. Review the browser console for client-side errors
3. Ensure all environment variables are properly set

## 🎓 Credits

Built with inspiration from RateMyProfessors.com, adapted for Hanoi-Amsterdam High School for the Gifted students.

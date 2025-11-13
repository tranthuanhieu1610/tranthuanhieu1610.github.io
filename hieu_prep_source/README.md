# HieuPrep - Digital SAT Question Bank

Your ultimate FREE Digital SAT Question Bank and practice platform.

## 🚀 Features

- **13,000+ Questions**: Access thousands of official and high-quality SAT practice questions
- **Adaptive Practice**: Smart filtering by topic, difficulty, and question type
- **Progress Tracking**: Detailed analytics and insights
- **Full-Length Tests**: Timed practice tests with instant scoring
- **Instant Feedback**: Explanations for every question
- **Built-in Desmos**: Integrated calculator just like the real Digital SAT

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000/hieu_prep](http://localhost:3000/hieu_prep) with your browser to see the result.

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Copy `.env.local.example` to `.env.local` and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }

    match /tests/{testId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }

    match /user_progress/{progressId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📁 Project Structure

```
hieu_prep/
├── app/                    # Next.js App Router pages
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configs
│   ├── firebase.ts       # Firebase configuration
│   ├── auth.ts           # Authentication helpers
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── store/                # State management
└── public/               # Static assets
```

## 🎨 SAT Markdown Format (For Admins)

When creating questions, use this format:

```markdown
---
type: math_calc
difficulty: medium
tags: [algebra, linear-equations]
desmos: true
source: Official SAT Practice Test 1
---

::question
What is the solution to the equation $3x + 5 = 20$?
::

::options
A) $x = 3$
B) $x = 5$
C) $x = 7$
D) $x = 15$
::

::answer
B
::

::explanation
Subtract 5 from both sides: $3x = 15$
Divide by 3: $x = 5$
::
```

## 🚢 Deployment

The project is configured for GitHub Pages deployment with base path `/hieu_prep`.

```bash
# Build and export
npm run build

# The output will be in the 'out' directory
```

## 📋 Development Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Next.js setup with TypeScript
- [x] Tailwind CSS & shadcn/ui configuration
- [x] Firebase integration
- [x] Basic layout (Header, Footer)
- [x] Routing structure
- [x] GitHub Pages configuration

### 🔄 Phase 2: Authentication (Next)
- [ ] Login/Register forms
- [ ] Firebase authentication
- [ ] Protected routes
- [ ] User profile

### 📝 Phase 3: Admin Portal
- [ ] Markdown question editor
- [ ] Question management (CRUD)
- [ ] Test builder
- [ ] Analytics dashboard

### 👨‍🎓 Phase 4: User Interface
- [ ] Question bank browser
- [ ] Practice mode
- [ ] Progress tracking
- [ ] Bookmarks

### 🧪 Phase 5: Test Interface
- [ ] Test taking UI
- [ ] Desmos calculator integration
- [ ] Annotation tools
- [ ] Timer and scoring

## 📄 License

MIT License - feel free to use this project for your own learning!

## 👨‍💻 Author

**Tran Thuan Hieu**

- GitHub: [@tranthuanhieu1610](https://github.com/tranthuanhieu1610)
- Website: [tranthuanhieu1610.github.io](https://tranthuanhieu1610.github.io)

---

Made with ❤️ for students preparing for the Digital SAT

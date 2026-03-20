# Zuupah App - Technical Architecture

## Overview

The Zuupah app is built on a modern React Native stack with TypeScript for type safety, Firebase for backend services, and Zustand for state management. The architecture follows clean code principles with clear separation of concerns.

## Technology Stack

### Frontend
- **React Native** 0.73+ - Cross-platform mobile framework
- **TypeScript** 5.3 - Type-safe JavaScript
- **React Navigation** 6.x - Navigation library
- **Zustand** 4.x - Lightweight state management
- **React Native Vector Icons** - Icon library

### Backend & Services
- **Firebase Authentication** - User identity management
- **Firestore** - NoSQL database for app data
- **Firebase Storage** - File storage for books and media
- **React Native BLE PLX** - Bluetooth Low Energy communication
- **Axios** - HTTP client for API calls

### Development Tools
- **Babel** - JavaScript transpiler
- **Metro** - React Native bundler
- **Jest** - Testing framework
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         UI Layer (Screens)              │
│  ┌──────────┐  ┌──────────┐ ┌────────┐ │
│  │  Store   │  │ Library  │ │  Pen   │ │
│  └──────────┘  └──────────┘ └────────┘ │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Components Layer (Reusable)         │
│  BookCard │ Button │ Card │ Spinner    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│       Hooks Layer (Business Logic)      │
│  useAuth │ useBooks │ useBluetooth     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│    State Management (Zustand Stores)   │
│  authStore │ bookStore │ penStore      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Services Layer (External APIs)     │
│  Firebase │ BLE │ Storage │ Networking │
└─────────────────────────────────────────┘
```

## Core Components

### 1. State Management (Zustand)

#### AuthStore
Manages user authentication state and operations:
```typescript
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp(...): Promise<void>;
  signIn(...): Promise<void>;
  signOut(): Promise<void>;
  // ...
}
```

#### BookStore
Manages book catalog and user library:
```typescript
interface BookStore {
  books: Book[];
  libraryBooks: BookLibraryItem[];
  downloads: Map<string, BookDownload>;

  // Actions
  fetchBooks(): Promise<void>;
  addToLibrary(book: Book): void;
  startDownload(bookId: string): void;
  // ...
}
```

#### PenStore
Manages Bluetooth pen connection and transfers:
```typescript
interface PenStore {
  connectedPen: Pen | null;
  connectionStatus: PenConnectionStatus;
  transferProgress: Map<string, PenTransferProgress>;

  // Actions
  connectToPen(deviceId: string): Promise<void>;
  startTransfer(bookId: string): void;
  // ...
}
```

### 2. Service Layer

#### Firebase Services
- **auth.ts** - User authentication (login, register, password reset)
- **books.ts** - Firestore queries for book catalog
- **storage.ts** - File upload/download operations
- **config.ts** - Firebase initialization

#### Bluetooth Services
- **BleManager.ts** - Device scanning and connection
- **PenProtocol.ts** - Command serialization and response handling

### 3. Custom Hooks

Hooks bridge the UI and state management, providing clean API for components:

```typescript
// useAuth.ts
const { user, handleSignIn, handleSignUp } = useAuth();

// useBooks.ts
const { books, handleDownload, libraryBooks } = useBooks();

// useBluetooth.ts
const { connectedPen, handleConnectToPen, transferProgress } = useBluetooth();
```

### 4. UI Components

Organized by functionality:

**Common Components** (`src/components/common/`)
- `Button.tsx` - Styled button with variants
- `Card.tsx` - Container with shadow and radius
- `LoadingSpinner.tsx` - Activity indicator

**Feature Components** (`src/components/`)
- `BookCard.tsx` - Book display with actions
- `PenConnectionBanner.tsx` - Connection status display
- `CategoryChip.tsx` - Selectable category filter

### 5. Navigation Structure

```
AppNavigator (conditionally shows Auth or Main)
  ├── AuthNavigator (stack)
  │   ├── LoginScreen
  │   ├── RegisterScreen
  │   └── ForgotPasswordScreen
  │
  └── MainTabNavigator (tabs)
      ├── Store (stack)
      │   ├── StoreScreen
      │   └── BookDetailScreen
      ├── Library
      ├── Pen (stack)
      │   ├── PenScreen
      │   └── FirmwareUpdateScreen
      └── Profile
```

## Data Flow

### Authentication Flow
```
LoginScreen
  → useAuth().handleSignIn()
    → authStore.signIn()
      → authService.signIn()
        → Firebase Auth
          → Update authStore
            → Navigation switches to MainApp
```

### Book Download Flow
```
BookCard.onDownload()
  → useBooks().handleStartDownload()
    → bookStore.startDownload()
      → bookStore.updateProgress() (during transfer)
        → useBooks() updates UI
          → BookCard shows progress
            → bookStore.completeDownload()
```

### Bluetooth Transfer Flow
```
PenScreen.handleStartTransfer()
  → useBluetooth().handleStartTransfer()
    → penStore.startTransfer()
      → PenProtocol.startTransfer()
        → BleManager.writeCharacteristic()
          → penStore.updateTransferProgress()
            → PenScreen shows progress bar
              → PenProtocol.endTransfer()
                → penStore.completeTransfer()
```

## Type System

All code uses TypeScript with strict mode. Key type files:

- `src/types/book.ts` - Book, BookDownload, BookLibraryItem
- `src/types/pen.ts` - Pen, PenStatus, PenTransferProgress
- `src/types/user.ts` - User, AuthState, UserProfile

## State Immutability

Zustand is configured to prevent unintended mutations:
```typescript
// Good - creates new object
set(state => ({
  user: { ...state.user, displayName: newName }
}));

// Good - updates array properly
set(state => ({
  books: [...state.books, newBook]
}));
```

## Error Handling

Multi-level error handling strategy:

1. **Service Layer**: Catches API/BLE errors, converts to user-friendly messages
2. **Store Layer**: Captures errors in state, provides error context
3. **Hook Layer**: Propagates errors to components
4. **Component Layer**: Displays error UI or shows toast

```typescript
// Example: Firebase auth error conversion
const handleAuthError = (error: any): Error => {
  switch (error.code) {
    case 'auth/user-not-found':
      return new Error('User not found. Please check your email.');
    case 'auth/wrong-password':
      return new Error('Incorrect password. Please try again.');
    // ...
  }
};
```

## Firebase Integration

### Firestore Indexes
Required composite indexes:
- books: (ageMin, ageMax, category)
- books: (price, isFree, language)

### Real-time Subscriptions
Currently uses one-time queries. Can be upgraded to real-time listeners:
```typescript
// Future enhancement
const unsubscribe = db.collection('books')
  .onSnapshot(snapshot => {
    // Update store
  });
```

### Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /books/{bookId} {
      allow read: if true;
    }
    match /firmwareVersions/{versionId} {
      allow read: if true;
    }
  }
}
```

## Bluetooth Protocol

### Command Format
Commands are serialized to: `[commandId]:[payload]`

**Command IDs:**
- 0x01: TRANSFER_START
- 0x02: TRANSFER_DATA
- 0x03: TRANSFER_END
- 0x04: GET_STATUS
- 0x05: GET_BATTERY
- 0x06: GET_VERSION
- 0x07: GET_STORAGE
- 0x08: DELETE_BOOK
- 0x09: RESET

### Response Handling
Pen sends responses asynchronously via notify characteristic.
PenProtocol decodes and resolves pending promises.

## Performance Optimization

### Code Splitting
Navigation automatically code-splits screens via React Navigation.

### Memoization
Using React.useMemo for expensive computations:
```typescript
const filteredBooks = useMemo(
  () => books.filter(/* complex filter */),
  [books, filters]
);
```

### Image Optimization
- Use proper image dimensions
- Implement lazy loading for book covers
- Cache images with react-native-fs

### Network Optimization
- Batch Firestore queries (max 10 at a time)
- Implement pagination for book lists
- Use compression for book transfers

## Testing Strategy

### Unit Tests
Test individual functions and hooks:
```typescript
// hooks/__tests__/useAuth.test.ts
test('handleSignIn should update auth state', async () => {
  // Test logic
});
```

### Integration Tests
Test store interactions and service calls:
```typescript
// store/__tests__/authStore.test.ts
test('signIn updates user and auth status', async () => {
  // Test complete flow
});
```

### Component Tests
Test UI components with React Native Testing Library:
```typescript
// components/__tests__/Button.test.tsx
test('Button renders with title and calls onPress', () => {
  // Test rendering and interactions
});
```

## Deployment

### Build Process
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Test
npm test

# Build
npm run build:android
npm run build:ios
```

### Environment Management
- Development: `.env` (local Firebase project)
- Staging: `.env.staging` (staging Firebase project)
- Production: `.env.production` (production Firebase project)

### CI/CD Pipeline
GitHub Actions workflow:
1. Run tests on PR
2. Lint code
3. Type check
4. Build Android and iOS
5. Deploy to TestFlight/Play Store on merge to main

## Future Enhancements

1. **Offline Support**: Implement data sync with react-native-realm
2. **Analytics**: Add Firebase Analytics for user behavior tracking
3. **Localization**: Support multiple languages with i18n
4. **Performance**: Implement Redux for larger state
5. **Testing**: Add E2E tests with Detox
6. **CI/CD**: Auto-deploy to app stores

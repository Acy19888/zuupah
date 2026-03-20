# Zuupah Scripts

## 🌱 Firestore Seed Script

Populates your Firestore database with sample books, categories and firmware versions.

### Setup (2 minutes)

**Step 1 — Get your Service Account Key:**
1. Go to [Firebase Console](https://console.firebase.google.com/project/zuupah-77bbc/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Download the JSON file
4. Rename it to `serviceAccountKey.json`
5. Place it in this `scripts/` folder

**Step 2 — Install dependency:**
```bash
cd scripts
npm init -y
npm install firebase-admin
```

**Step 3 — Run the seed:**
```bash
node seedFirestore.js
```

### What gets seeded

| Collection | Documents | Details |
|---|---|---|
| `books` | 10 | Farm Friends (free), Jungle Adventure, My First ABC (free), Ocean Wonders, Goodnight Star, Zuu the Dragon, Hello Space!, My Amazing Body, Count with Me!, Sing Along! |
| `categories` | 7 | All, Animals, ABC, Numbers, Stories, Science, Music |
| `firmwareVersions` | 3 | v1.0.0, v1.1.0, v1.2.0 (latest) |

### ⚠️ Important
- `serviceAccountKey.json` is in `.gitignore` — never commit it!
- Run seed only once, or add `--force` flag to overwrite existing data
- Test mode Firestore rules allow all reads/writes for 30 days

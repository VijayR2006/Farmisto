# Farmisto backend

## Required configuration

Copy `.env.example` to `.env` and configure `MONGO_URI` and a unique `JWT_SECRET`. Use a randomly generated secret with at least 32 characters; set the same secret in the backend environment for the deployment you are running. Keep `.env` out of version control. Cloudinary settings remain optional for API startup and are required for image uploads.

## User-data reset

`npm run reset:user-data` connects to the configured MongoDB and reports a dry-run count. To apply the reset, use:

```sh
npm run reset:user-data -- --confirm-reset
```

The confirmation run deletes records from the shared user, legacy farmer, cart, order, promo-code, and feedback collections. It anonymizes seller labels and email addresses on existing market entries but preserves each market product document and its item ID, name, image, price, category, type, quantity, and unit. The operation uses a MongoDB transaction; the database must support transactions. Take a backup before confirming a reset.

The current application has no review/rating collection. Feedback submissions are stored against the authenticated farmer account; the reset removes feedback created before the clean start. The homepage and nearby-farmer pages no longer present hard-coded sample reviews/ratings.

## Optional demo farmers

To add the three fictional demo accounts, set unique passwords of at least 12 characters in `DEMO_FARMER_ONE_PASSWORD`, `DEMO_FARMER_TWO_PASSWORD`, and `DEMO_FARMER_THREE_PASSWORD`, then run:

```sh
npm run seed:farmers -- --confirm-demo-seed
```

The seed contains no phone numbers, addresses, or payment details. Each password is hashed before it is stored. Do not use demo credentials in production.

# Donation App — Advanced Backend

Node.js + Express + MongoDB backend for a donation platform with Stripe & Razorpay integration.

## Features

- User registration & login with JWT auth
- Create donations with chosen provider (Stripe or Razorpay)
- Stripe PaymentIntent flow
- Razorpay Order creation flow
- Webhook endpoints to update donation status
- Clean structure for jobs/portfolio

## Getting Started

```bash
cp .env
npm install
npm run dev
```

Then:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/donations` (Bearer token required)
- `GET  /api/donations`
- `POST /api/webhooks/stripe`
- `POST /api/webhooks/razorpay`

# Environment Variables

## Required Environment Variables

### Database
```env
MONGODB_URI=mongodb://localhost:27017/easevote
# OR
MONGO_URI=mongodb://localhost:27017/easevote
```

### JWT Authentication
```env
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend URL
```env
FRONTEND_URL=http://localhost:3000
```

### Email Service (Resend)
```env
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@easevote.com
```

### Payment Gateways

#### Paystack
```env
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
```

#### Flutterwave
```env
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your-flutterwave-secret-key
FLUTTERWAVE_SECRET_HASH=your-flutterwave-webhook-hash
```

#### AppsMobile
```env
APPS_MOBILE_CLIENT_ID=your-appsmobile-client-id
APPS_MOBILE_CLIENT_SECRET=your-appsmobile-client-secret
APPS_MOBILE_SERVICE_ID=your-appsmobile-service-id
```

### SMS Providers

#### SMS Provider Selection
```env
SMS_PROVIDER=nalo
# Options: termii, nalo
```

#### Termii SMS
```env
TERMII_API_KEY=your-termii-api-key
TERMII_SENDER_ID=YourSenderID
```

#### Nalo SMS
```env
NALO_USERNAME=your-nalo-username
NALO_PASSWORD=your-nalo-password
NALO_SENDER_ID=YourSenderID
```

### USSD Service

**Note:** USSD provider and payment gateway are managed via database settings through API endpoints (Super Admin only).

**Default Settings:**
- USSD Provider: `nalo`
- USSD Payment Gateway: `appsmobile`

**API Endpoints:**
```
PUT /api/admin/settings
Body: { "key": "ussd_provider", "value": "nalo" }

PUT /api/admin/settings  
Body: { "key": "ussd_payment_gateway", "value": "appsmobile" }

GET /api/admin/settings
GET /api/admin/settings/:key
```

### File Upload (Cloudinary)
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Server Configuration
```env
PORT=5000
NODE_ENV=development
```

## Sample .env File

```env
# Database
MONGODB_URI=mongodb://localhost:27017/easevote

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Email
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=noreply@easevote.com

# Payment - Paystack (Default)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key

# SMS - Nalo (Default)
SMS_PROVIDER=nalo
NALO_USERNAME=your_nalo_username
NALO_PASSWORD=your_nalo_password
NALO_SENDER_ID=EaseVote

# Note: USSD settings are managed via database/API

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Server
PORT=5000
NODE_ENV=development
```
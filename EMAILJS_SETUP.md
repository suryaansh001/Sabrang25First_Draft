# EmailJS Setup Guide for Sabrang 2025 Forms

This guide will help you set up EmailJS to send emails directly from the frontend for both sponsorship inquiries and general contact queries.

## Overview

We have **two separate forms** with **different EmailJS configurations**:
1. **Sponsorship Form** (Why Sponsor Us page) - For partnership inquiries
2. **Contact Form** (Contact page) - For general queries

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Set Up Email Services

You'll need **TWO separate email services** for better organization:

### Service 1: Sponsorship Inquiries
1. In your EmailJS dashboard, click **"Add New Service"**
2. Choose your email provider (Gmail recommended)
3. Name it something like "Sabrang Sponsorship"
4. **Copy your Service ID** (e.g., `service_sponsor123`)

### Service 2: Contact Queries  
1. Add another service for contact queries
2. You can use the same email provider or a different one
3. Name it something like "Sabrang Contact"
4. **Copy your Service ID** (e.g., `service_contact456`)

## 3. Create Email Templates

You'll need **TWO separate templates**:

### Template 1: Sponsorship Inquiry Template
1. Go to **"Email Templates"** → **"Create New Template"**
2. Name: "Sponsorship Inquiry"

**Template Content:**
```
Subject: 🎯 New Sponsorship Inquiry from {{company_name}} - Sabrang 2025

From: {{contact_person}} <{{from_email}}>
To: {{to_email}}

---

## NEW SPONSORSHIP INQUIRY - SABRANG 2025

**Company:** {{company_name}}
**Contact Person:** {{contact_person}}
**Email:** {{from_email}}
**Phone:** {{phone}}
**Sponsorship Amount:** {{sponsorship_amount}}
**Preferred Call Time:** {{preferred_timing}}

**Submitted on:** {{submission_date}}

---

This inquiry was submitted through the Sabrang 2025 "Why Sponsor Us" page.
Please respond to {{from_email}} or call {{phone}}.
```

3. **Copy your Template ID** (e.g., `template_sponsor123`)

### Template 2: Contact Query Template
1. Create another template for contact queries
2. Name: "Contact Query"

**Template Content:**
```
Subject: 📩 New Contact Query - Sabrang 2025

From: {{from_name}} <{{from_email}}>
To: {{to_email}}

---

## NEW CONTACT QUERY - SABRANG 2025

**Name:** {{from_name}}
**Email:** {{from_email}}
**Phone:** {{phone}}

**Query:**
{{query}}

**Submitted on:** {{submission_date}}

---

This query was submitted through the Sabrang 2025 Contact page.
Please respond to {{from_email}} or call {{phone}}.
```

3. **Copy your Template ID** (e.g., `template_contact456`)

## 4. Get Public Keys

You can use **ONE public key** for both forms, or create separate ones:

### Option A: Single Public Key (Recommended)
1. Go to **"Account"** → **"General"**
2. Find your **Public Key** 
3. Copy it (e.g., `user_1234567890abcdef`)
4. Use this for both forms

### Option B: Separate Public Keys
1. Create separate EmailJS accounts if you want completely isolated systems
2. Get separate public keys for each

## 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your EmailJS credentials in `.env.local`:
   ```env
   # SPONSORSHIP FORM CONFIGURATION
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_sponsor123
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_sponsor123
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_1234567890abcdef
   NEXT_PUBLIC_RECIPIENT_EMAIL=partnerships@sabrang.com

   # CONTACT FORM CONFIGURATION
   NEXT_PUBLIC_EMAILJS_CONTACT_SERVICE_ID=service_contact456
   NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID=template_contact456
   NEXT_PUBLIC_EMAILJS_CONTACT_PUBLIC_KEY=user_1234567890abcdef
   NEXT_PUBLIC_CONTACT_RECIPIENT_EMAIL=info@sabrang.com
   ```

## 6. Test Both Forms

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. **Test Sponsorship Form:**
   - Go to `/why-sponsor-us`
   - Click "Become a Partner"
   - Fill out and submit the form
   - Check `partnerships@sabrang.com`

3. **Test Contact Form:**
   - Go to `/Contact`
   - Click "Send us a Message"
   - Fill out and submit the form
   - Check `info@sabrang.com`

## 7. Form Validation Features

### Sponsorship Form:
- ✅ Company Name (required)
- ✅ Contact Person (required)
- ✅ Email (required, validated)
- ✅ Phone (required)
- ✅ Sponsorship Amount (optional, number)
- ✅ Preferred Call Time (optional, dropdown)

### Contact Form:
- ✅ Full Name (required)
- ✅ Email (required, validated with regex)
- ✅ Phone (required, validated with regex)
- ✅ Query (required, textarea)
- ⚠️ **Important notice** about valid contact details

## 8. EmailJS Free Tier Limits

- **200 emails/month** total across all services
- **50 emails/day** maximum
- **2 email services** max (perfect for our 2 forms)
- **3 email templates** max

## 9. Template Variables

### Sponsorship Form Variables:
- `{{company_name}}` - Company Name
- `{{contact_person}}` - Contact Person
- `{{from_email}}` - Email Address
- `{{phone}}` - Phone Number
- `{{sponsorship_amount}}` - Sponsorship Amount (formatted)
- `{{preferred_timing}}` - Preferred Call Time
- `{{to_email}}` - Recipient Email
- `{{submission_date}}` - Submission Date/Time

### Contact Form Variables:
- `{{from_name}}` - Full Name
- `{{from_email}}` - Email Address
- `{{phone}}` - Phone Number
- `{{query}}` - User's Query
- `{{to_email}}` - Recipient Email
- `{{submission_date}}` - Submission Date/Time

## 10. Best Practices

### Email Organization:
- **Sponsorship emails** → `partnerships@sabrang.com`
- **General queries** → `info@sabrang.com` or main contact
- Use **different subject prefixes** (🎯 vs 📩) for easy filtering

### Validation:
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Phone regex: `/^[0-9+\-\s()]{10,15}$/`
- All forms show clear validation messages

### User Experience:
- ✅ Loading states while sending
- ✅ Success/error messages
- ✅ Form resets after success
- ✅ Modal closes automatically
- ✅ Validation warnings prominently displayed

## 11. Troubleshooting

### Common Issues:
1. **Different errors for different forms**: Check service/template IDs
2. **Emails going to wrong address**: Verify recipient email variables
3. **Template variables not working**: Ensure variable names match exactly

### Debug Mode:
```javascript
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '', {
  debug: true
});
```

---

For more help, visit the [EmailJS Documentation](https://www.emailjs.com/docs/)

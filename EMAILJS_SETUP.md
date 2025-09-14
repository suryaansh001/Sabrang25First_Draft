# EmailJS Setup Guide for Sabrang 2025 Sponsorship Form

This guide will help you set up EmailJS to send sponsorship inquiry emails directly from the frontend.

## 1. Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## 2. Add Email Service

1. In your EmailJS dashboard, click **"Add New Service"**
2. Choose your email provider (Gmail recommended):
   - **Gmail**: Easy setup, good for testing
   - **Outlook**: If you prefer Microsoft
   - **Custom SMTP**: For custom domains
3. Follow the setup instructions for your chosen provider
4. **Copy your Service ID** (e.g., `service_1234567`)

## 3. Create Email Template

1. Go to **"Email Templates"** in your dashboard
2. Click **"Create New Template"**
3. Use this template structure:

### Template Content:
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

4. **Copy your Template ID** (e.g., `template_1234567`)

## 4. Get Public Key

1. Go to **"Account"** → **"General"**
2. Find your **Public Key** 
3. Copy it (e.g., `user_1234567890abcdef`)

## 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your EmailJS credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_1234567
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_1234567
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=user_1234567890abcdef
   NEXT_PUBLIC_RECIPIENT_EMAIL=partnerships@sabrang.com
   ```

## 6. Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to the "Why Sponsor Us" page
3. Fill out the partnership form
4. Submit and check your email

## 7. EmailJS Free Tier Limits

- **200 emails/month** on free plan
- **50 emails/day** maximum
- **2 email services** max
- **3 email templates** max

For production, consider upgrading to a paid plan if you expect more inquiries.

## 8. Template Variables Used

The form sends these variables to your EmailJS template:

- `{{company_name}}` - Company Name
- `{{contact_person}}` - Contact Person
- `{{from_email}}` - Email Address
- `{{phone}}` - Phone Number
- `{{sponsorship_amount}}` - Sponsorship Amount (formatted)
- `{{preferred_timing}}` - Preferred Call Time
- `{{to_email}}` - Recipient Email
- `{{submission_date}}` - Submission Date/Time

## 9. Troubleshooting

### Common Issues:
1. **403 Forbidden**: Check your Public Key
2. **Template not found**: Verify Template ID
3. **Service not found**: Verify Service ID
4. **CORS errors**: Make sure you're using the browser SDK

### Debug Mode:
Add this to see EmailJS errors in console:
```javascript
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '', {
  debug: true
});
```

## 10. Security Note

✅ **Safe to use in frontend**: EmailJS is designed for client-side use
✅ **No credentials exposed**: Your email password is not in the code
✅ **Rate limiting**: EmailJS provides built-in protection
✅ **Spam protection**: EmailJS has anti-spam measures

---

For more help, visit the [EmailJS Documentation](https://www.emailjs.com/docs/)

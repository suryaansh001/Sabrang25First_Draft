# Instagram Visitor Tracking with Plausible Analytics

This setup allows you to track visitors coming from Instagram to your Sabrang 2025 website using Plausible Analytics and the `next-plausible` package.

## What's Installed

1. **PlausibleProvider**: Wraps your entire app in `layout.tsx`
2. **PlausibleTracker**: Automatically detects Instagram visitors
3. **Instagram Tracking Hooks**: Custom functions for tracking Instagram-specific events

## How It Works

### Automatic Instagram Detection

The `PlausibleTracker` component automatically detects visitors from Instagram in two ways:

1. **Direct Instagram Traffic**: Detects when `document.referrer` contains `instagram.com` or `ig.me`
2. **Campaign Traffic**: Detects UTM parameters like `?utm_source=instagram`

### Events Tracked Automatically

- **Instagram Visitor**: When someone visits directly from Instagram
- **Instagram Campaign Visitor**: When someone visits from an Instagram campaign with UTM parameters

## Using Instagram Tracking in Your Components

### Import the Hook
```tsx
import { useInstagramTracking } from '../components/PlausibleTracker';
```

### Track Instagram-Specific Actions
```tsx
const { trackInstagramClick, trackSocialShare, trackRegistrationFromInstagram } = useInstagramTracking();

// Track when someone clicks your Instagram profile link
trackInstagramClick('Profile Link Clicked', {
  location: 'footer',
  page: '/events'
});

// Track when someone registers after coming from Instagram
trackRegistrationFromInstagram('Cultural Night');

// Track social sharing
trackSocialShare('Instagram', 'Event Registration');
```

## Setting Up Instagram Campaign Tracking

### 1. Create UTM Links for Instagram Posts

When sharing your website on Instagram, use UTM parameters:

```
https://sabrang.jklu.edu.in/?utm_source=instagram&utm_medium=social&utm_campaign=cultural_night
```

### 2. Example UTM Parameters for Different Posts

- **Story promotion**: `?utm_source=instagram&utm_medium=story&utm_campaign=early_bird`
- **Feed post**: `?utm_source=instagram&utm_medium=post&utm_campaign=main_event`
- **Bio link**: `?utm_source=instagram&utm_medium=bio&utm_campaign=registration`

## Viewing Analytics Data

In your Plausible dashboard (https://plausible.io), you'll see:

### Events Tab
- **Instagram Visitor**: Direct traffic from Instagram
- **Instagram Campaign Visitor**: UTM campaign traffic
- **Instagram Action**: Clicks on Instagram-related buttons
- **Social Share**: When users share content
- **Registration from Instagram**: Event registrations from Instagram visitors

### Sources Tab
- **Instagram**: Direct referral traffic
- **Instagram Campaign**: UTM campaign traffic

### Custom Properties
Each event includes additional data like:
- `source`: Where the visitor came from
- `campaign`: UTM campaign name
- `action`: What action was taken
- `eventType`: Type of event registered for

## Example Usage in Components

Check `components/InstagramButton.tsx` for a complete example of how to implement Instagram tracking in your components.

## Important Notes

1. **Client-side Only**: All tracking components must use `'use client'` directive
2. **Privacy-friendly**: Plausible is GDPR-compliant and doesn't use cookies
3. **Real-time Data**: View visitor data in real-time on your Plausible dashboard
4. **UTM Tracking**: Use UTM parameters in your Instagram posts for detailed campaign tracking

## Next Steps

1. Add the `InstagramButton` component to pages where you want to track Instagram interactions
2. Create UTM links for your Instagram campaigns
3. Monitor your Plausible dashboard to see Instagram visitor data
4. Use the tracking data to optimize your Instagram marketing strategy
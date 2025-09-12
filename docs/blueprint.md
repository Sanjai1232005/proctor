# **App Name**: Guardian View

## Core Features:

- Dual Camera Feed: Display simultaneous video streams from the laptop webcam and the mobile phone camera using a QR code linked to the URL 'https://your-exam-platform.com/mobile-camera-access'.
- Camera Permission Handling: Request camera access on entry and show error messages if permission is denied.
- QR Code Generation: Dynamically generate QR codes for mobile camera stream access based on 'VITE_PHONE_CAMERA_URL' in the '.env' file.
- Fullscreen Exam Mode: Implement a tool that attempts to force fullscreen mode during exams, logs if the user switches tabs, and warns the user if they exit.
- Status Panel: Display the status of the connection to the cameras and other errors.
- Basic Authentication: Implement a simple login page with username and password, no backend required.
- Mobile-Friendly Design: Ensure responsive layout for both desktop and mobile screens.

## Style Guidelines:

- Primary color: Dark navy blue (#3B5998), evoking a sense of trust.
- Background color: Very light gray (#F0F2F5), a softened variation on the primary, offering comfortable contrast without harshness.
- Accent color: A muted purple (#8A6CBC), analogous to navy, adding sophistication to key interactive elements.
- Body text: 'PT Sans', sans-serif for a warm, modern feel and readability.
- Headline text: 'Playfair', serif for a sophisticated, elegant feel in the title and headers.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use a clean, minimalist layout to reduce distractions.
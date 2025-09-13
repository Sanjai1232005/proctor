## 📌 Project Overview  
This project is an *AI-driven online examination platform* designed to prevent cheating during online assessments.  

We integrate *dual-camera monitoring* (Laptop + Mobile) along with *full-screen monitoring, tab-switch detection, and AI-based facial & room analysis* to ensure fairness and authenticity in remote examinations.  

---

## 🎯 Problem Statement  
- Increasing shift to online exams has led to *widespread cheating*.  
- Traditional proctoring solutions are *costly* and often *ineffective*.  
- Need for an *automated, scalable, and affordable* solution that ensures exam integrity.  

---

## 💡 Our Solution  
1. *Laptop Camera Monitoring*  
   - Tracks head pose & gaze using *MediaPipe Face Mesh*.  
   - Detects abnormal eye/head movement (e.g., looking sideways repeatedly).  

2. *Mobile Camera Monitoring (via QR code)*  
   - Students scan a QR code to activate phone camera.  
   - Phone is placed *1.5m–3m away* to capture a room-wide view.  
   - *YOLOv8 detection* ensures only one student is present.  

3. *Full-Screen Mode Enforcement*  
   - Students must take exam in *full-screen mode*.  
   - Any *tab-switching or exiting full-screen* is logged as a violation.  

4. *Violation Tracking & Actions*  
   - Students receive warnings for suspicious behavior.  
   - After a threshold (e.g., *10 warnings), the exam is **auto-terminated*.  

5. *Audio Monitoring (Future Enhancement)*  
   - Detect background voices to prevent external help.  

---

## 🛠 Tech Stack  

*Frontend*  
- React.js → Exam interface & QR integration  

*Backend*  
- Flask / Django → Exam API, authentication, monitoring  

*AI Models*  
- MediaPipe → Gaze & head-pose estimation (laptop camera)  
- YOLOv8 → Person detection & room monitoring (mobile camera)  

*Database*  
- MySQL / PostgreSQL  

*Cloud*  
- AWS / GCP / Azure (scalable deployment)  

---

## 🔐 Workflow  

1. *Student Login* → Secure authentication.  
2. *Laptop Camera Activated* → Monitors face & eyes.  
3. *Mobile Camera Activated* → Room monitoring through QR code.  
4. *Exam Starts in Full-Screen Mode* → Prevents tab switching.  
5. *AI Monitoring* → Face tracking, person detection, violation logging.  
6. *Violation Handling* → Warnings → Exam termination if threshold exceeded.  

---

## 📊 Business Model  

- *Target Audience:*  
  - Universities, Schools, EdTech platforms, Recruitment exams.  

- *Revenue Model:*  
  - *Subscription-based SaaS*  
  - *Tiered Pricing Plans:*  
    - 🎓 *Basic* → Laptop face monitoring only.  
    - 🏫 *Standard* → Laptop + Mobile monitoring.  
    - 🏢 *Premium* → Laptop + Mobile + Audio + Tab monitoring.  

- *Scalability:*  
  - Cloud-hosted platform supporting *thousands of concurrent users*.  

## 🧭 Future Enhancements   
- ⌨ *Keystroke pattern analysis* for verifying user typing behavior.  
- 🔗 *Blockchain integration* for tamper-proof exam results.  
- 📊 *Examiner Dashboard* → Real-time analytics & reports.

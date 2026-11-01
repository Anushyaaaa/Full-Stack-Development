# CampusVibe — Christ University Event & Club Hub

**Full Stack Development Lab — Exercise 3: Demonstration of JavaScript Event Handling**

* **Student Name:** Anushya C
* **Register Number:** 2648508
* **Institution:** CHRIST (Deemed to be University), Bangalore Central Campus
* **Subject:** Full Stack Development Lab (MCA / M.Sc Computer Science)
* **GitHub Repository:** [https://github.com/Anushyaaaa/Full-Stack-Development](https://github.com/Anushyaaaa/Full-Stack-Development)

---

## 1. Project Overview

**CampusVibe** is a modern, responsive single-page university web application designed for Christ University students to discover campus events, participate in hackathons, explore student clubs, reserve entry passes, and test real-time client-side interactions.

The primary objective of this project is to implement and demonstrate **JavaScript Event Handling** by showcasing **12 unique, non-click events** using vanilla JavaScript and modern standard `addEventListener()` patterns, integrated within a high-performance Tailwind CSS user interface.

---

## 2. Technology Stack

* **Structure:** HTML5 Semantic Markup (accessible forms, landmarks, headings).
* **Styling:** Tailwind CSS (via CDN) with custom dark navy (`#0b1120`), electric blue (`#2563eb`), and purple gradients.
* **Icons:** Font Awesome 6.5.1 CDN.
* **Typography:** Plus Jakarta Sans & JetBrains Mono (via Google Fonts).
* **Interactivity:** 100% Pure Vanilla JavaScript (No React, Vue, Angular, or jQuery).

---

## 3. Explanation of the 12 JavaScript Events

| # | Event Name | Target Element | Functional Implementation & Feedback |
|---|---|---|---|
| **1** | `load` | `window` | **Page Initialization:** Fires after the document and external resources (Tailwind, icons, fonts) finish loading. Automatically updates viewport metrics and displays the official university welcome alert dialog. |
| **2** | `input` | `#eventSearchInput` | **Real-Time Search & Character Counter:** Captures each keystroke instantly. Dynamically renders `You typed: [query]` with an active CSS pulse, increments the character counter, and filters the 6 campus event cards in real-time. |
| **3** | `resize` | `window` | **Live Viewport Geometry:** Detects browser window width adjustments. Updates `Current Screen Width: [X] px` and dynamically toggles the responsive badge between `Mobile (<768px)`, `Tablet (768px-1023px)`, and `Desktop (≥1024px)`. |
| **4** | `mouseover` | `.interactive-card` | **Card Hover Elevation:** Triggers when the mouse pointer moves over any event or club card. Applies an upward lift (`-translate-y-2`), glowing blue border ring (`ring-2 ring-brand-500`), and elevated drop shadow. |
| **5** | `mouseout` | `.interactive-card` | **Card Appearance Restoration:** Triggers when the pointer departs the card boundary, smoothly reverting all transformations and borders back to the neutral state. |
| **6** | `focus` | `#eventSearchInput`, form fields | **Field Focus Indicator:** Triggers when a text field gains focus. Changes the status pill to `State: Active` with an emerald glow and highlights the active input border. |
| **7** | `blur` | `#eventSearchInput`, form fields | **Field Blur Indicator:** Triggers when a field loses keyboard focus. Restores the status pill to `State: Inactive` and executes input sanitation. |
| **8** | `change` | `#eventTrackSelect` | **Dynamic Domain Switcher:** Triggers when the user selects a new campus domain track from the dropdown (Technology, Cultural, Sports, Entrepreneurship). Instantly swaps the preview card's title, badge, venue, and schedule. |
| **9** | `submit` | `#rsvpForm` | **Form Validation & Interception:** Uses `event.preventDefault()` to stop default page reload. Validates name and university email format, renders a confirmation banner, and resets the form cleanly. |
| **10** | `dblclick` | `.interactive-card` | **Quick Bookmark Toggle:** Double-clicking any event or club card toggles its bookmarked state, applies a glowing amber badge (`Saved`), and triggers a floating toast notification. |
| **11** | `scroll` | `window` | **Reading Progress Bar:** Tracks vertical scroll offset (`scrollY`) against total document height. Expands the fixed top gradient indicator from `0%` to `100%`, with safety guards against division-by-zero. |
| **12** | `contextmenu` | `#contextMenuDemoArea` | **Custom Action Palette:** Intercepts default right-click context menu via `event.preventDefault()` exclusively within the test zone. Spawns a custom floating action palette positioned at cursor coordinates (`pageX`, `pageY`), dismissible via click or the `Escape` key. |

---

## 4. File Structure

```text
├── index.html                       # Main responsive webpage (Tailwind CSS + HTML5)
├── fsdlab2.html                     # Synchronized lab file
├── script.js                        # 12 Vanilla JavaScript event listeners & handlers
├── README.md                        # Documentation and viva preparation guide
├── Exercise_3_Event_Handling_Submission.pdf # Official generated submission PDF
└── fsdlab2_submission_report.html   # Print report source file
```

---

## 5. How to Run Locally

1. **Option 1: Direct Browser Launch**
   * Double-click `index.html` (or `fsdlab2.html`) to open directly in Google Chrome, Microsoft Edge, or Mozilla Firefox.
   * No compilation, bundlers, or server installation required.

2. **Option 2: Live Server (VS Code Extension)**
   * Right-click `index.html` in VS Code and select **Open with Live Server**.
   * Opens automatically at `http://127.0.0.1:5500/index.html`.

3. **Option 3: Node.js Static Server**
   ```bash
   npx serve .
   ```

---

## 6. Viva Voce Q&A Preparation (Evaluation Rubric)

### Q1: What is the difference between Event Bubbling and Event Capturing?
> **Answer:** Event propagation has three phases: capturing, targeting, and bubbling. In **Capturing**, the event travels down from `window` through ancestors to the target. In **Bubbling** (the default in `addEventListener`), the event triggers on the innermost target element and bubbles upwards to parent ancestors.

### Q2: Why is `event.preventDefault()` essential in form submission?
> **Answer:** Standard HTML form submissions cause the browser to send an HTTP GET/POST request that reloads or redirects the entire webpage. Calling `event.preventDefault()` cancels this default action, enabling client-side validation, smooth UI transitions, and asynchronous operations.

### Q3: How does the `load` event differ from `DOMContentLoaded`?
> **Answer:** `DOMContentLoaded` fires when the HTML document is fully parsed and DOM tree constructed, without waiting for stylesheets, images, or iframes. The `load` event fires later, once the document DOM and **all external resources** (images, scripts, stylesheets) have finished loading.

### Q4: Why use `addEventListener()` instead of inline handlers like `onclick=""`?
> **Answer:** `addEventListener()` maintains clean separation of concerns between structure (HTML) and behavior (JS), allows multiple listeners to be attached to the same event on an element, and supports event capturing and passive listeners.

---

## 7. Submission Checklist & Rubrics Verification

* [x] **Execution / Implementation (2M):** Fully responsive, no console errors, clean execution across all browsers.
* [x] **Formatting & Validation (2M):** Semantic HTML5, accessible labels, regex validation on RSVP form.
* [x] **Concept Clarity / Viva (2M):** 12 clearly labeled events with a real-time event activity console.
* [x] **Complexity & Self Learning (2M):** Custom context menu interceptor, dynamic card filtering, and bookmark toggling.
* [x] **GitHub Collaboration (2M):** Version-controlled and pushed to GitHub main branch.

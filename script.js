/**
 * ==============================================================================
 * Project: CampusVibe — Christ University Event & Club Hub
 * File: script.js
 * Author: Anushya C (Register Number: 2648508)
 * University: CHRIST (Deemed to be University), Bangalore Central Campus
 * Course: Full Stack Development Lab — Exercise 3: JavaScript Event Handling
 * ==============================================================================
 * 
 * Demonstration of 12 Unique Non-Click JavaScript Events:
 * 1.  window 'load'        - Page initialization and welcome alert
 * 2.  input 'input'        - Real-time search & dynamic typing preview
 * 3.  window 'resize'      - Viewport pixel width and breakpoint detection
 * 4.  card 'mouseover'     - Elevation, blue ring glow, and upward translation
 * 5.  card 'mouseout'      - Restoration of card to neutral appearance
 * 6.  input 'focus'        - Field highlight and "State: Active" indicator
 * 7.  input 'blur'         - Field unhighlight and "State: Inactive" indicator
 * 8.  select 'change'      - Event domain track switcher and dynamic preview
 * 9.  form 'submit'        - Form validation and preventDefault() interception
 * 10. card 'dblclick'      - Toggle card bookmark state and trigger toast
 * 11. window 'scroll'      - Dynamic reading progress bar (0% - 100%)
 * 12. area 'contextmenu'   - Custom floating context menu with preventDefault()
 * ==============================================================================
 */

// Global Event Counter for Live Activity Console
let totalEventsCount = 0;

/**
 * Helper: Log events in real-time to the on-screen console
 * @param {string} eventName - Standard DOM event name
 * @param {string} description - Description of the action and payload
 * @param {string} colorClass - Tailwind color class for highlighting
 */
function logEvent(eventName, description, colorClass = 'text-brand-400') {
    totalEventsCount++;
    const badge = document.getElementById('eventCountBadge');
    if (badge) {
        badge.textContent = `Events Logged: ${totalEventsCount}`;
    }

    const container = document.getElementById('eventLogContainer');
    if (!container) return;

    // Remove system placeholder on first recorded event
    if (totalEventsCount === 1) {
        container.innerHTML = '';
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const entry = document.createElement('div');
    entry.className = 'flex items-start gap-2 py-1 border-b border-slate-900/60 font-mono text-[11px] animate-fade-in';
    entry.innerHTML = `
        <span class="text-slate-500 shrink-0">[${timeStr}]</span>
        <span class="font-bold uppercase ${colorClass} shrink-0 w-28">${eventName}</span>
        <span class="text-slate-300 break-all">${description}</span>
    `;

    container.prepend(entry);

    // Limit log memory to prevent page lag (max 50 items)
    while (container.children.length > 50) {
        container.removeChild(container.lastChild);
    }
}

/**
 * Helper: Show animated toast notification
 * @param {string} message - Notification text
 * @param {boolean} isSuccess - Status flag for styling
 */
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;

    if (isSuccess) {
        toastIcon.className = 'fa-solid fa-circle-check text-emerald-400 text-lg';
    } else {
        toastIcon.className = 'fa-solid fa-circle-exclamation text-rose-400 text-lg';
    }

    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('flex');
    }, 3500);
}

// ==============================================================================
// 1. EVENT: window 'load'
// Initializes page metrics and fires the mandatory welcome alert
// ==============================================================================
window.addEventListener('load', function() {
    logEvent('LOAD', 'Window and all external assets finished loading.', 'text-emerald-400');
    
    // Initialize viewport width
    updateScreenWidth();

    // Mandatory welcome alert from Slide 6 & 7 rubric
    setTimeout(function() {
        alert("Welcome to CampusVibe — Christ University Event & Club Hub!");
    }, 400);
});

// Re-trigger button for faculty viva demonstration
const retriggerBtn = document.getElementById('retriggerWelcomeBtn');
if (retriggerBtn) {
    retriggerBtn.addEventListener('click', function() {
        alert("Welcome to CampusVibe — Christ University Event & Club Hub!");
        logEvent('ALERT', 'Faculty manual welcome alert triggered.', 'text-emerald-400');
    });
}

// ==============================================================================
// 2. EVENT: input 'input'
// Streams typed query dynamically, updates character counter, and filters cards
// ==============================================================================
const searchInput = document.getElementById('eventSearchInput');
const typedValue = document.getElementById('typedValue');
const typedOutput = document.getElementById('typedOutput');
const clearInputBtn = document.getElementById('clearInputBtn');
const charCount = document.getElementById('charCount');

if (searchInput) {
    searchInput.addEventListener('input', function(event) {
        const query = event.target.value;

        // Dynamic typing output (Slide 7: "You typed: ...")
        if (query.trim() === '') {
            typedValue.innerHTML = '<span class="text-slate-500 italic font-normal font-sans">(start typing above...)</span>';
            if (clearInputBtn) clearInputBtn.classList.add('hidden');
        } else {
            typedValue.textContent = query;
            typedValue.className = 'text-brand-400 font-bold underline decoration-brand-500 underline-offset-4';
            if (clearInputBtn) clearInputBtn.classList.remove('hidden');
        }

        // Live character counter
        if (charCount) {
            charCount.textContent = query.length;
        }

        // Visual pulse feedback
        typedOutput.classList.remove('event-active-pulse');
        void typedOutput.offsetWidth; // Trigger DOM reflow
        typedOutput.classList.add('event-active-pulse');

        // Functional filter: Filter the 6 campus event cards in real-time
        const cards = document.querySelectorAll('.event-card');
        const lowerQuery = query.toLowerCase();

        cards.forEach(card => {
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const textContent = card.textContent.toLowerCase();
            if (title.includes(lowerQuery) || textContent.includes(lowerQuery)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });

        logEvent('INPUT', `Query: "${query}" (Chars: ${query.length})`, 'text-brand-400');
    });
}

// Clear search input button
if (clearInputBtn && searchInput) {
    clearInputBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
}

// ==============================================================================
// 3. EVENT: window 'resize'
// Monitors live browser viewport width and updates responsive breakpoint badge
// ==============================================================================
const screenWidthValue = document.getElementById('screenWidthValue');
const breakpointBadge = document.getElementById('breakpointBadge');

function updateScreenWidth() {
    const width = window.innerWidth;

    if (screenWidthValue) {
        screenWidthValue.textContent = `${width} px`;
    }

    if (breakpointBadge) {
        if (width < 768) {
            breakpointBadge.textContent = 'Mobile (<768px)';
            breakpointBadge.className = 'text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full';
        } else if (width < 1024) {
            breakpointBadge.textContent = 'Tablet (768px-1023px)';
            breakpointBadge.className = 'text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full';
        } else {
            breakpointBadge.textContent = 'Desktop (≥1024px)';
            breakpointBadge.className = 'text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full';
        }
    }
}

window.addEventListener('resize', function() {
    updateScreenWidth();
    logEvent('RESIZE', `Dimensions: ${window.innerWidth}px x ${window.innerHeight}px`, 'text-purple-400');
});

// ==============================================================================
// 4 & 5. EVENTS: card 'mouseover' and 'mouseout'
// Adds blue glow, upward transform on hover, and smoothly restores on departure
// ==============================================================================
const interactiveCards = document.querySelectorAll('.interactive-card');

interactiveCards.forEach((card, index) => {
    // 4. MOUSEOVER
    card.addEventListener('mouseover', function() {
        card.classList.add('ring-2', 'ring-brand-500', 'shadow-2xl', '-translate-y-2');

        const statusLabel = card.querySelector('.hover-status');
        if (statusLabel) {
            statusLabel.textContent = 'Active (mouseover)';
            statusLabel.classList.add('text-brand-400');
        }

        const cardName = card.getAttribute('data-title') || card.getAttribute('data-club') || `Card #${index + 1}`;
        logEvent('MOUSEOVER', `Entered: "${cardName}"`, 'text-yellow-400');
    });

    // 5. MOUSEOUT
    card.addEventListener('mouseout', function() {
        card.classList.remove('ring-2', 'ring-brand-500', 'shadow-2xl', '-translate-y-2');

        const statusLabel = card.querySelector('.hover-status');
        if (statusLabel) {
            statusLabel.textContent = 'Hover to glow';
            statusLabel.classList.remove('text-brand-400');
        }

        const cardName = card.getAttribute('data-title') || card.getAttribute('data-club') || `Card #${index + 1}`;
        logEvent('MOUSEOUT', `Left: "${cardName}"`, 'text-orange-400');
    });

    // 10. DBLCLICK: Toggle Bookmark
    card.addEventListener('dblclick', function() {
        card.classList.toggle('bookmarked-card');
        const badge = card.querySelector('.bookmark-badge');
        const isBookmarked = card.classList.contains('bookmarked-card');
        const cardName = card.getAttribute('data-title') || card.getAttribute('data-club') || `Card #${index + 1}`;

        if (badge) {
            if (isBookmarked) {
                badge.className = 'bookmark-badge absolute top-4 right-4 px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-[11px] shadow-md';
                badge.innerHTML = '<i class="fa-solid fa-bookmark mr-1"></i>Saved';
            } else {
                badge.className = 'bookmark-badge absolute top-4 right-4 px-2.5 py-1 bg-slate-900/90 text-slate-400 rounded-xl text-[11px] font-bold border border-slate-700';
                badge.innerHTML = '<i class="fa-regular fa-bookmark mr-1"></i>Dbl-Click';
            }
        }

        const toastMsg = isBookmarked ? `⭐ Bookmarked "${cardName}"!` : `Removed bookmark for "${cardName}".`;
        showToast(toastMsg, true);
        logEvent('DBLCLICK', `Toggled bookmark: "${cardName}" (${isBookmarked ? 'Saved' : 'Unsaved'})`, 'text-amber-400');
    });
});

// ==============================================================================
// 6 & 7. EVENTS: input 'focus' and 'blur'
// Highlights active input and dynamically updates "State: Active" / "State: Inactive"
// ==============================================================================
const fieldFocusStatus = document.getElementById('fieldFocusStatus');

if (searchInput && fieldFocusStatus) {
    // 6. FOCUS
    searchInput.addEventListener('focus', function() {
        fieldFocusStatus.textContent = 'State: Active';
        fieldFocusStatus.className = 'text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs';
        logEvent('FOCUS', 'Search field gained keyboard focus.', 'text-pink-400');
    });

    // 7. BLUR
    searchInput.addEventListener('blur', function() {
        fieldFocusStatus.textContent = 'State: Inactive';
        fieldFocusStatus.className = 'text-xs font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400';
        logEvent('BLUR', 'Search field lost focus.', 'text-indigo-400');
    });
}

// Add focus/blur logging for RSVP form inputs
const rsvpInputs = document.querySelectorAll('#rsvpForm input, #rsvpForm select');
rsvpInputs.forEach(input => {
    input.addEventListener('focus', () => {
        logEvent('FOCUS', `Form field focused: [${input.name || input.id}]`, 'text-pink-400');
    });
    input.addEventListener('blur', () => {
        logEvent('BLUR', `Form field blurred: [${input.name || input.id}]`, 'text-indigo-400');
    });
});

// ==============================================================================
// 8. EVENT: select 'change'
// Updates displayed domain track info dynamically when selection changes
// ==============================================================================
const eventTrackSelect = document.getElementById('eventTrackSelect');
const trackTitle = document.getElementById('trackTitle');
const trackBadge = document.getElementById('trackBadge');
const trackDesc = document.getElementById('trackDesc');
const trackVenue = document.getElementById('trackVenue');
const trackSchedule = document.getElementById('trackSchedule');
const trackPreviewBox = document.getElementById('trackPreviewBox');

const trackDatabase = {
    tech: {
        title: 'Technology Track (HackTheCampus & CodeVerse)',
        badge: 'Tech Domain',
        desc: 'Focuses on algorithmic coding, hackathons, full stack development, cloud computing, and AI engineering workshops.',
        venue: 'Venue: SkyView Computing Lab 4 & Turing Auditorium',
        schedule: 'Schedule: March 28 & April 02, 2026',
        badgeColor: 'bg-cyan-500 text-slate-950',
        borderColor: 'border-cyan-500/40 bg-cyan-950/40'
    },
    cultural: {
        title: 'Cultural Track (Campus Beats Festival)',
        badge: 'Cultural Domain',
        desc: 'Celebration of university acoustics, battle of the bands, classical/contemporary dance, theatrical drama, and literature.',
        venue: 'Venue: Main Campus Amphitheatre',
        schedule: 'Schedule: April 15, 2026',
        badgeColor: 'bg-rose-500 text-white',
        borderColor: 'border-rose-500/40 bg-rose-950/40'
    },
    sports: {
        title: 'Sports Track (Sports Carnival 2026)',
        badge: 'Sports Domain',
        desc: 'Inter-department championship tournament in football, cricket, basketball, track & field, and racquet sports.',
        venue: 'Venue: Central Sports Complex & Turf Ground',
        schedule: 'Schedule: April 25, 2026',
        badgeColor: 'bg-emerald-500 text-slate-950',
        borderColor: 'border-emerald-500/40 bg-emerald-950/40'
    },
    entrepreneurship: {
        title: 'Entrepreneurship Track (InnovateX Startup Arena)',
        badge: 'Startup Domain',
        desc: 'Product prototype demos, venture capital pitching, patent workshops, and networking with student unicorn founders.',
        venue: 'Venue: Central Quad & Auditorium',
        schedule: 'Schedule: April 08, 2026',
        badgeColor: 'bg-amber-500 text-slate-950',
        borderColor: 'border-amber-500/40 bg-amber-950/40'
    }
};

if (eventTrackSelect) {
    eventTrackSelect.addEventListener('change', function(event) {
        const selectedKey = event.target.value;
        const data = trackDatabase[selectedKey];

        if (data && trackTitle && trackDesc && trackVenue && trackSchedule) {
            trackTitle.textContent = data.title;
            trackBadge.textContent = data.badge;
            trackBadge.className = `text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${data.badgeColor}`;
            trackDesc.textContent = data.desc;
            trackVenue.textContent = data.venue;
            trackSchedule.textContent = data.schedule;

            if (trackPreviewBox) {
                trackPreviewBox.className = `p-5 rounded-2xl border transition-all duration-300 ${data.borderColor} event-active-pulse`;
            }
        }

        logEvent('CHANGE', `Track changed to: "${selectedKey.toUpperCase()}"`, 'text-accent-cyan');
    });
}

// ==============================================================================
// 9. EVENT: form 'submit'
// Validates inputs, intercepts with preventDefault(), and gives visual confirmation
// ==============================================================================
const rsvpForm = document.getElementById('rsvpForm');
const rsvpFeedbackBanner = document.getElementById('rsvpFeedbackBanner');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(event) {
        // Prevent default browser HTTP GET/POST reload
        event.preventDefault();

        const nameInput = document.getElementById('rsvpName');
        const emailInput = document.getElementById('rsvpEmail');
        const eventSelect = document.getElementById('rsvpEventSelect');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');

        let isValid = true;

        // Name Validation
        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            nameInput.classList.add('border-rose-500', 'bg-rose-950/30');
            isValid = false;
        } else {
            nameError.classList.add('hidden');
            nameInput.classList.remove('border-rose-500', 'bg-rose-950/30');
        }

        // Email Validation (Regex)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
            emailError.classList.remove('hidden');
            emailInput.classList.add('border-rose-500', 'bg-rose-950/30');
            isValid = false;
        } else {
            emailError.classList.add('hidden');
            emailInput.classList.remove('border-rose-500', 'bg-rose-950/30');
        }

        rsvpFeedbackBanner.classList.remove('hidden');

        if (isValid) {
            const studentName = nameInput.value.trim();
            const studentEmail = emailInput.value.trim();
            const selectedEvent = eventSelect.value;

            rsvpFeedbackBanner.className = 'mb-4 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/50 text-emerald-200 block animate-fade-in text-xs';
            rsvpFeedbackBanner.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <i class="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
                    <div>
                        <strong class="text-white block">RSVP Confirmed for ${studentName}!</strong>
                        <span>Confirmation pass has been registered for <strong>${selectedEvent}</strong>. Pass details sent to ${studentEmail}.</span>
                    </div>
                </div>
            `;

            showToast(`🎉 RSVP saved for ${studentName}!`, true);
            logEvent('SUBMIT', `Valid RSVP: ${studentName} -> ${selectedEvent}`, 'text-emerald-400');

            // Reset form fields
            rsvpForm.reset();
        } else {
            rsvpFeedbackBanner.className = 'mb-4 p-4 rounded-2xl border border-rose-500/40 bg-rose-950/50 text-rose-200 block animate-fade-in text-xs';
            rsvpFeedbackBanner.innerHTML = `
                <div class="flex items-center gap-2.5">
                    <i class="fa-solid fa-triangle-exclamation text-rose-400 text-lg"></i>
                    <div>
                        <strong class="text-white block">Form Submission Error</strong>
                        <span>Please correct the highlighted fields before submitting.</span>
                    </div>
                </div>
            `;

            showToast("Please fill all required fields correctly.", false);
            logEvent('SUBMIT', 'Form failed client-side validation checks.', 'text-rose-400');
        }
    });
}

// Quick RSVP button on event cards to pre-fill form
function quickRSVP(eventName) {
    const select = document.getElementById('rsvpEventSelect');
    if (select) {
        select.value = eventName;
    }
    const rsvpSec = document.getElementById('rsvp');
    if (rsvpSec) {
        rsvpSec.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Selected "${eventName}" in RSVP form. Enter your details below.`);
    logEvent('SELECT', `Pre-selected event: "${eventName}"`, 'text-brand-400');
}

// Quick Club Join button handler
function joinClub(clubName) {
    showToast(`🤝 Application received for ${clubName}! Welcome aboard.`);
    logEvent('JOIN', `Joined club: "${clubName}"`, 'text-accent-purple');
}

// ==============================================================================
// 11. EVENT: window 'scroll'
// Calculates page scroll progression and expands the top progress bar (0% - 100%)
// ==============================================================================
const scrollBar = document.getElementById('scrollProgressBar');

window.addEventListener('scroll', function() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Safety check against division-by-zero
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollBar) {
        scrollBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
});

// ==============================================================================
// 12. EVENT: area 'contextmenu'
// Disables default context menu within the test zone and opens custom floating menu
// ==============================================================================
const contextMenuArea = document.getElementById('contextMenuDemoArea');
const customMenu = document.getElementById('customContextMenu');

if (contextMenuArea && customMenu) {
    contextMenuArea.addEventListener('contextmenu', function(event) {
        // Stop default browser right-click menu
        event.preventDefault();

        // Position custom context menu at exact cursor coordinates
        customMenu.style.display = 'block';
        customMenu.style.left = `${event.pageX}px`;
        customMenu.style.top = `${event.pageY}px`;

        logEvent('CONTEXTMENU', `Right-click intercepted at (${event.pageX}, ${event.pageY})`, 'text-amber-400');
    });

    // Dismiss menu when clicking anywhere else
    window.addEventListener('click', function(event) {
        if (customMenu.style.display === 'block') {
            customMenu.style.display = 'none';
        }
    });

    // Dismiss menu when user presses Escape key
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && customMenu.style.display === 'block') {
            customMenu.style.display = 'none';
            logEvent('KEYDOWN', 'Dismissed custom context menu via Escape key', 'text-slate-400');
        }
    });

    // Context Menu Action: Clear Search
    const ctxClear = document.getElementById('ctxClearInput');
    if (ctxClear) {
        ctxClear.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // Context Menu Action: Jump to RSVP
    const ctxRSVP = document.getElementById('ctxScrollRSVP');
    if (ctxRSVP) {
        ctxRSVP.addEventListener('click', function() {
            const rsvpSec = document.getElementById('rsvp');
            if (rsvpSec) rsvpSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Context Menu Action: Scroll to Top
    const ctxScrollTop = document.getElementById('ctxScrollTop');
    if (ctxScrollTop) {
        ctxScrollTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Context Menu Action: Re-trigger alert
    const ctxAlert = document.getElementById('ctxTriggerAlert');
    if (ctxAlert) {
        ctxAlert.addEventListener('click', function() {
            alert("Welcome to CampusVibe — Christ University Event & Club Hub!");
        });
    }
}

// Real-Time Keyboard Indicators ('keydown' & 'keyup')
const lastKeyBadge = document.getElementById('lastKeyBadge');
if (searchInput && lastKeyBadge) {
    searchInput.addEventListener('keydown', function(event) {
        lastKeyBadge.textContent = `${event.key} (${event.code})`;
        logEvent('KEYDOWN', `Key: "${event.key}" | Code: ${event.code}`, 'text-teal-400');
    });

    searchInput.addEventListener('keyup', function(event) {
        logEvent('KEYUP', `Released: "${event.key}"`, 'text-teal-300');
    });
}

// Category Quick Filter Buttons in Events Section
function filterEventCards(category) {
    const cards = document.querySelectorAll('.event-card');
    const buttons = document.querySelectorAll('.event-filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('bg-brand-600', 'text-white');
        btn.classList.add('bg-slate-800', 'text-slate-300');
    });

    if (event && event.target) {
        event.target.classList.remove('bg-slate-800', 'text-slate-300');
        event.target.classList.add('bg-brand-600', 'text-white');
    }

    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });

    logEvent('FILTER', `Filtered events by category: "${category.toUpperCase()}"`, 'text-brand-400');
}

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
}

// Clear Log Button in Activity Console
const clearLogBtn = document.getElementById('clearLogBtn');
if (clearLogBtn) {
    clearLogBtn.addEventListener('click', function() {
        const container = document.getElementById('eventLogContainer');
        container.innerHTML = '<div class="text-slate-500 italic py-2">[Console Cleared] Log restarted.</div>';
        totalEventsCount = 0;
        document.getElementById('eventCountBadge').textContent = 'Events Logged: 0';
    });
}

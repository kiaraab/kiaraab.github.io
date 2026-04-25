document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Element Selection ---
    const elements = {
        mailbox: document.getElementById('mailbox'),
        envelopeImg: document.getElementById('envelope-img'),
        paper: document.getElementById('paper'),
        postcardInner: document.querySelector('#paper .postcard-inner'),
        titleText: document.querySelector('.title'),
        musicWidget: document.getElementById('music-widget'),
        bgMusic: document.getElementById('bg-music'),
    };

    const sounds = {
        click: new Audio('assets/audio/click.mp3'),
    };

    // --- 2. State Management ---
    const state = {
        isEnvelopeOpen: false,
        isMusicPlaying: false,
        hasFlippedPostcard: false,
        hasCompletedFlowOnce: false,
        // Dragging state variables
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        elementStartX: 0,
        elementStartY: 0,
        isClick: true,
    };

    // --- 3. Core Logic & UI Update Functions ---

    /** Makes an element unselectable to prevent text highlighting. */
    const makeUnselectable = (element) => {
        if (!element) return;
        element.setAttribute('tabindex', '-1');
        element.style.outline = 'none';
        element.addEventListener('mousedown', e => e.preventDefault());
    };

    /** Updates the instructional text at the top of the screen. */
    const updateTitleText = (text) => {
        if (elements.titleText && !state.hasCompletedFlowOnce) {
            elements.titleText.textContent = text;
            elements.titleText.classList.remove('hidden');
        }
    };

    /** Plays a sound effect. */
    const playSound = (sound) => {
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    };

    /** Resets the entire experience to its initial state. */
    const resetExperience = () => {
        state.isEnvelopeOpen = false;
        elements.envelopeImg.src = 'assets/images/envelope.PNG';
        elements.envelopeImg.classList.add('breathing');

        if (elements.titleText) {
            state.hasCompletedFlowOnce ? elements.titleText.classList.add('hidden') : updateTitleText('click the envelope to open');
        }

        elements.paper.classList.remove('show-paper', 'is-flipped', 'show-click-me');
        if (elements.postcardInner) elements.postcardInner.classList.remove('breathing');
        
        // Reset inline drag styles so it goes back to the center next time
        elements.paper.style.left = '';
        elements.paper.style.top = '';
        elements.paper.style.transition = '';

        state.hasFlippedPostcard = false;
    };

    // --- 4. Event Handlers ---

    /** Handles clicking the main envelope. */
    const handleMailboxClick = () => {
        if (!state.isEnvelopeOpen) {
            // --- Open the envelope ---
            state.isEnvelopeOpen = true;
            elements.envelopeImg.src = 'assets/images/open envelope.PNG';
            elements.envelopeImg.classList.remove('breathing');

            requestAnimationFrame(() => {
                elements.paper.classList.add('show-paper', 'show-click-me');
                updateTitleText('now click the postcard to read it');
            });

            // Autoplay music on first interaction
            if (!state.isMusicPlaying && elements.bgMusic) {
                elements.bgMusic.play().catch(() => {});
                state.isMusicPlaying = true;
                elements.musicWidget.classList.add('playing');
            }
        } else {
            // --- Close the envelope (reset) ---
            resetExperience();
        }
    };

    /** Handles clicking the postcard to flip it. */
    const handlePostcardClick = (event) => {
        // Prevent the flip if the user was actively dragging the card
        if (!state.isClick) return;

        event.stopPropagation();
        playSound(sounds.click);
        elements.paper.classList.toggle('is-flipped');
        state.hasFlippedPostcard = !state.hasFlippedPostcard;

        // On the very first flip, hide the instructions permanently and clean up animations.
        if (!state.hasCompletedFlowOnce) {
            if (elements.titleText) {
                elements.titleText.classList.add('hidden');
            }
            elements.postcardInner.classList.remove('breathing');
            elements.paper.classList.remove('show-click-me');
            state.hasCompletedFlowOnce = true;
        }
    };

    /** Handles the start of a drag event */
    const handleDragStart = (e) => {
        if (!state.isEnvelopeOpen) return;
        state.isDragging = true;
        state.isClick = true; // Assume it's a click until they move their finger/mouse

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        state.dragStartX = clientX;
        state.dragStartY = clientY;
        state.elementStartX = elements.paper.offsetLeft;
        state.elementStartY = elements.paper.offsetTop;

        elements.paper.style.transition = 'none'; // Disable CSS transition for instant drag tracking
    };

    /** Handles the movement during a drag event */
    const handleDragMove = (e) => {
        if (!state.isDragging) return;
        
        // Prevent default scrolling on mobile while dragging the postcard
        if (e.cancelable && e.type.includes('touch')) e.preventDefault();

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        const deltaX = clientX - state.dragStartX;
        const deltaY = clientY - state.dragStartY;

        // If moved more than 5 pixels, it's definitively a drag, not a click
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            state.isClick = false;
        }

        elements.paper.style.left = `${state.elementStartX + deltaX}px`;
        elements.paper.style.top = `${state.elementStartY + deltaY}px`;
    };

    /** Handles the end of a drag event */
    const handleDragEnd = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        elements.paper.style.transition = ''; // Re-enable CSS transitions
    };

    /** Handles toggling the music widget. */
    const handleMusicWidgetClick = (event) => {
        event.stopPropagation();
        state.isMusicPlaying = !state.isMusicPlaying;

        if (state.isMusicPlaying) {
            elements.bgMusic.play().catch(() => {});
            elements.musicWidget.classList.remove('paused');
        } else {
            elements.bgMusic.pause();
            elements.musicWidget.classList.add('paused');
        }
        elements.musicWidget.classList.toggle('playing', state.isMusicPlaying);
    };

    /** Handles global clicks for the background sound effect. */
    const handleGlobalClick = (event) => {
        // Don't play sound if clicking the music widget or the postcard itself
        if ((elements.musicWidget && elements.musicWidget.contains(event.target)) ||
            (elements.paper && elements.paper.contains(event.target))) {
            return;
        }
        playSound(sounds.click);
    };

    // --- 5. Initialization ---
    const init = () => {
        // Set initial UI state
        elements.envelopeImg.classList.add('breathing');
        updateTitleText('click the envelope to open');
        makeUnselectable(elements.titleText);

        // Reduce background music volume by 50%
        if (elements.bgMusic) {
            elements.bgMusic.volume = 0.5;
        }

        // Pause music when navigating away from the tab/app
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && state.isMusicPlaying && elements.bgMusic) {
                elements.bgMusic.pause();
                elements.musicWidget.classList.add('paused');
                elements.musicWidget.classList.remove('playing');
                state.isMusicPlaying = false;
            }
        });

        // Attach event listeners
        document.addEventListener('click', handleGlobalClick);
        if (elements.mailbox) {
            elements.mailbox.addEventListener('click', handleMailboxClick);
        }
        if (elements.paper) {
            elements.paper.addEventListener('click', handlePostcardClick);
            
            // Mouse drag events
            elements.paper.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);

            // Touch drag events for mobile
            elements.paper.addEventListener('touchstart', handleDragStart, { passive: true });
            document.addEventListener('touchmove', handleDragMove, { passive: false });
            document.addEventListener('touchend', handleDragEnd);
        }
        if (elements.musicWidget && elements.bgMusic) {
            elements.musicWidget.addEventListener('click', handleMusicWidgetClick);
        }
    };

    init();
});

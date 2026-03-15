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
        }
        if (elements.musicWidget && elements.bgMusic) {
            elements.musicWidget.addEventListener('click', handleMusicWidgetClick);
        }
    };

    init();
});

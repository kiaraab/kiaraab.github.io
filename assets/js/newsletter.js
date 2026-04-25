(function () {
  /* ─── THEME TOGGLE ─── */
  var themeToggles = document.querySelectorAll('.theme-toggle');
  var body = document.body;
  if (localStorage.getItem('theme') === 'dark') body.classList.add('dark-mode');
  themeToggles.forEach(function(btn) {
    btn.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  });

  /* ─── SCROLL & REVEAL EFFECTS ─── */
  var heroGlass = document.getElementById('hero-glass');
  var heroSection = document.getElementById('hero');
  var scrollCue = document.getElementById('hero-scroll-cue');
  var photoWall = document.getElementById('photo-wall');
  var issueWrap = document.querySelector('.hero-issue-wrap');
  
  // Randomize Photo Wall on load
  if (photoWall) {
    var photos = Array.from(photoWall.children);
    for (var i = photos.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      photoWall.appendChild(photos[j]);
    }
  }

  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".section, .opener, .polaroid-wrapper, .proposal-section, .reveal").forEach(function(el) {
    if (el.classList.contains('polaroid-wrapper')) {
      var rot = (Math.random() * 10 - 5).toFixed(1) + 'deg';
      el.style.setProperty('--rot', rot);
    }
    revealObserver.observe(el);
  });

  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    var vh = window.innerHeight;
    
    // 1. Title Shrink Transition (0 to 100% of viewport height)
    var shrinkProgress = Math.min(scrolled / vh, 1);
    
    if (heroGlass) {
      // Transition from full screen to small box
      var scale = 1 - (shrinkProgress * 0.85); // Shrink to 15%
      var opacity = 1 - (shrinkProgress * 0.95); 
      var radius = shrinkProgress * 32; // Round corners as it shrinks
      
      heroGlass.style.transform = 'scale(' + scale + ')';
      heroGlass.style.opacity = 1 - (shrinkProgress * 0.8);
      heroGlass.style.borderRadius = radius + 'px';
      
      // Control width/height to make it a box instead of full screen
      if (shrinkProgress > 0.1) {
        heroGlass.style.width = (100 - (shrinkProgress * 70)) + 'vw';
        heroGlass.style.height = (100 - (shrinkProgress * 80)) + 'vh';
      } else {
        heroGlass.style.width = '100vw';
        heroGlass.style.height = '100vh';
      }

      // Hide extra hero bits during shrink
      if (issueWrap) issueWrap.style.opacity = 1 - (shrinkProgress * 2);
      if (scrollCue) scrollCue.style.opacity = 1 - (shrinkProgress * 3);
    }

    // 2. Photo Wall Reveal (Starts appearing after title is mostly shrunk)
    if (photoWall) {
      var revealStart = vh * 0.5;
      var revealProgress = Math.max(0, (scrolled - revealStart) / (vh * 0.5));
      photoWall.style.opacity = Math.min(revealProgress, 1);
    }
    
    // Progress Bar & Sticky Nav
    var bar = document.getElementById('progress-bar');
    if (bar) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = ((winScroll / height) * 100) + "%";
    }

    document.body.classList.toggle('scrolled', scrolled > vh * 0.8);
  }, { passive: true });

  /* ─── DROPDOWNS ─── */
  var heroToggle = document.getElementById('issue-toggle');
  var heroDropdown = document.getElementById('issue-dropdown');
  var navToggle = document.getElementById('nav-issue-toggle');
  var navDropdown = document.getElementById('nav-issue-dropdown');

  if (heroToggle) {
    heroToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      heroDropdown.classList.toggle('open');
      if (navDropdown) navDropdown.classList.remove('open');
    });
  }
  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      navDropdown.classList.toggle('open');
      if (heroDropdown) heroDropdown.classList.remove('open');
    });
  }
  document.addEventListener('click', function() {
    if (heroDropdown) heroDropdown.classList.remove('open');
    if (navDropdown) navDropdown.classList.remove('open');
  });

  /* ─── TYPEWRITER ─── */
  var tw = document.getElementById('hero-typewriter');
  if (tw) {
    var text = 'Da Biddies Newsletter';
    var i = 0;
    function type() {
      if (i < text.length) {
        tw.textContent += text[i++];
        setTimeout(type, 70);
      } else {
        var rule = document.getElementById('hero-rule');
        if (rule) rule.classList.add('visible');
      }
    }
    setTimeout(type, 500);
  } else {
    // If no typewriter element (like in index.html example), just show rule
    setTimeout(function() {
      var rule = document.getElementById('hero-rule');
      if (rule) rule.classList.add('visible');
    }, 1000);
  }

  /* ─── BIRTHDAY LOGIC ─── */
  var BDAYS = [
    { name: 'Kiara',   initial: 'K', month: 2,  day: 2  },
    { name: 'Isabele', initial: 'I', month: 9,  day: 7  },
    { name: 'Noemi',   initial: 'N', month: 6,  day: 13 },
    { name: 'Betel',   initial: 'B', month: 3,  day: 25 },
    { name: 'Ashlyn',  initial: 'A', month: 9,  day: 28 },
  ];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function getUpcoming() {
    var today = new Date(); today.setHours(0,0,0,0);
    return BDAYS.map(function(b) {
      var d = new Date(today.getFullYear(), b.month - 1, b.day);
      if (d < today) d = new Date(today.getFullYear() + 1, b.month - 1, b.day);
      return { name: b.name, initial: b.initial, date: d, days: Math.ceil((d - today) / 86400000) };
    }).sort(function(a,b) { return a.days - b.days; });
  }

  var nameEl = document.getElementById('cd-name');
  if (nameEl) {
    var next = getUpcoming()[0];
    nameEl.textContent = next.name + '’s birthday';
    document.getElementById('cd-date').textContent = MONTHS_SHORT[next.date.getMonth()] + ' ' + next.date.getDate();
    document.getElementById('cd-days').textContent = next.days === 0 ? 'today!' : next.days + (next.days === 1 ? ' day away' : ' days away');
  }

  /* ─── CALENDAR ─── */
  var calGrid = document.getElementById('cal-grid');
  if (calGrid) {
    var today = new Date();
    var state = { year: today.getFullYear(), month: today.getMonth() };
    function render() {
      var label = document.getElementById('cal-month-label');
      label.textContent = MONTHS[state.month] + ' ' + state.year;
      var firstDay = new Date(state.year, state.month, 1).getDay();
      var daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
      var html = '';
      for (var i = 0; i < firstDay; i++) html += '<div class="cal-cell empty"></div>';
      for (var d = 1; d <= daysInMonth; d++) {
        var isToday = today.getFullYear() === state.year && today.getMonth() === state.month && today.getDate() === d;
        var bds = BDAYS.filter(function(b) { return b.month === state.month + 1 && b.day === d; });
        html += '<div class="cal-cell' + (isToday ? ' today' : '') + '">';
        html += '<span class="cal-num">' + d + '</span>';
        if (bds.length) html += '<div class="cal-event-dots">' + bds.map(function(b){ return '<span class="cal-event-dot">' + b.initial + '</span>'; }).join('') + '</div>';
        html += '</div>';
      }
      calGrid.innerHTML = html;
    }
    render();
    document.getElementById('cal-prev').onclick = function() { state.month--; if(state.month<0){state.month=11;state.year--;} render(); };
    document.getElementById('cal-next').onclick = function() { state.month++; if(state.month>11){state.month=0;state.year++;} render(); };
  }

  /* ─── PROPOSAL PARALLAX ─── */
  var frame = document.getElementById('proposal-photo');
  var pSection = document.getElementById('proposal-section');
  if (frame && pSection) {
    window.addEventListener('scroll', function() {
      var rect = pSection.getBoundingClientRect();
      var progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (window.innerHeight + rect.height))));
      frame.style.transform = 'scale(' + (0.93 + Math.sin(progress * Math.PI) * 0.12).toFixed(4) + ')';
    }, { passive: true });
  }

})();

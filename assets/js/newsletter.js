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
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".section, .opener, .polaroid-wrapper, .proposal-section, .reveal").forEach(function(el) {
    if (el.classList.contains('polaroid-wrapper')) {
      var rot = (Math.random() * 8 - 4).toFixed(1) + 'deg';
      el.style.setProperty('--rot', rot);
    }
    revealObserver.observe(el);
  });

  window.addEventListener('scroll', function() {
    var scrolled = window.scrollY;
    var vh = window.innerHeight;
    
    // 1. Hero Transition (Static center until 50%, then dock)
    if (heroGlass) {
      if (scrolled < vh * 0.4) {
        heroGlass.style.transform = 'scale(1) translateY(0)';
        heroGlass.style.opacity = '1';
        if (issueWrap) issueWrap.style.opacity = '1';
        if (scrollCue) scrollCue.style.opacity = '1';
      } else {
        var progress = Math.min((scrolled - vh * 0.4) / (vh * 0.4), 1);
        heroGlass.style.transform = 'scale(' + (1 - progress * 0.8) + ') translateY(' + (-progress * 40) + 'vh)';
        heroGlass.style.opacity = 1 - (progress * 0.2);
        if (issueWrap) issueWrap.style.opacity = '0';
        if (scrollCue) scrollCue.style.opacity = '0';
      }
    }

    // 2. Photo Wall reveal
    if (photoWall) {
      photoWall.style.opacity = scrolled > 100 ? '1' : '0';
    }
    
    // Progress Bar
    var bar = document.getElementById('progress-bar');
    if (bar) {
      var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = ((winScroll / height) * 100) + "%";
    }

    // Sticky Nav visibility
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
    tw.textContent = '';
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
    setTimeout(function() {
      var rule = document.getElementById('hero-rule');
      if (rule) rule.classList.add('visible');
    }, 1000);
  }

  /* ─── BIRTHDAY DATA ─── */
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

  // Next birthday banner
  var nameEl = document.getElementById('cd-name');
  if (nameEl) {
    var next = getUpcoming()[0];
    nameEl.textContent = next.name + '’s birthday';
    document.getElementById('cd-date').textContent = MONTHS_SHORT[next.date.getMonth()] + ' ' + next.date.getDate();
    document.getElementById('cd-days').textContent = next.days === 0 ? 'today!' : next.days + (next.days === 1 ? ' day away' : ' days away');
  }

  /* ─── CALENDAR RENDER ─── */
  var calGrid = document.getElementById('cal-grid');
  if (calGrid) {
    var today = new Date();
    var state = { year: today.getFullYear(), month: today.getMonth() };
    function render() {
      var label = document.getElementById('cal-month-label');
      if (label) label.textContent = MONTHS[state.month] + ' ' + state.year;
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
    var prev = document.getElementById('cal-prev');
    var next = document.getElementById('cal-next');
    if (prev) prev.onclick = function() { state.month--; if(state.month<0){state.month=11;state.year--;} render(); };
    if (next) next.onclick = function() { state.month++; if(state.month>11){state.month=0;state.year++;} render(); };
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

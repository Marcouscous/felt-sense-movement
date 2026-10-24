// Shared "Save Event" calendar menu — a small pop-up under the button (same
// look and behaviour as the Email Marcus menu) instead of a full-screen picker.
// Tapping a choice, anywhere else on the page, or Esc closes it.
//
// Usage: window.FSMCalMenu.open(buttonElement, {
//   title, location, description, url, timeZone,
//   // either timed sessions (one or more days):
//   sessions: [{ date: 'YYYY-MM-DD', start: 'HH:MM', end: 'HH:MM', title? }],
//   // or an all-day / multi-day event:
//   date: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', allDay: true
// });
(function () {
  'use strict';

  var openMenu = null;
  var openAnchor = null;

  // ── date helpers ───────────────────────────────────────────────
  var pad = function (n) { return String(n).padStart(2, '0'); };

  // Wall-clock time in a time zone → UTC Date
  function zonedToUtc(date, time, timeZone) {
    var guess = new Date(date + 'T' + time + ':00Z');
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).formatToParts(guess).reduce(function (o, p) { o[p.type] = p.value; return o; }, {});
    var asIfUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
    return new Date(guess.getTime() - (asIfUtc - guess.getTime()));
  }

  var icsStamp = function (d) {
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
      pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
  };
  var compactDate = function (ymd) { return ymd.replace(/-/g, ''); };
  function addDays(ymd, n) {
    var d = new Date(ymd + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  var icsText = function (s) {
    return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  };

  // ── build the event in each calendar's format ──────────────────
  function buildIcs(ev) {
    var tz = ev.timeZone || 'America/Los_Angeles';
    var desc = ev.description + (ev.url ? '\n\n' + ev.url : '');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Felt Sense Movement//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
    var now = icsStamp(new Date());
    var add = function (uid, startLine, endLine, title) {
      lines.push('BEGIN:VEVENT', 'UID:' + uid + '@feltsensemovement.com', 'DTSTAMP:' + now, startLine, endLine,
        'SUMMARY:' + icsText(title), 'LOCATION:' + icsText(ev.location), 'DESCRIPTION:' + icsText(desc));
      if (ev.url) lines.push('URL:' + ev.url);
      lines.push('END:VEVENT');
    };
    if (ev.sessions) {
      ev.sessions.forEach(function (s, i) {
        add(compactDate(s.date) + '-' + i + '-' + ev.title.replace(/\W+/g, ''),
          'DTSTART:' + icsStamp(zonedToUtc(s.date, s.start, tz)),
          'DTEND:' + icsStamp(zonedToUtc(s.date, s.end, tz)),
          s.title || ev.title);
      });
    } else {
      add(compactDate(ev.date) + '-' + ev.title.replace(/\W+/g, ''),
        'DTSTART;VALUE=DATE:' + compactDate(ev.date),
        'DTEND;VALUE=DATE:' + compactDate(addDays(ev.endDate || ev.date, 1)),
        ev.title);
    }
    lines.push('END:VCALENDAR');
    return lines.join('\r\n') + '\r\n';
  }

  // One Google link per session (Google's "repeat" option isn't honoured
  // everywhere, e.g. the phone app), or one link for an all-day event.
  function googleUrl(ev, session) {
    var tz = ev.timeZone || 'America/Los_Angeles';
    var p = { action: 'TEMPLATE', text: (session && session.title) || ev.title, location: ev.location || '',
      details: (ev.description || '') + (ev.url ? '\n\n' + ev.url : '') };
    if (session) {
      var d = compactDate(session.date);
      p.dates = d + 'T' + session.start.replace(':', '') + '00/' + d + 'T' + session.end.replace(':', '') + '00';
      p.ctz = tz;
    } else {
      p.dates = compactDate(ev.date) + '/' + compactDate(addDays(ev.endDate || ev.date, 1));
    }
    return 'https://calendar.google.com/calendar/render?' + Object.keys(p).map(function (k) {
      return k + '=' + encodeURIComponent(p[k]);
    }).join('&');
  }

  var dayName = function (ymd) {
    return new Date(ymd + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  };

  // ── the menu ───────────────────────────────────────────────────
  function close() {
    if (!openMenu) return;
    openMenu.remove();
    if (openAnchor) openAnchor.setAttribute('aria-expanded', 'false');
    openMenu = null;
    openAnchor = null;
  }

  function open(anchor, ev) {
    if (openAnchor === anchor) { close(); return; }   // second tap toggles shut
    close();

    var ics = buildIcs(ev);
    var fileName = ev.title.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '') + '.ics';
    var items = [
      { label: 'Apple Calendar', href: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics) },
      { label: 'Outlook / other (.ics)', href: URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })), download: fileName }
    ];

    // Google: one item, or one per session ("Google Calendar — Sat", "— Sun")
    var googleItems = (ev.sessions && ev.sessions.length > 1)
      ? ev.sessions.map(function (sess) {
          return { label: 'Google Calendar — ' + dayName(sess.date), href: googleUrl(ev, sess), external: true };
        })
      : [{ label: 'Google Calendar', href: googleUrl(ev, ev.sessions && ev.sessions[0]), external: true }];
    items.splice.apply(items, [1, 0].concat(googleItems));

    var menu = document.createElement('ul');
    menu.className = 'cal-menu';
    items.forEach(function (it) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.textContent = it.label;
      a.href = it.href;
      if (it.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (it.download) a.download = it.download;
      a.addEventListener('click', function () { setTimeout(close, 0); });
      li.appendChild(a);
      menu.appendChild(li);
    });
    document.body.appendChild(menu);

    // Position just under the button, centred on it, kept on-screen
    var r = anchor.getBoundingClientRect();
    var w = menu.offsetWidth;
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, document.documentElement.clientWidth - w - 8));
    menu.style.left = (left + window.scrollX) + 'px';
    menu.style.top = (r.bottom + window.scrollY + 6) + 'px';

    anchor.setAttribute('aria-haspopup', 'true');
    anchor.setAttribute('aria-expanded', 'true');
    openMenu = menu;
    openAnchor = anchor;
  }

  document.addEventListener('click', function (e) {
    if (!openMenu) return;
    if (openMenu.contains(e.target) || (openAnchor && openAnchor.contains(e.target))) return;
    close();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
  // If a scrolling event list moves the button, close rather than float loose
  document.addEventListener('scroll', function (e) {
    if (openMenu && e.target !== document && !openMenu.contains(e.target)) close();
  }, true);

  // events.json entry → menu event (used by the site's event calendars)
  function fromEvent(event, siteRoot) {
    var url = event.link ? new URL(event.link, siteRoot || location.href).href : '';
    // Optional calendar-only overrides in events.json: calendarTitle,
    // calendarLocation, calendarDescription (the card keeps title/location).
    var ev = {
      title: event.calendarTitle || event.title,
      location: event.calendarLocation || (event.locationMap && !/^https?:/.test(event.locationMap)
        ? event.location + ', ' + event.locationMap
        : (event.location || '')),
      description: event.calendarDescription || event.description || '',
      url: url,
      timeZone: event.timeZone || 'America/Los_Angeles'
    };
    if (event.startTime && event.endTime && !event.allDay) {
      ev.sessions = [{ date: event.date, start: event.startTime, end: event.endTime }];
    } else {
      ev.date = event.date;
      ev.endDate = event.endDate || event.date;
      ev.allDay = true;
    }
    return ev;
  }

  window.FSMCalMenu = { open: open, close: close, fromEvent: fromEvent };
}());

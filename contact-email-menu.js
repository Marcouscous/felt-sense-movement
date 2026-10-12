(function () {
  'use strict';

  document.querySelectorAll('.contact-email-menu').forEach((menu) => {
    const row = menu.closest('.mobile-contact__row, .contact-row');
    if (!row) return;

    const triggers = row.querySelectorAll('.contact-email-trigger');

    function close() {
      menu.hidden = true;
      triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    }

    function open() {
      menu.hidden = false;
      triggers.forEach((t) => t.setAttribute('aria-expanded', 'true'));
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        trigger.getAttribute('aria-expanded') === 'true' ? close() : open();
      });
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

    menu.querySelectorAll('.contact-email-menu__copy').forEach((btn) => {
      const label = btn.textContent;
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(btn.dataset.email);
          btn.textContent = 'Copied!';
        } catch {
          btn.textContent = btn.dataset.email;
        }
        setTimeout(() => {
          btn.textContent = label;
          close();
        }, 1500);
      });
    });

    document.addEventListener('click', (e) => {
      if (!row.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  });
}());

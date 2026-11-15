(function () {
  var shown = false;

  function escapeHtml(text) {
    return String(text || '').replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[ch];
    });
  }

  function renderBootFallback(reason) {
    if (shown || window.__NL_APP_MOUNTED) return;
    var root = document.getElementById('root');
    if (!root || root.children.length > 0) return;
    shown = true;

    root.innerHTML =
      '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;color:#0f172a">' +
      '<div style="max-width:460px;width:100%;background:#ffffff;border:1px solid #cbd5e1;border-radius:16px;padding:24px;box-shadow:0 12px 32px rgba(15,23,42,0.08)">' +
      '<h2 style="margin:0 0 8px;font-size:18px;color:#0f172a">ไม่สามารถโหลดหน้าเว็บได้สมบูรณ์</h2>' +
      '<p style="margin:0 0 14px;font-size:14px;line-height:1.55;color:#475569">อาจเกิดจากแคชเวอร์ชันเก่าในเบราว์เซอร์หรือการเชื่อมต่อขัดข้อง กดปุ่มด้านล่างเพื่อโหลดเวอร์ชันล่าสุดครับ</p>' +
      '<p style="margin:0 0 16px;font-size:12px;color:#94a3b8;word-break:break-word">' + escapeHtml(reason) + '</p>' +
      '<button id="nl-boot-reload-btn" type="button" style="padding:10px 16px;border-radius:10px;border:none;background:#2563eb;color:#fff;font-weight:600;cursor:pointer">โหลดหน้าเว็บใหม่</button>' +
      '</div></div>';

    var btn = document.getElementById('nl-boot-reload-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        window.location.replace(window.location.pathname + '?_v=' + Date.now());
      });
    }
  }

  window.addEventListener('error', function (ev) {
    if (window.__NL_APP_MOUNTED) return;
    var target = ev && ev.target;
    if (target && target.tagName === 'SCRIPT' && target.src && target.src.indexOf('/assets/') !== -1) {
      try {
        var last = Number(sessionStorage.getItem('nl_boot_reload_ts') || '0');
        if (Date.now() - last > 15000) {
          sessionStorage.setItem('nl_boot_reload_ts', String(Date.now()));
          window.location.replace(window.location.pathname + '?_v=' + Date.now());
          return;
        }
      } catch (e) {}
      renderBootFallback('Asset load failed: ' + target.src);
      return;
    }
    if (ev && ev.message) {
      setTimeout(function () {
        if (!window.__NL_APP_MOUNTED) renderBootFallback(ev.message);
      }, 300);
    }
  }, true);

  setTimeout(function () {
    if (!window.__NL_APP_MOUNTED) renderBootFallback('Timeout waiting for app mount');
  }, 14000);
})();

/* =====================================================
   EduInformatika LMS — Shared Interactions
   ===================================================== */

// ---------- toast helper ----------
function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

// ---------- generic dropdown (avatar / notification) ----------
function initDropdowns() {
  document.querySelectorAll("[data-dropdown-trigger]").forEach((trigger) => {
    const panelId = trigger.getAttribute("data-dropdown-trigger");
    const panel = document.getElementById(panelId);
    if (!panel) return;
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".dropdown-panel.open").forEach((p) => {
        if (p !== panel) p.classList.remove("open");
      });
      panel.classList.toggle("open");
    });
  });
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown-panel.open")
      .forEach((p) => p.classList.remove("open"));
  });
}

// ---------- mobile sidebar ----------
function initMobileSidebar() {
  const btn = document.querySelector(".mobile-menu-btn");
  const sidebar = document.querySelector(".sidebar");
  if (!btn || !sidebar) return;
  let overlay = document.querySelector(".sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);
  }
  const close = () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  };
  btn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  });
  overlay.addEventListener("click", close);
}

// ---------- password visibility toggle ----------
function initPasswordToggles() {
  document.querySelectorAll(".eye-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";
      btn.innerHTML = isPwd ? eyeOffSvg() : eyeSvg();
    });
  });
}
function eyeSvg() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function eyeOffSvg() {
  return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.4 21.4 0 015.06-5.94M9.9 4.24A10.6 10.6 0 0112 4c7 0 11 7 11 7a21.4 21.4 0 01-3.22 4.36M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
}

// ---------- role toggle (login/register) ----------
function initRoleToggle() {
  document.querySelectorAll(".role-toggle").forEach((group) => {
    group.querySelectorAll(".role-opt").forEach((opt) => {
      opt.addEventListener("click", () => {
        group
          .querySelectorAll(".role-opt")
          .forEach((o) => o.classList.remove("selected"));
        opt.classList.add("selected");
      });
    });
  });
}

// ---------- basic form validation ----------
function initFormValidation() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("input[required]").forEach((input) => {
        const errEl = input.closest(".field")?.querySelector(".err");
        if (!input.value.trim()) {
          valid = false;
          input.classList.add("invalid");
          if (errEl) errEl.classList.add("show");
        } else {
          input.classList.remove("invalid");
          if (errEl) errEl.classList.remove("show");
        }
      });
      const pwd = form.querySelector('input[name="password"]');
      const confirm = form.querySelector('input[name="confirm_password"]');
      if (pwd && confirm && confirm.value && pwd.value !== confirm.value) {
        valid = false;
        confirm.classList.add("invalid");
        const errEl = confirm.closest(".field")?.querySelector(".err");
        if (errEl) {
          errEl.textContent = "Password tidak cocok";
          errEl.classList.add("show");
        }
      }
      if (valid) {
        showToast(form.getAttribute("data-success-msg") || "Berhasil!");
        setTimeout(() => {
          const redirect = form.getAttribute("data-redirect");
          if (redirect) window.location.href = redirect;
        }, 900);
      }
    });
    form.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("invalid");
        const errEl = input.closest(".field")?.querySelector(".err");
        if (errEl) errEl.classList.remove("show");
      });
    });
  });
}

// ---------- Kelasku page: filter + search + join ----------
function initKelasku() {
  const chips = document.querySelectorAll(".chip-filter");
  const cards = document.querySelectorAll(".class-card");
  const search = document.querySelector("#classSearch");
  if (!chips.length) return;

  function applyFilter() {
    const activeChip = document.querySelector(".chip-filter.active");
    const level = activeChip ? activeChip.getAttribute("data-level") : "Semua";
    const query = (search?.value || "").toLowerCase().trim();
    cards.forEach((card) => {
      const cardLevel = card.getAttribute("data-level");
      const text = card.textContent.toLowerCase();
      const matchLevel = level === "Semua" || level === cardLevel;
      const matchQuery = !query || text.includes(query);
      card.hidden = !(matchLevel && matchQuery);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyFilter();
    });
  });
  search?.addEventListener("input", applyFilter);

  document.querySelectorAll("[data-join-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.textContent = "Menunggu Persetujuan";
      btn.disabled = true;
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");
      showToast("Permintaan bergabung terkirim ke guru");
    });
  });

  const codeBtn = document.querySelector("#joinCodeBtn");
  const codeInput = document.querySelector("#classCodeInput");
  codeBtn?.addEventListener("click", () => {
    if (!codeInput.value.trim()) {
      codeInput.focus();
      showToast("Masukkan kode kelas terlebih dahulu");
      return;
    }
    showToast(
      `Mencari kelas dengan kode "${codeInput.value.trim().toUpperCase()}"...`,
    );
    codeInput.value = "";
  });
}

// ---------- Dashboard: weekly chart + progress ring ----------
function initDashboardChart() {
  const svg = document.querySelector("#weekChart");
  if (!svg) return;
  const data = [45, 62, 30, 78, 52, 20, 58]; // Sen..Min minutes-ish
  const w = 560,
    h = 190,
    pad = 8;
  const max = 100;
  const stepX = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - (v / max) * h;
    return [x, y];
  });
  const pathD = points
    .map(
      (p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1),
    )
    .join(" ");
  const areaD =
    pathD + ` L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2563eb" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaD}" fill="url(#areaGrad)" stroke="none"></path>
    <path d="${pathD}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
    ${points.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#fff" stroke="#2563eb" stroke-width="2.5"></circle>`).join("")}
  `;

  // progress ring
  const ring = document.querySelector("#progressRing");
  const ringLabel = document.querySelector("#progressRingLabel");
  if (ring) {
    const pct = parseInt(ring.getAttribute("data-pct") || "0", 10);
    const r = 54;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - pct / 100);
    ring.style.strokeDasharray = circumference;
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset;
    });
    if (ringLabel) ringLabel.textContent = pct + "%";
  }
}

// ---------- Modul Belajar: lesson switching ----------
const LESSONS = {
  l1: {
    bab: "Bab 1 · Pelajaran 1",
    badge: "Video · 12 menit",
    title: "Apa itu Informatika?",
    meta: "Video · 12 menit · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    caption: "Apa itu Informatika?",
    progress: 100,
    body: `<p>Informatika adalah ilmu yang mempelajari cara pengumpulan, penyimpanan, pengolahan, dan penyajian informasi menggunakan teknologi komputer.</p>
          <p>Bab ini akan mengenalkan konsep dasar informatika, ruang lingkupnya, dan mengapa mata pelajaran ini penting untuk dipelajari sejak SMP.</p>`,
    tip: "Informatika berbeda dengan TIK — informatika berfokus pada cara berpikir komputasional, bukan sekadar penggunaan aplikasi.",
  },
  l2: {
    bab: "Bab 1 · Pelajaran 2",
    badge: "Bacaan · 8 menit",
    title: "Sejarah Komputer",
    meta: "Bacaan · 8 menit · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    caption: "Sejarah Komputer",
    progress: 100,
    body: `<p>Komputer telah berkembang dari mesin hitung mekanik sederhana hingga perangkat pintar yang kita gunakan setiap hari.</p>
          <p>Kita akan menelusuri lima generasi komputer, mulai dari tabung vakum hingga mikroprosesor modern.</p>`,
    tip: "Generasi pertama komputer menggunakan tabung vakum dan berukuran sebesar satu ruangan penuh!",
  },
  l3: {
    bab: "Bab 1 · Pelajaran 3",
    badge: "Video · 15 menit",
    title: "Peran Informatika di Kehidupan Sehari-hari",
    meta: "Video · 15 menit · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
    caption: "Peran Informatika di Kehidupan Sehari-hari",
    progress: 0,
    body: `<p>Informatika adalah ilmu yang mempelajari cara pengumpulan, penyimpanan, pengolahan, dan penyajian informasi menggunakan teknologi komputer. Di era digital ini, informatika memiliki peran yang sangat penting dalam kehidupan sehari-hari kita.</p>
          <p>Mulai dari smartphone yang kita gunakan setiap hari, aplikasi transportasi online, sistem perbankan digital, hingga platform media sosial — semuanya dibangun di atas prinsip-prinsip dasar informatika.</p>
          <p>Dalam bab ini, kita akan membahas bagaimana algoritma yang sederhana dapat membantu kita memecahkan masalah sehari-hari, dari memasak mie instan hingga navigasi ke tempat tujuan.</p>`,
    tip: "Indonesia membutuhkan lebih dari 9 juta tenaga ahli digital pada tahun 2030. Belajar informatika sejak SMP adalah langkah awal yang tepat!",
  },
  l4: {
    bab: "Bab 2 · Pelajaran 1",
    badge: "Video · 10 menit",
    title: "Mengenal Perangkat Keras Komputer",
    meta: "Video · 10 menit · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1591405351990-4726e331f141?w=1200&q=80",
    caption: "Mengenal Perangkat Keras Komputer",
    progress: 0,
    body: `<p>Perangkat keras (hardware) adalah komponen fisik komputer yang dapat kita lihat dan sentuh, seperti CPU, RAM, dan hard disk.</p>
          <p>Kita akan mempelajari fungsi setiap komponen utama dan bagaimana mereka bekerja sama memproses data.</p>`,
    tip: 'CPU sering disebut "otak" komputer karena bertugas menjalankan hampir seluruh instruksi program.',
  },
  l5: {
    bab: "Bab 2 · Pelajaran 2",
    badge: "Bacaan · 9 menit",
    title: "Perangkat Lunak dan Sistem Operasi",
    meta: "Bacaan · 9 menit · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80",
    caption: "Perangkat Lunak dan Sistem Operasi",
    progress: 0,
    body: `<p>Perangkat lunak adalah kumpulan instruksi yang memberi tahu perangkat keras apa yang harus dilakukan.</p>
          <p>Sistem operasi berperan sebagai jembatan antara pengguna, aplikasi, dan perangkat keras komputer.</p>`,
    tip: "Windows, macOS, dan Linux adalah tiga sistem operasi desktop yang paling banyak digunakan di dunia.",
  },
  l6: {
    bab: "Bab 2 · Pelajaran 3",
    badge: "Kuis · 10 soal",
    title: "Latihan: Perangkat Komputer",
    meta: "Kuis · 10 soal · Pak Ahmad Ridwan",
    img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&q=80",
    caption: "Latihan: Perangkat Komputer",
    progress: 0,
    body: `<p>Saatnya menguji pemahamanmu tentang perangkat keras dan perangkat lunak komputer melalui kuis interaktif ini.</p>
          <p>Kuis terdiri dari 10 soal pilihan ganda dengan waktu pengerjaan 15 menit.</p>`,
    tip: "Kamu bisa mengulang kuis ini kapan saja untuk memperbaiki nilaimu sebelum tenggat waktu berakhir.",
  },
};

function initModulBelajar() {
  const lessonItems = document.querySelectorAll(".lesson-item[data-lesson]");
  if (!lessonItems.length) return;

  function renderLesson(id) {
    const l = LESSONS[id];
    if (!l) return;
    document.querySelector("#lessonBabTag").textContent = l.bab;
    document.querySelector("#lessonTitle").textContent = l.title;
    document.querySelector("#lessonMeta").textContent = l.meta;
    document.querySelector("#lessonBody").innerHTML = l.body;
    document.querySelector("#tipText").textContent = l.tip;
    document.querySelector("#videoImg").src = l.img;
    document.querySelector("#videoCaptionTitle").textContent = l.caption;
    document.querySelector("#videoCaptionMeta").textContent = l.meta;
    document.querySelector("#videoProgressBar").style.width = l.progress + "%";

    lessonItems.forEach((item) =>
      item.classList.toggle("active", item.getAttribute("data-lesson") === id),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  lessonItems.forEach((item) => {
    item.addEventListener("click", () =>
      renderLesson(item.getAttribute("data-lesson")),
    );
  });

  // mark complete
  const markBtn = document.querySelector("#markCompleteBtn");
  markBtn?.addEventListener("click", () => {
    const active = document.querySelector(".lesson-item.active");
    if (active && !active.classList.contains("done")) {
      active.classList.add("done");
      const icon = active.querySelector(".st-icon");
      if (icon)
        icon.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      showToast("Pelajaran ditandai selesai ✓");
      updateOverallProgress();
    }
    // move to next lesson if exists
    const items = Array.from(lessonItems);
    const idx = items.indexOf(active);
    if (idx > -1 && idx < items.length - 1) {
      items[idx + 1].click();
    }
  });

  function updateOverallProgress() {
    const total = lessonItems.length;
    const done = document.querySelectorAll(".lesson-item.done").length;
    const pct = Math.round((done / total) * 100);
    const bar = document.querySelector("#overallProgressBar");
    const label = document.querySelector("#overallProgressLabel");
    const sub = document.querySelector("#overallProgressSub");
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = pct + "%";
    if (sub) sub.textContent = `${done} dari ${total} pelajaran selesai`;
  }

  // play button toggle (simulated)
  const playBtn = document.querySelector("#playBtn");
  playBtn?.addEventListener("click", () =>
    showToast("▶ Memutar video pelajaran..."),
  );

  // bab collapse
  document.querySelectorAll(".bab-head").forEach((head) => {
    head.addEventListener("click", () => {
      head.parentElement.classList.toggle("collapsed");
    });
  });
}

// ---------- Profil Saya page ----------
function initProfilePage() {
  const page = document.querySelector("#profilePage");
  if (!page) return;

  // tabs
  const tabBtns = page.querySelectorAll(".tab-btn");
  const panels = page.querySelectorAll(".tab-panel");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document
        .querySelector("#" + btn.getAttribute("data-tab"))
        .classList.add("active");
    });
  });

  // edit / save info toggle
  const editBtn = document.querySelector("#editInfoBtn");
  const cancelBtn = document.querySelector("#cancelInfoBtn");
  const saveBtn = document.querySelector("#saveInfoBtn");
  const infoForm = document.querySelector("#infoForm");
  const infoInputs = infoForm
    ? infoForm.querySelectorAll("input, textarea")
    : [];
  let snapshot = {};

  function setEditing(on) {
    infoInputs.forEach((inp) => {
      inp.disabled = !on;
    });
    editBtn.style.display = on ? "none" : "inline-flex";
    cancelBtn.style.display = on ? "inline-flex" : "none";
    saveBtn.style.display = on ? "inline-flex" : "none";
  }
  editBtn?.addEventListener("click", () => {
    snapshot = {};
    infoInputs.forEach((inp) => (snapshot[inp.name] = inp.value));
    setEditing(true);
    infoInputs[0]?.focus();
  });
  cancelBtn?.addEventListener("click", () => {
    infoInputs.forEach((inp) => {
      if (snapshot[inp.name] !== undefined) inp.value = snapshot[inp.name];
    });
    setEditing(false);
  });
  infoForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    setEditing(false);
    document.querySelector("#profileNameDisplay").textContent =
      infoForm.querySelector('[name="fullname"]').value;
    showToast("Perubahan profil berhasil disimpan");
  });

  // avatar upload preview
  const avatarInput = document.querySelector("#avatarInput");
  avatarInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.querySelectorAll(".js-avatar-img").forEach((el) => {
        el.innerHTML = `<img src="${ev.target.result}" alt="Foto profil">`;
      });
      showToast("Foto profil diperbarui");
    };
    reader.readAsDataURL(file);
  });

  // password form extra check
  const secForm = document.querySelector("#securityForm");
  secForm?.addEventListener("submit", () => {
    // handled by generic data-validate handler; reset fields after brief delay if valid
    setTimeout(() => {
      secForm.reset();
    }, 950);
  });

  // toggle switches (just visual + toast)
  document.querySelectorAll('.switch input[type="checkbox"]').forEach((sw) => {
    sw.addEventListener("change", () => {
      const label =
        sw.closest(".switch-row")?.querySelector(".txt b")?.textContent ||
        "Pengaturan";
      showToast(`${label}: ${sw.checked ? "Diaktifkan" : "Dinonaktifkan"}`);
    });
  });

  // delete account danger button (just confirm dialog styled via toast, no real action)
  document.querySelector("#deleteAccountBtn")?.addEventListener("click", () => {
    showToast("Fitur hapus akun dinonaktifkan pada demo ini");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDropdowns();
  initMobileSidebar();
  initPasswordToggles();
  initRoleToggle();
  initFormValidation();
  initKelasku();
  initDashboardChart();
  initModulBelajar();
  initProfilePage();
});

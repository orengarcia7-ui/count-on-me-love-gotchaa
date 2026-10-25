(() => {
  "use strict";
  const data = window.SITE_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const imagePath = filename => `public/images/${filename}`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const withBreaks = value => escapeHtml(value).replace(/\n/g, "<br>");

  $$("[data-signature]").forEach(el => el.textContent = data.signature);
  const openingTitle = $("#opening-title");
  openingTitle.innerHTML = `${escapeHtml(data.openingTitle).replace("this little world is just for you.", "<em>this little world is just for you.</em>")}`;
  $(".opening-copy").textContent = data.openingMessage;

  const imageFallback = (img, filename) => {
    img.dataset.failed = "true";
    img.hidden = true;
    const wrap = img.closest(".photo-wrap") || img.parentElement;
    if (wrap && !$(".photo-placeholder", wrap)) {
      const placeholder = document.createElement("div");
      placeholder.className = "photo-placeholder";
      placeholder.innerHTML = `<span aria-hidden="true">♡</span><strong>Your memory goes here</strong><small>Add <code>${escapeHtml(filename)}</code> to <code>public/images/</code></small>`;
      wrap.appendChild(placeholder);
    }
  };
  const imageTag = (filename, alt, extraClass = "") =>
    `<img class="replaceable-image ${extraClass}" src="${imagePath(filename)}" alt="${escapeHtml(alt)}" data-filename="${escapeHtml(filename)}" loading="lazy">`;

  function renderSections() {
    $("#comfortSections").innerHTML = data.sections.map((s, i) => `
      <article class="comfort-card reveal ${i % 2 ? "reverse" : ""}">
        <div class="comfort-image polaroid">
          <div class="photo-wrap">${imageTag(s.image, s.caption)}</div>
          <p class="photo-caption">${escapeHtml(s.caption)}</p><span class="tape" aria-hidden="true"></span>
        </div>
        <div class="comfort-copy">
          <p class="number">${escapeHtml(s.label)} <span>— a reminder for you</span></p>
          <h3>${escapeHtml(s.theme)}</h3>
          ${s.lyric ? `<blockquote>${escapeHtml(s.lyric)}</blockquote>` : `<p class="theme-note">a little reminder, inspired by the song's meaning ♡</p>`}
          <p class="message">${withBreaks(s.message)}</p>
          ${s.signature ? `<p class="handwritten">${escapeHtml(s.signature)}</p>` : ""}
          ${i < data.sections.length - 1 ? `<a class="text-link" href="#comfort-card-${i + 1}">Next little reminder ♡ <span aria-hidden="true">→</span></a>` : `<a class="text-link" href="#appreciation">Keep these little reminders close ♡ <span aria-hidden="true">→</span></a>`}
        </div>
      </article>`).join("");
    $$(".comfort-card").forEach((card, i) => {
      card.id = `comfort-card-${i}`;
      const link = $(".text-link", card);
      if (i < data.sections.length - 1) link.href = `#comfort-card-${i + 1}`;
    });
  }

  function renderAppreciation() {
    $("#appreciationGrid").innerHTML = data.appreciation.map((message, i) => `
      <button class="appreciation-card" type="button" aria-pressed="false">
        <span class="card-number">0${i + 1}</span><span>${escapeHtml(message)}</span><span class="card-heart" aria-hidden="true">♡</span>
      </button>`).join("");
    $$(".appreciation-card").forEach(card => card.addEventListener("click", () => {
      const selected = card.classList.toggle("selected");
      card.setAttribute("aria-pressed", String(selected));
    }));
  }

  function renderGallery() {
    $("#galleryGrid").innerHTML = data.gallery.map((item, i) => `
      <button class="gallery-item ${i % 3 === 0 ? "gallery-tall" : ""}" type="button" data-gallery-index="${i}" aria-label="Open photo: ${escapeHtml(item.caption)}">
        <div class="photo-wrap">${imageTag(item.image, item.caption)}</div><span class="gallery-caption">${escapeHtml(item.caption)}</span><span class="gallery-heart" aria-hidden="true">♡</span>
      </button>`).join("");
  }

  function renderTimeline() {
    $("#timelineGrid").innerHTML = data.timeline.map(item => `
      <article class="timeline-card reveal">
        <div class="timeline-photo"><div class="photo-wrap">${imageTag(item.image, item.title)}</div></div>
        <div class="timeline-copy"><p class="timeline-date">${escapeHtml(item.date)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.caption)}</p></div>
      </article>`).join("");
  }

  renderSections(); renderAppreciation(); renderGallery(); renderTimeline();
  $("#letterText").innerHTML = `<p>${withBreaks(data.letter)}</p>`;

  // Graceful image fallback: missing user photos become helpful scrapbook placeholders.
  $$("img.replaceable-image").forEach(img => {
    img.addEventListener("error", () => imageFallback(img, img.dataset.filename || img.getAttribute("src").split("/").pop()), { once: true });
    if (img.complete && img.naturalWidth === 0) imageFallback(img, img.dataset.filename || img.getAttribute("src").split("/").pop());
  });

  // Opening experience and music controls.
  const opening = $("#opening"), site = $("#site"), audio = $("#backgroundMusic");
  const musicToggle = $("#musicToggle"), musicStatus = $("#musicStatus");
  audio.src = data.musicFile || "public/music/count-on-me.mp3";
  audio.volume = Number($("#volume").value);
  function updateMusicUI(playing) {
    musicToggle.textContent = playing ? "Ⅱ" : "▶";
    musicToggle.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    musicStatus.textContent = playing ? "playing softly ♡" : "music is paused";
    musicToggle.classList.toggle("playing", playing);
  }
  async function playMusic() {
    try { await audio.play(); updateMusicUI(true); }
    catch (err) {
      updateMusicUI(false);
      musicStatus.textContent = "add your music file ♡";
      showToast("Add your authorized music file at public/music/count-on-me.mp3. The website still works without it.");
    }
  }
  audio.addEventListener("play", () => updateMusicUI(true));
  audio.addEventListener("pause", () => updateMusicUI(false));
  audio.addEventListener("error", () => { updateMusicUI(false); musicStatus.textContent = "add your music file ♡"; });
  $("#openSite").addEventListener("click", () => {
    opening.classList.add("opening-leave");
    window.setTimeout(() => {
      opening.hidden = true; site.hidden = false; site.classList.add("site-enter");
      playMusic();
      observeReveals();
    }, 350);
  });
  musicToggle.addEventListener("click", () => audio.paused ? playMusic() : audio.pause());
  $("#volume").addEventListener("input", e => { audio.volume = Number(e.target.value); });

  $("#toggleAppreciation").addEventListener("click", e => {
    const grid = $("#appreciationGrid"), show = grid.hidden;
    grid.hidden = !show;
    e.currentTarget.setAttribute("aria-expanded", String(show));
    e.currentTarget.textContent = show ? "Close the little reminders ↑" : "Remind me of the little things ♡";
    if (show) grid.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  });

  // Photo lightbox with previous/next controls, Escape, and focus restoration.
  const lightbox = $("#lightbox"), lbImage = $("#lightboxImage"), lbCaption = $("#lightboxCaption");
  let currentPhoto = 0, lastFocused = null;
  function showPhoto(index) {
    currentPhoto = (index + data.gallery.length) % data.gallery.length;
    const item = data.gallery[currentPhoto];
    lbImage.src = imagePath(item.image); lbImage.alt = item.caption; lbCaption.textContent = item.caption;
    lbImage.onerror = () => { lbImage.removeAttribute("src"); lbImage.alt = "Photo not added yet"; lbCaption.textContent = `Add ${item.image} to public/images/ to show this memory.`; };
  }
  function openLightbox(index) {
    lastFocused = document.activeElement; showPhoto(index); lightbox.hidden = false; document.body.classList.add("modal-open"); $("#lightboxClose").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true; document.body.classList.remove("modal-open"); if (lastFocused) lastFocused.focus();
  }
  $$(".gallery-item").forEach(button => button.addEventListener("click", () => openLightbox(Number(button.dataset.galleryIndex))));
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
  $("#lightboxNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  // Letter envelope opens and closes; text is editable in data.js.
  const letterOpen = $("#letterOpen"), letterPaper = $("#letterPaper");
  letterOpen.addEventListener("click", () => {
    letterPaper.hidden = false; letterOpen.classList.add("opened"); letterOpen.setAttribute("aria-expanded", "true");
    letterPaper.classList.remove("paper-close"); letterPaper.classList.add("paper-open");
    letterPaper.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  });
  $("#letterClose").addEventListener("click", () => {
    letterPaper.classList.remove("paper-open"); letterPaper.classList.add("paper-close");
    letterOpen.classList.remove("opened"); letterOpen.setAttribute("aria-expanded", "false");
    window.setTimeout(() => { letterPaper.hidden = true; letterOpen.focus(); }, reducedMotion ? 0 : 250);
  });

  $$("[data-final]").forEach(button => button.addEventListener("click", () => {
    const response = data.finalResponses[button.dataset.final];
    $("#finalResponse").textContent = response; $("#finalResponse").hidden = false;
    $$(".final-section .button").forEach(b => b.classList.toggle("chosen", b === button));
  }));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function observeReveals() {
    const revealEls = $$(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) { revealEls.forEach(el => el.classList.add("visible")); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  }
  function showToast(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 4800);
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (!lightbox.hidden) closeLightbox();
      else if (!letterPaper.hidden) $("#letterClose").click();
    }
    if (!lightbox.hidden && e.key === "ArrowRight") showPhoto(currentPhoto + 1);
    if (!lightbox.hidden && e.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  });
  // All anchors use native hash navigation with CSS smooth scrolling.
  observeReveals();
})();

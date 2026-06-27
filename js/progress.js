/* =====================================================
   HapyBody+ — progress.js v2.0
   Vista de Progreso Físico + Hábitos + Agua
   ===================================================== */

const ProgressView = (() => {
  // ---- Render habits grid ----
  function renderHabits() {
    const habits = Storage.Habits.get();
    const done   = habits.filter(h => h.done).length;
    const total  = habits.length;
    const pct    = Math.round((done / total) * 100);

    const pctEl = document.getElementById('habits-pct');
    const barEl = document.getElementById('habits-bar');
    if (pctEl) pctEl.textContent = `${done}/${total}`;
    if (barEl) barEl.style.width = `${pct}%`;

    const grid = document.getElementById('habits-grid');
    if (!grid) return;

    grid.innerHTML = habits.map(h => `
      <div class="habit-card ${h.done ? 'done' : ''}"
           onclick="ProgressView.toggleHabit('${h.id}')"
           role="checkbox" aria-checked="${h.done}" aria-label="${h.name}">
        <span class="habit-icon">${h.icon}</span>
        <span class="habit-name">${h.name}</span>
        <span class="habit-toggle-mark">${h.done ? '✓' : ''}</span>
      </div>
    `).join('');
  }

  // ---- Render water glasses ----
  function renderWater() {
    const count  = Storage.Water.get();
    const goal   = 8;
    const display = document.getElementById('water-display');
    if (display) display.textContent = `${count} / ${goal} vasos`;

    const glassesEl = document.getElementById('water-glasses');
    if (!glassesEl) return;

    let html = '';
    const total = Math.max(goal, count);
    for (let i = 0; i < total; i++) {
      const filled = i < count;
      html += `
        <div class="water-glass ${filled ? 'filled' : ''}"
             onclick="ProgressView.addWater()"
             title="${filled ? 'Lleno' : 'Vacío'}"
             role="button" aria-label="Vaso ${i + 1}">
          <div class="water-glass-fill"></div>
          <span class="water-glass-emoji">${filled ? '💧' : ''}</span>
        </div>
      `;
    }
    glassesEl.innerHTML = html;
  }

  // ---- Render mini weight chart (canvas) ----
  function renderWeightChart() {
    const canvas = document.getElementById('weight-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Redimensionar dinámicamente según la densidad de píxeles física (evita pixelación)
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.offsetWidth || 600;
    const displayHeight = canvas.offsetHeight || 100;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = displayWidth;
    const H = displayHeight;
    const all  = Storage.Progress.getAll().slice().reverse(); // oldest first

    // Only render if we have at least 2 records
    if (all.length < 2) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#4d5b78';
      ctx.font = '12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Registra 2+ medidas para ver el gráfico', W / 2, H / 2);
      return;
    }

    const weights = all.map(p => p.weight).filter(w => w != null && w > 0);
    if (weights.length < 2) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#4d5b78';
      ctx.font = '12px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Registra 2+ medidas con peso para ver el gráfico', W / 2, H / 2);
      return;
    }

    const pad = 20;
    const minW = Math.min(...weights) - 2;
    const maxW = Math.max(...weights) + 2;

    // Compute points
    const points = weights.map((w, i) => ({
      x: pad + (i / (weights.length - 1)) * (W - 2 * pad),
      y: H - pad - ((w - minW) / (maxW - minW)) * (H - 2 * pad),
    }));

    // Get accent color
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? '#00f07a' : '#059669';
    const fillColor = isDark ? 'rgba(0,240,122,0.1)' : 'rgba(5,150,105,0.08)';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#8b98b5' : '#475569';

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + (i / 4) * (H - 2 * pad);
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
    }

    // Fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, H - pad);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - pad);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cpx = (points[i - 1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Dots + labels
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
      ctx.fillStyle = textColor;
      ctx.font = `bold 10px Outfit, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`${weights[i]}`, p.x, p.y - 8);
    });
  }

  // ---- Render latest stats ----
  function renderLatestStats() {
    const latest = Storage.Progress.getLast();
    const all    = Storage.Progress.getAll();

    const fields = [
      { id: 'stat-weight', key: 'weight', unit: 'kg' },
      { id: 'stat-waist',  key: 'waist',  unit: 'cm' },
      { id: 'stat-arm',    key: 'arm',    unit: 'cm' },
      { id: 'stat-chest',  key: 'chest',  unit: 'cm' },
    ];

    if (latest) {
      fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.textContent = latest[f.key] || '—';
      });

      // Delta vs previous
      if (all.length >= 2) {
        const prev = all[1];
        fields.forEach(f => {
          const deltaEl = document.getElementById(`delta-${f.key}`);
          if (!deltaEl) return;
          if (latest[f.key] && prev[f.key]) {
            const diff = parseFloat((latest[f.key] - prev[f.key]).toFixed(1));
            if (diff !== 0) {
              deltaEl.className = `stat-delta ${diff < 0 ? (f.key === 'weight' || f.key === 'waist' ? 'positive' : 'negative') : (f.key === 'weight' || f.key === 'waist' ? 'negative' : 'positive')}`;
              deltaEl.innerHTML = `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff)}${f.unit}`;
            } else {
              deltaEl.textContent = '—';
              deltaEl.className = 'stat-delta';
            }
          }
        });

        // Comparison message
        const msgs = [];
        if (latest.weight && prev.weight) {
          const diff = parseFloat((latest.weight - prev.weight).toFixed(1));
          if (diff < 0) msgs.push(`📉 Bajaste ${Math.abs(diff)} kg desde tu último registro`);
          else if (diff > 0) msgs.push(`📈 Subiste ${diff} kg desde tu último registro`);
          else msgs.push('⚖️ Tu peso se mantiene estable');
        }
        if (latest.waist && prev.waist) {
          const diff = parseFloat((latest.waist - prev.waist).toFixed(1));
          if (diff < 0) msgs.push(`✅ Tu cintura bajó ${Math.abs(diff)} cm ¡bien!`);
          else if (diff > 0) msgs.push(`Cintura: +${diff} cm respecto al anterior`);
        }

        const compareEl = document.getElementById('progress-compare-msg');
        if (compareEl) {
          if (msgs.length > 0) {
            compareEl.style.display = 'block';
            compareEl.innerHTML = msgs.map(m => `<div>💬 ${m}</div>`).join('');
          } else {
            compareEl.style.display = 'none';
          }
        }
      }
    } else {
      fields.forEach(f => {
        const el = document.getElementById(f.id);
        if (el) el.textContent = '—';
      });
      const compareEl = document.getElementById('progress-compare-msg');
      if (compareEl) compareEl.style.display = 'none';
    }
  }

  // ---- Render history list ----
  function renderHistory() {
    const list      = Storage.Progress.getAll();
    const container = document.getElementById('progress-history-list');
    const empty     = document.getElementById('progress-empty');

    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '';
      container.appendChild(empty);
      empty.style.display = 'flex';
      return;
    }

    empty.style.display = 'none';

    container.innerHTML = list.map(p => {
      const dateStr = new Date(p.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const stats = [
        p.weight ? `<span class="progress-stat-chip"><strong>${p.weight}</strong> kg</span>` : '',
        p.waist  ? `<span class="progress-stat-chip">Cintura: <strong>${p.waist}</strong> cm</span>` : '',
        p.arm    ? `<span class="progress-stat-chip">Brazo: <strong>${p.arm}</strong> cm</span>` : '',
        p.chest  ? `<span class="progress-stat-chip">Pecho: <strong>${p.chest}</strong> cm</span>` : '',
      ].filter(Boolean).join('');

      return `
        <div class="progress-history-item" id="prog-${p.id}">
          <div class="progress-history-header">
            <span class="progress-history-date">📅 ${dateStr}</span>
            <button class="btn-icon" onclick="ProgressView.deleteProgress('${p.id}')"
                    aria-label="Eliminar registro">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
          <div class="progress-stats-row">${stats || '<span style="color:var(--text-muted);font-size:0.8rem">Sin datos de medidas</span>'}</div>
          ${p.note ? `<div class="progress-note-text">"${escapeHtml(p.note)}"</div>` : ''}
        </div>
      `;
    }).join('');
  }

  // ---- Full render ----
  function render() {
    renderHabits();
    renderWater();
    renderLatestStats();
    renderHistory();
    // Defer chart slightly to ensure canvas is visible
    setTimeout(renderWeightChart, 50);
  }

  // ---- Toggle habit ----
  function toggleHabit(id) {
    Storage.Habits.toggle(id);
    renderHabits();
    DashboardView.render();
    const habits = Storage.Habits.get();
    const done   = habits.filter(h => h.done).length;
    if (done === habits.length) Toast.show('¡Todos los hábitos completados! 🌟', 'success');
    else Toast.show('Hábito actualizado ✓', 'default', 1500);
  }

  // ---- Add water ----
  function addWater() {
    const val = Storage.Water.add();
    renderWater();
    DashboardView.render();
    if (val >= 8) Toast.show('¡Meta de agua alcanzada! 💧', 'success');
    else          Toast.show(`+1 vaso · ${val}/8 hoy`, 'default', 1600);
  }

  // ---- Save progress ----
  function saveProgress() {
    const weight = parseFloat(document.getElementById('prog-weight')?.value) || null;
    const waist  = parseFloat(document.getElementById('prog-waist')?.value)  || null;
    const arm    = parseFloat(document.getElementById('prog-arm')?.value)    || null;
    const chest  = parseFloat(document.getElementById('prog-chest')?.value)  || null;
    const note   = document.getElementById('prog-note')?.value.trim() || '';

    if (!weight && !waist && !arm && !chest) {
      Toast.show('Registra al menos una medida', 'error');
      return;
    }

    Storage.Progress.add({ weight, waist, arm, chest, note });
    Modal.close('progress-modal');

    // Clear form
    ['prog-weight','prog-waist','prog-arm','prog-chest','prog-note'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    render();
    DashboardView.render();
    Toast.show('Medidas registradas ✓', 'success');
  }

  // ---- Delete progress ----
  function deleteProgress(id) {
    if (!confirm('¿Eliminar este registro?')) return;
    Storage.Progress.delete(id);
    render();
    Toast.show('Registro eliminado', 'default');
  }

  // ---- Init ----
  function init() {
    document.getElementById('water-plus-btn')?.addEventListener('click', addWater);
    document.getElementById('water-reset-btn')?.addEventListener('click', () => {
      if (!confirm('¿Reiniciar el contador de agua?')) return;
      Storage.Water.reset();
      renderWater();
      DashboardView.render();
      Toast.show('Contador de agua reiniciado', 'default');
    });

    document.getElementById('add-progress-btn')?.addEventListener('click', () => Modal.open('progress-modal'));
    document.getElementById('add-progress-btn-empty')?.addEventListener('click', () => Modal.open('progress-modal'));
    document.getElementById('progress-modal-save')?.addEventListener('click', saveProgress);

    // Re-render chart on window resize
    window.addEventListener('resize', () => {
      if (document.getElementById('view-progress').classList.contains('active')) {
        renderWeightChart();
      }
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { render, init, toggleHabit, addWater, deleteProgress };
})();

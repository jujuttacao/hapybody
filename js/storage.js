/* =====================================================
   HapyBody+ — storage.js v2.0
   Capa de abstracción para localStorage
   ===================================================== */

const Storage = (() => {
  // ---- Keys ----
  const KEYS = {
    USER:        'hb_user',
    EXERCISES:   'hb_exercises',
    SUPPLEMENTS: 'hb_supplements',
    MEDICATIONS: 'hb_medications',
    MEALS:       'hb_meals',
    PLATE:       'hb_plate',
    PROGRESS:    'hb_progress',
    HABITS:      'hb_habits',
    WATER:       'hb_water',
    LAST_DATE:   'hb_last_date',
    STREAK:      'hb_streak',
    THEME:       'hb_theme',
  };

  // ---- Generic helpers ----
  function get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
      console.warn('Storage full', e);
    }
  }

  function remove(key) { localStorage.removeItem(key); }

  // ---- ID generator ----
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---- User ----
  const User = {
    get: () => get(KEYS.USER, null),
    set: (data) => set(KEYS.USER, data),
  };

  // ---- Theme ----
  const Theme = {
    get: () => get(KEYS.THEME, 'dark'),
    set: (theme) => set(KEYS.THEME, theme),
    toggle: () => {
      const current = get(KEYS.THEME, 'dark');
      const next = current === 'dark' ? 'light' : 'dark';
      set(KEYS.THEME, next);
      return next;
    }
  };

  // ---- Date helpers ----
  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function checkAndResetDay() {
    const lastDate = get(KEYS.LAST_DATE, null);
    const today = todayStr();

    if (lastDate !== today) {
      // Reset daily taken states
      const supps = get(KEYS.SUPPLEMENTS, []);
      supps.forEach(s => { s.taken = false; });
      set(KEYS.SUPPLEMENTS, supps);

      const meds = get(KEYS.MEDICATIONS, []);
      meds.forEach(m => { m.taken = false; });
      set(KEYS.MEDICATIONS, meds);

      // Reset habits
      set(KEYS.HABITS, getDefaultHabits());

      // Reset water
      set(KEYS.WATER, 0);

      // Reset plate
      set(KEYS.PLATE, { protein: false, carb: false, veggies: false, fruit: false, water: false });

      // Update streak
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (lastDate === yesterdayStr) {
          const streak = get(KEYS.STREAK, 0);
          set(KEYS.STREAK, streak + 1);
        } else {
          set(KEYS.STREAK, 1);
        }
      } else {
        set(KEYS.STREAK, 1);
      }

      set(KEYS.LAST_DATE, today);
    }
  }

  // ---- Exercises ----
  const Exercises = {
    getAll: () => get(KEYS.EXERCISES, []),
    getByDay: (day) => get(KEYS.EXERCISES, []).filter(e => e.day === day),
    add: (data) => {
      const list = get(KEYS.EXERCISES, []);
      const item = { id: uid(), ...data, completed: false, createdAt: Date.now() };
      list.push(item);
      set(KEYS.EXERCISES, list);
      return item;
    },
    toggleComplete: (id) => {
      const list = get(KEYS.EXERCISES, []);
      const idx = list.findIndex(e => e.id === id);
      if (idx !== -1) {
        list[idx].completed = !list[idx].completed;
        set(KEYS.EXERCISES, list);
      }
      return list[idx];
    },
    delete: (id) => {
      const list = get(KEYS.EXERCISES, []).filter(e => e.id !== id);
      set(KEYS.EXERCISES, list);
    },
    getTodayGroup: () => {
      const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const today = days[new Date().getDay()];
      return get(KEYS.EXERCISES, []).filter(e => e.day === today);
    }
  };

  // ---- Supplements ----
  const Supplements = {
    getAll: () => get(KEYS.SUPPLEMENTS, []),
    add: (data) => {
      const list = get(KEYS.SUPPLEMENTS, []);
      const item = { id: uid(), ...data, taken: false, createdAt: Date.now() };
      list.push(item);
      set(KEYS.SUPPLEMENTS, list);
      return item;
    },
    toggleTaken: (id) => {
      const list = get(KEYS.SUPPLEMENTS, []);
      const idx = list.findIndex(s => s.id === id);
      if (idx !== -1) {
        list[idx].taken = !list[idx].taken;
        set(KEYS.SUPPLEMENTS, list);
      }
      return list[idx];
    },
    delete: (id) => {
      const list = get(KEYS.SUPPLEMENTS, []).filter(s => s.id !== id);
      set(KEYS.SUPPLEMENTS, list);
    }
  };

  // ---- Medications ----
  const Medications = {
    getAll: () => get(KEYS.MEDICATIONS, []),
    add: (data) => {
      const list = get(KEYS.MEDICATIONS, []);
      const item = { id: uid(), ...data, taken: false, createdAt: Date.now() };
      list.push(item);
      set(KEYS.MEDICATIONS, list);
      return item;
    },
    toggleTaken: (id) => {
      const list = get(KEYS.MEDICATIONS, []);
      const idx = list.findIndex(m => m.id === id);
      if (idx !== -1) {
        list[idx].taken = !list[idx].taken;
        set(KEYS.MEDICATIONS, list);
      }
      return list[idx];
    },
    delete: (id) => {
      const list = get(KEYS.MEDICATIONS, []).filter(m => m.id !== id);
      set(KEYS.MEDICATIONS, list);
    }
  };

  // ---- Meals ----
  const Meals = {
    getToday: () => {
      const today = todayStr();
      return get(KEYS.MEALS, []).filter(m => m.date === today);
    },
    getAll: () => get(KEYS.MEALS, []),
    add: (data) => {
      const list = get(KEYS.MEALS, []);
      const item = { id: uid(), ...data, date: todayStr(), createdAt: Date.now() };
      list.push(item);
      set(KEYS.MEALS, list);
      return item;
    },
    delete: (id) => {
      const list = get(KEYS.MEALS, []).filter(m => m.id !== id);
      set(KEYS.MEALS, list);
    }
  };

  // ---- Plate ----
  const defaultPlate = () => ({ protein: false, carb: false, veggies: false, fruit: false, water: false });

  const Plate = {
    get: () => get(KEYS.PLATE, defaultPlate()),
    set: (data) => set(KEYS.PLATE, data),
    toggle: (key) => {
      const p = get(KEYS.PLATE, defaultPlate());
      p[key] = !p[key];
      set(KEYS.PLATE, p);
      return p;
    }
  };

  // ---- Progress ----
  const Progress = {
    getAll: () => get(KEYS.PROGRESS, []).sort((a, b) => b.createdAt - a.createdAt),
    getLast: () => {
      const list = get(KEYS.PROGRESS, []).sort((a, b) => b.createdAt - a.createdAt);
      return list[0] || null;
    },
    add: (data) => {
      const list = get(KEYS.PROGRESS, []);
      const item = { id: uid(), ...data, createdAt: Date.now() };
      list.push(item);
      set(KEYS.PROGRESS, list);
      return item;
    },
    delete: (id) => {
      const list = get(KEYS.PROGRESS, []).filter(p => p.id !== id);
      set(KEYS.PROGRESS, list);
    }
  };

  // ---- Habits ----
  function getDefaultHabits() {
    return [
      { id: 'water',    name: 'Tomé agua',        icon: '💧', done: false },
      { id: 'training', name: 'Entrené',           icon: '🏋️', done: false },
      { id: 'sleep',    name: 'Dormí bien',        icon: '😴', done: false },
      { id: 'food',     name: 'Comí saludable',    icon: '🥗', done: false },
      { id: 'supps',    name: 'Tomé suplemento',   icon: '💊', done: false },
      { id: 'stretch',  name: 'Estiramientos',     icon: '🧘', done: false },
    ];
  }

  const Habits = {
    get: () => {
      const saved = get(KEYS.HABITS, null);
      if (!saved) return getDefaultHabits();
      // Merge in case new habits were added
      const defaults = getDefaultHabits();
      return defaults.map(def => {
        const saved_h = saved.find(s => s.id === def.id);
        return saved_h ? { ...def, done: saved_h.done } : def;
      });
    },
    toggle: (id) => {
      const list = get(KEYS.HABITS, getDefaultHabits());
      const idx = list.findIndex(h => h.id === id);
      if (idx !== -1) {
        list[idx].done = !list[idx].done;
        set(KEYS.HABITS, list);
      }
      return list;
    },
    getDefaults: getDefaultHabits
  };

  // ---- Water ----
  const Water = {
    get: () => get(KEYS.WATER, 0),
    set: (val) => set(KEYS.WATER, Math.max(0, val)),
    add: (goal = 8) => {
      const current = get(KEYS.WATER, 0);
      const newVal = Math.min(current + 1, goal + 4); // allow going over
      set(KEYS.WATER, newVal);
      return newVal;
    },
    reset: () => { set(KEYS.WATER, 0); return 0; }
  };

  // ---- Streak ----
  const Streak = {
    get: () => get(KEYS.STREAK, 0)
  };

  // ---- Export all data as JSON ----
  function exportData() {
    const data = {
      exportDate: new Date().toISOString(),
      app: 'HapyBody+',
      user:        User.get(),
      exercises:   Exercises.getAll(),
      supplements: Supplements.getAll(),
      medications: Medications.getAll(),
      meals:       Meals.getAll(),
      plate:       Plate.get(),
      progress:    Progress.getAll(),
      habits:      Habits.get(),
      water:       Water.get(),
      streak:      Streak.get(),
    };
    return JSON.stringify(data, null, 2);
  }

  // ---- Reset all data ----
  function resetAll() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }

  // ---- Reset daily progress manually ----
  function resetDay() {
    // 1. Water
    set(KEYS.WATER, 0);

    // 2. Habits
    set(KEYS.HABITS, getDefaultHabits());

    // 3. Supplements
    const supps = get(KEYS.SUPPLEMENTS, []);
    supps.forEach(s => { s.taken = false; });
    set(KEYS.SUPPLEMENTS, supps);

    // 4. Medications
    const meds = get(KEYS.MEDICATIONS, []);
    meds.forEach(m => { m.taken = false; });
    set(KEYS.MEDICATIONS, meds);

    // 5. Plate
    set(KEYS.PLATE, { protein: false, carb: false, veggies: false, fruit: false, water: false });
  }

  // ---- Seed demo data (first visit) ----
  function seedDemoData() {
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const today = days[new Date().getDay()];

    // Exercises
    if (get(KEYS.EXERCISES, []).length === 0) {
      const allDays = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
      const todayIdx = allDays.indexOf(today);
      const nextDay  = allDays[(todayIdx + 1) % 7];
      const prevDay  = allDays[(todayIdx + 6) % 7];

      [
        { day: today,   muscleGroup: 'Piernas',          exercise: 'Sentadilla',            sets: 4, reps: 10, weight: 60 },
        { day: today,   muscleGroup: 'Piernas',          exercise: 'Prensa de pierna',       sets: 3, reps: 12, weight: 100 },
        { day: today,   muscleGroup: 'Piernas',          exercise: 'Extensión de cuádriceps',sets: 3, reps: 15, weight: 45 },
        { day: nextDay, muscleGroup: 'Pecho y tríceps',  exercise: 'Press banca',            sets: 4, reps: 10, weight: 70 },
        { day: nextDay, muscleGroup: 'Pecho y tríceps',  exercise: 'Fondos en paralelas',    sets: 3, reps: 12, weight: 0  },
        { day: prevDay, muscleGroup: 'Espalda y bíceps', exercise: 'Jalón al pecho',         sets: 4, reps: 12, weight: 55 },
        { day: prevDay, muscleGroup: 'Espalda y bíceps', exercise: 'Curl de bíceps',         sets: 3, reps: 12, weight: 15 },
      ].forEach(e => Exercises.add(e));
    }

    // Supplements
    if (get(KEYS.SUPPLEMENTS, []).length === 0) {
      Supplements.add({ name: 'Creatina',      category: 'creatina', hour: '19:00', frequency: 'Diario',               note: 'Con agua después del entreno' });
      Supplements.add({ name: 'Proteína Whey', category: 'proteina', hour: '20:00', frequency: 'Días de entrenamiento', note: 'Con leche' });
      Supplements.add({ name: 'Vitamina D',    category: 'vitaminas', hour: '08:00', frequency: 'Diario',               note: 'Con el desayuno' });
    }

    // Medications
    if (get(KEYS.MEDICATIONS, []).length === 0) {
      Medications.add({ name: 'Omega 3', dose: '2 cápsulas', hour: '12:00', frequency: 'Diario' });
    }

    // Meals
    if (Meals.getToday().length === 0) {
      Meals.add({ type: 'desayuno', description: 'Avena con plátano, huevos revueltos y café', healthLevel: 'alto', hour: '07:30' });
      Meals.add({ type: 'almuerzo', description: 'Arroz integral, pechuga a la plancha y ensalada mixta', healthLevel: 'alto', hour: '12:30' });
    }

    // Water
    if (get(KEYS.WATER, null) === null) Water.set(4);

    // Habits demo
    if (!get(KEYS.HABITS, null)) {
      const h = getDefaultHabits();
      h[0].done = true;
      h[2].done = true;
      h[3].done = true;
      set(KEYS.HABITS, h);
    }

    // Progress records
    if (get(KEYS.PROGRESS, []).length === 0) {
      const list = [
        { id: uid(), weight: 70, waist: 82, arm: 35, chest: 96, note: 'Empezando el reto de 3 meses',        createdAt: Date.now() - 14 * 86400000 },
        { id: uid(), weight: 69, waist: 81, arm: 36, chest: 97, note: 'Me siento con más energía esta semana', createdAt: Date.now() - 7  * 86400000 },
      ];
      set(KEYS.PROGRESS, list);
    }
  }

  return {
    User, Theme, Exercises, Supplements, Medications,
    Meals, Plate, Progress, Habits, Water, Streak,
    checkAndResetDay, todayStr, seedDemoData,
    exportData, resetAll, resetDay
  };
})();

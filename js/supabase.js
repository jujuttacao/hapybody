/* =====================================================
   HapyBody+ — supabase.js v1.0
   Gestor del cliente de Supabase, Autenticación y Sincronización
   ===================================================== */

const SupabaseClient = (() => {
  let client = null;

  // LocalStorage keys for Supabase config
  const KEYS = {
    URL: 'hb_sb_url',
    KEY: 'hb_sb_key'
  };

  // Default credentials (pre-configured for HapyBody+ production)
  const DEFAULTS = {
    URL: 'https://nwqcldkkhyyilrxzovpk.supabase.co',
    KEY: 'sb_publishable_NpcNIBjQ8KtuGLUqhtnpPQ_cJG_ED57'
  };

  // Get credentials — use hardcoded defaults if nothing is stored
  function getCredentials() {
    return {
      url: localStorage.getItem(KEYS.URL) || DEFAULTS.URL,
      key: localStorage.getItem(KEYS.KEY) || DEFAULTS.KEY
    };
  }

  // Set credentials
  function setCredentials(url, key) {
    if (!url || !key) {
      localStorage.removeItem(KEYS.URL);
      localStorage.removeItem(KEYS.KEY);
      client = null;
    } else {
      localStorage.setItem(KEYS.URL, url.trim());
      localStorage.setItem(KEYS.KEY, key.trim());
      init();
    }
  }

  // Initialize client
  function init() {
    const creds = getCredentials();
    if (creds.url && creds.key) {
      try {
        // Detect createClient from multiple CDN UMD export patterns
        let createClientFn = null;
        if (window.supabase && typeof window.supabase.createClient === 'function') {
          createClientFn = window.supabase.createClient;
        } else if (window.supabaseJs && typeof window.supabaseJs.createClient === 'function') {
          createClientFn = window.supabaseJs.createClient;
        } else if (typeof window.createClient === 'function') {
          createClientFn = window.createClient;
        }

        if (createClientFn) {
          client = createClientFn(creds.url, creds.key, {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            }
          });
          console.log('✅ Supabase client initialized successfully');
        } else {
          console.warn('⚠️ Supabase SDK not found on window — retrying in 500ms');
          setTimeout(init, 500);
        }
      } catch (e) {
        console.error('Error initializing Supabase client:', e);
        client = null;
      }
    }
    return client;
  }

  // Check if connection is active
  function isConnected() {
    return client !== null;
  }

  // Run test connection
  async function testConnection(url, key) {
    try {
      let createClientFn = (window.supabase && window.supabase.createClient)
        || (window.supabaseJs && window.supabaseJs.createClient)
        || window.createClient;
      if (!createClientFn) throw new Error('SDK not loaded');
      const tempClient = createClientFn(url.trim(), key.trim());
      const { data, error } = await tempClient.from('profiles').select('id').limit(1);
      // If we get here without auth errors, or even if it's empty, we connected successfully
      if (error && error.code !== 'PGRST116') { // PGRST116 is empty (okay)
        // Check if error is just RLS or query, meaning the server responded!
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          throw new Error(error.message);
        }
      }
      return true;
    } catch (e) {
      console.warn('Test connection failed:', e);
      return false;
    }
  }

  // ---- Authentication ----
  async function signUp(email, password, name, goal) {
    if (!isConnected()) throw new Error('Supabase no está configurado');

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create profile row
      const { error: profileError } = await client.from('profiles').insert({
        id: data.user.id,
        name: name,
        goal: goal,
        join_date: new Date().toISOString().split('T')[0],
        streak: 0,
        last_date: new Date().toISOString().split('T')[0]
      });

      if (profileError) console.error('Error creating profile row:', profileError);
    }

    return data;
  }

  async function login(email, password) {
    if (!isConnected()) throw new Error('Supabase no está configurado');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function logout() {
    if (!isConnected()) return;
    await client.auth.signOut();
  }

  function getUser() {
    if (!isConnected()) return null;
    return client.auth.user ? client.auth.user() : client.auth.session ? client.auth.session().user : null;
  }

  async function getSessionUser() {
    if (!isConnected()) return null;
    const { data } = await client.auth.getUser();
    return data.user || null;
  }

  // ---- Database Sync Helpers ----

  // Fetch everything from Cloud and overwrite Local
  async function downloadAllCloudToLocal(userId) {
    if (!isConnected() || !userId) return null;

    try {
      // 1. Fetch Profile
      const { data: profile } = await client.from('profiles').select('*').eq('id', userId).single();
      if (profile) {
        localStorage.setItem('hb_user', JSON.stringify({ name: profile.name, goal: profile.goal, joinDate: profile.join_date }));
        localStorage.setItem('hb_streak', JSON.stringify(profile.streak));
        if (profile.last_date) localStorage.setItem('hb_last_date', JSON.stringify(profile.last_date));
      }

      // 2. Fetch Exercises
      const { data: exercises } = await client.from('exercises').select('*').eq('user_id', userId);
      if (exercises) {
        localStorage.setItem('hb_exercises', JSON.stringify(exercises.map(e => ({
          id: e.id,
          day: e.day,
          muscleGroup: e.muscle_group,
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          completed: e.completed,
          createdAt: new Date(e.created_at).getTime()
        }))));
      }

      // 3. Fetch Supplements
      const { data: supps } = await client.from('supplements').select('*').eq('user_id', userId);
      if (supps) {
        localStorage.setItem('hb_supplements', JSON.stringify(supps.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          hour: s.hour,
          frequency: s.frequency,
          note: s.note,
          taken: s.taken,
          createdAt: new Date(s.created_at).getTime()
        }))));
      }

      // 4. Fetch Medications
      const { data: meds } = await client.from('medications').select('*').eq('user_id', userId);
      if (meds) {
        localStorage.setItem('hb_medications', JSON.stringify(meds.map(m => ({
          id: m.id,
          name: m.name,
          dose: m.dose,
          hour: m.hour,
          frequency: m.frequency,
          taken: m.taken,
          createdAt: new Date(m.created_at).getTime()
        }))));
      }

      // 5. Fetch Meals
      const { data: meals } = await client.from('meals').select('*').eq('user_id', userId);
      if (meals) {
        localStorage.setItem('hb_meals', JSON.stringify(meals.map(m => ({
          id: m.id,
          type: m.type,
          description: m.description,
          healthLevel: m.health_level,
          hour: m.hour,
          date: m.date,
          createdAt: new Date(m.created_at).getTime()
        }))));
      }

      // 6. Fetch Progress
      const { data: progress } = await client.from('progress').select('*').eq('user_id', userId);
      if (progress) {
        localStorage.setItem('hb_progress', JSON.stringify(progress.map(p => ({
          id: p.id,
          weight: p.weight,
          waist: p.waist,
          arm: p.arm,
          chest: p.chest,
          note: p.note,
          createdAt: new Date(p.created_at).getTime()
        }))));
      }

      // 7. Fetch Today's Daily Stats
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await client.from('daily_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle();

      if (stats) {
        localStorage.setItem('hb_water', JSON.stringify(stats.water));
        localStorage.setItem('hb_plate', JSON.stringify({
          protein: stats.plate_protein,
          carb: stats.plate_carb,
          veggies: stats.plate_veggies,
          fruit: stats.plate_fruit,
          water: stats.plate_water
        }));
        
        // Reconstruct habits from completed array
        const habitsDefaults = [
          { id: 'water',    name: 'Tomé agua',        icon: '💧', done: false },
          { id: 'training', name: 'Entrené',           icon: '🏋️', done: false },
          { id: 'sleep',    name: 'Dormí bien',        icon: '😴', done: false },
          { id: 'food',     name: 'Comí saludable',    icon: '🥗', done: false },
          { id: 'supps',    name: 'Tomé suplemento',   icon: '💊', done: false },
          { id: 'stretch',  name: 'Estiramientos',     icon: '🧘', done: false },
        ];
        const loadedHabits = habitsDefaults.map(h => ({
          ...h,
          done: stats.completed_habits.includes(h.id)
        }));
        localStorage.setItem('hb_habits', JSON.stringify(loadedHabits));
      }

      return true;
    } catch (e) {
      console.error('Error downloading from Supabase:', e);
      return false;
    }
  }

  // Upload Local Storage to Cloud (e.g. on new login)
  async function uploadAllLocalToCloud(userId) {
    if (!isConnected() || !userId) return;

    try {
      // 1. Profile
      const localUser = JSON.parse(localStorage.getItem('hb_user') || 'null');
      if (localUser) {
        const streak = parseInt(localStorage.getItem('hb_streak') || '0');
        const lastDate = JSON.parse(localStorage.getItem('hb_last_date') || 'null');
        
        await client.from('profiles').upsert({
          id: userId,
          name: localUser.name,
          goal: localUser.goal,
          join_date: localUser.joinDate || new Date().toISOString().split('T')[0],
          streak: streak,
          last_date: lastDate,
          updated_at: new Date().toISOString()
        });
      }

      // 2. Exercises
      const exercises = JSON.parse(localStorage.getItem('hb_exercises') || '[]');
      if (exercises.length > 0) {
        const payload = exercises.map(e => ({
          id: e.id,
          user_id: userId,
          day: e.day,
          muscle_group: e.muscleGroup,
          exercise: e.exercise,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight || 0,
          completed: e.completed || false,
          created_at: new Date(e.createdAt || Date.now()).toISOString()
        }));
        await client.from('exercises').upsert(payload);
      }

      // 3. Supplements
      const supps = JSON.parse(localStorage.getItem('hb_supplements') || '[]');
      if (supps.length > 0) {
        const payload = supps.map(s => ({
          id: s.id,
          user_id: userId,
          name: s.name,
          category: s.category,
          hour: s.hour,
          frequency: s.frequency,
          note: s.note,
          taken: s.taken || false,
          created_at: new Date(s.createdAt || Date.now()).toISOString()
        }));
        await client.from('supplements').upsert(payload);
      }

      // 4. Medications
      const meds = JSON.parse(localStorage.getItem('hb_medications') || '[]');
      if (meds.length > 0) {
        const payload = meds.map(m => ({
          id: m.id,
          user_id: userId,
          name: m.name,
          dose: m.dose,
          hour: m.hour,
          frequency: m.frequency,
          taken: m.taken || false,
          created_at: new Date(m.createdAt || Date.now()).toISOString()
        }));
        await client.from('medications').upsert(payload);
      }

      // 5. Meals
      const meals = JSON.parse(localStorage.getItem('hb_meals') || '[]');
      if (meals.length > 0) {
        const payload = meals.map(m => ({
          id: m.id,
          user_id: userId,
          type: m.type,
          description: m.description,
          health_level: m.healthLevel,
          hour: m.hour,
          date: m.date || new Date().toISOString().split('T')[0],
          created_at: new Date(m.createdAt || Date.now()).toISOString()
        }));
        await client.from('meals').upsert(payload);
      }

      // 6. Progress
      const progress = JSON.parse(localStorage.getItem('hb_progress') || '[]');
      if (progress.length > 0) {
        const payload = progress.map(p => ({
          id: p.id,
          user_id: userId,
          weight: p.weight,
          waist: p.waist,
          arm: p.arm,
          chest: p.chest,
          note: p.note,
          created_at: new Date(p.createdAt || Date.now()).toISOString()
        }));
        await client.from('progress').upsert(payload);
      }

      // 7. Daily Stats
      const today = new Date().toISOString().split('T')[0];
      const water = parseInt(localStorage.getItem('hb_water') || '0');
      const plate = JSON.parse(localStorage.getItem('hb_plate') || '{"protein":false,"carb":false,"veggies":false,"fruit":false,"water":false}');
      const habits = JSON.parse(localStorage.getItem('hb_habits') || '[]');
      const completedHabits = habits.filter(h => h.done).map(h => h.id);

      await client.from('daily_stats').upsert({
        user_id: userId,
        date: today,
        water: water,
        plate_protein: plate.protein || false,
        plate_carb: plate.carb || false,
        plate_veggies: plate.veggies || false,
        plate_fruit: plate.fruit || false,
        plate_water: plate.water || false,
        completed_habits: completedHabits
      });

    } catch (e) {
      console.error('Error uploading local state to Supabase:', e);
    }
  }

  // --- Real-time single actions handlers ---

  async function updateProfileCloud(userProfile, streak, lastDate) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('profiles').upsert({
        id: user.id,
        name: userProfile.name,
        goal: userProfile.goal,
        join_date: userProfile.joinDate,
        streak: streak,
        last_date: lastDate,
        updated_at: new Date().toISOString()
      });
    } catch (e) { console.error('Sync profile failed:', e); }
  }

  async function saveExerciseCloud(ex) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('exercises').upsert({
        id: ex.id,
        user_id: user.id,
        day: ex.day,
        muscle_group: ex.muscleGroup,
        exercise: ex.exercise,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight || 0,
        completed: ex.completed || false,
        created_at: new Date(ex.createdAt || Date.now()).toISOString()
      });
    } catch(e) { console.error(e); }
  }

  async function deleteExerciseCloud(id) {
    if (!isConnected()) return;
    try {
      await client.from('exercises').delete().eq('id', id);
    } catch(e) { console.error(e); }
  }

  async function saveSupplementCloud(s) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('supplements').upsert({
        id: s.id,
        user_id: user.id,
        name: s.name,
        category: s.category,
        hour: s.hour,
        frequency: s.frequency,
        note: s.note,
        taken: s.taken || false,
        created_at: new Date(s.createdAt || Date.now()).toISOString()
      });
    } catch(e) { console.error(e); }
  }

  async function deleteSupplementCloud(id) {
    if (!isConnected()) return;
    try {
      await client.from('supplements').delete().eq('id', id);
    } catch(e) { console.error(e); }
  }

  async function saveMedicationCloud(m) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('medications').upsert({
        id: m.id,
        user_id: user.id,
        name: m.name,
        dose: m.dose,
        hour: m.hour,
        frequency: m.frequency,
        taken: m.taken || false,
        created_at: new Date(m.createdAt || Date.now()).toISOString()
      });
    } catch(e) { console.error(e); }
  }

  async function deleteMedicationCloud(id) {
    if (!isConnected()) return;
    try {
      await client.from('medications').delete().eq('id', id);
    } catch(e) { console.error(e); }
  }

  async function saveMealCloud(m) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('meals').upsert({
        id: m.id,
        user_id: user.id,
        type: m.type,
        description: m.description,
        health_level: m.healthLevel,
        hour: m.hour,
        date: m.date,
        created_at: new Date(m.createdAt || Date.now()).toISOString()
      });
    } catch(e) { console.error(e); }
  }

  async function deleteMealCloud(id) {
    if (!isConnected()) return;
    try {
      await client.from('meals').delete().eq('id', id);
    } catch(e) { console.error(e); }
  }

  async function saveProgressCloud(p) {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      await client.from('progress').upsert({
        id: p.id,
        user_id: user.id,
        weight: p.weight,
        waist: p.waist,
        arm: p.arm,
        chest: p.chest,
        note: p.note,
        created_at: new Date(p.createdAt || Date.now()).toISOString()
      });
    } catch(e) { console.error(e); }
  }

  async function deleteProgressCloud(id) {
    if (!isConnected()) return;
    try {
      await client.from('progress').delete().eq('id', id);
    } catch(e) { console.error(e); }
  }

  async function syncDailyStatsCloud() {
    const user = await getSessionUser();
    if (!isConnected() || !user) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const water = parseInt(localStorage.getItem('hb_water') || '0');
      const plate = JSON.parse(localStorage.getItem('hb_plate') || '{"protein":false,"carb":false,"veggies":false,"fruit":false,"water":false}');
      const habits = JSON.parse(localStorage.getItem('hb_habits') || '[]');
      const completedHabits = habits.filter(h => h.done).map(h => h.id);

      await client.from('daily_stats').upsert({
        user_id: user.id,
        date: today,
        water: water,
        plate_protein: plate.protein || false,
        plate_carb: plate.carb || false,
        plate_veggies: plate.veggies || false,
        plate_fruit: plate.fruit || false,
        plate_water: plate.water || false,
        completed_habits: completedHabits
      });
    } catch(e) { console.error('Sync daily stats failed:', e); }
  }

  // Self init on load
  init();

  return {
    setCredentials,
    getCredentials,
    isConnected,
    testConnection,
    signUp,
    login,
    logout,
    getUser,
    getSessionUser,
    downloadAllCloudToLocal,
    uploadAllLocalToCloud,
    updateProfileCloud,
    saveExerciseCloud,
    deleteExerciseCloud,
    saveSupplementCloud,
    deleteSupplementCloud,
    saveMedicationCloud,
    deleteMedicationCloud,
    saveMealCloud,
    deleteMealCloud,
    saveProgressCloud,
    deleteProgressCloud,
    syncDailyStatsCloud
  };
})();

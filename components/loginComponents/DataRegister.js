const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

let cachedData = null;
let loadPromise = null;

async function fetchData() {
  if (cachedData) return cachedData;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const res = await fetch(`${apiUrl}data-register`);
      const json = await res.json();
      if (!json.success) throw new Error('Erreur API');

      const d = json.data;

      const etablissementsObj = {};
      for (const etab of (d.etablissements || [])) {
        etablissementsObj[etab.nom] = {
          parcours: (etab.parcours || []).map((p) => p.nom),
        };
      }

      const optionsCampusObj = {};
      for (const tl of (d.types_logement || [])) {
        for (const oc of (tl.options_campus || [])) {
          const sectionsMap = {};
          for (const sec of (oc.sections || [])) {
            sectionsMap[sec.nom] = (sec.blocs || []).map((b) => b.nom);
          }
          optionsCampusObj[oc.nom] = { sections: sectionsMap };
        }
      }

      const quartiersArr = (d.quartiers || []).map((q) => q.nom);
      const villesArr = (d.villes || []).map((v) => v.nom);

      const niveauxMap = {};
      for (const etab of (d.etablissements || [])) {
        for (const parc of (etab.parcours || [])) {
          niveauxMap[parc.nom] = (parc.niveaux || []).map((n) => n.nom);
        }
      }

      const promotionsArr = (d.promotions || []).map((p) => ({
        nom: p.nom,
        annee: p.annee,
      }));

      cachedData = {
        etablissements: etablissementsObj,
        optionsCampus: optionsCampusObj,
        quartiers: quartiersArr,
        villes: villesArr,
        niveauxMap,
        promotions: promotionsArr,
      };
      return cachedData;
    } catch {
      cachedData = {
        etablissements: {},
        optionsCampus: {},
        quartiers: [],
        villes: [],
        niveauxMap: {},
        promotions: [],
      };
      return cachedData;
    }
  })();

  return loadPromise;
}

export async function init() {
  return fetchData();
}

export const etablissements = {};
export const optionsCampus = {};
export const quartiers = [];
export const villes = [];
export const niveauxMap = {};
export const promotions = [];

export async function refreshData() {
  cachedData = null;
  loadPromise = null;
  const data = await fetchData();
  Object.assign(etablissements, data.etablissements);
  Object.assign(optionsCampus, data.optionsCampus);
  quartiers.length = 0;
  quartiers.push(...data.quartiers);
  villes.length = 0;
  villes.push(...data.villes);
  Object.assign(niveauxMap, data.niveauxMap);
  promotions.length = 0;
  promotions.push(...data.promotions);
}

export function getNiveauxOptions(parcoursName) {
  return niveauxMap[parcoursName] || [];
}

export function getPromotionsOptions() {
  return promotions.map((p) => p.nom || p.annee?.toString() || '');
}

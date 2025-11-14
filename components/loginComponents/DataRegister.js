// Données des établissements de l'Université d'Antsiranana (UNA)
export const etablissements = {
  'ESP': {
    nom: 'École Supérieure Polytechnique (ESP)',
    parcours: ['Génie Électrique', 'Électronique et Informatique Industrielles', 'Génie Mécanique', 'Hydraulique Énergétique', 'Génie Civil']
  },
  'FACULTES_SCIENCES': {
    nom: 'Faculté des Sciences',
    parcours: ['Sciences Physiques', 'Chimie', 'Sciences de la Nature et de l\'Environnement']
  },
  'MEDECINE': {
    nom: 'Faculté de Médecine',
    parcours: ['Médecin Généraliste', 'Infirmier', 'Paramédical']
  },
  'DEGSP': {
    nom: 'Faculté de Droit, Économie, Gestion et Science Politique (DEGSP)',
    parcours: ['Formation initiale en Gestion', 'Formation en Science Politique', 'Formation en Droit']
  },
  'FLSH': {
    nom: 'Faculté des Lettres et des Sciences Humaines (FLSH)',
    parcours: ['Lettres Françaises', 'Lettres Anglo-Américaines']
  },
  'ENSET': {
    nom: 'École Normale Supérieure pour l\'Enseignement Technique (ENSET)',
    parcours: ['Professorat Technique en Génie Électrique', 'Professorat Technique en Génie Mécanique', 'Professorat Technique en Génie Mathématique et Informatique']
  },
  'IUSES': {
    nom: 'Institut Universitaire en Science de l\'Environnement et de la Société (IUSES)',
    parcours: ['Sciences de l\'Environnement', 'Sciences Sociales']
  },
  'ESAED': {
    nom: 'École Supérieure en Agronomie et Environnement de Diego (ESAED)',
    parcours: ['Agronomie', 'Environnement']
  },
  'ISAE': {
    nom: 'Institut Supérieur en Administration des Entreprises (ISAE)',
    parcours: ['Assistanat de Direction', 'Techniques Bancaires']
  },
  'ISTD': {
    nom: 'Institut Supérieur de Technologie d\'Antsiranana (IST-D)',
    parcours: ['Maintenance en Équipements Électro-Mécaniques', 'Maintenance en Équipements Frigorifiques et Thermiques', 'Maintenance des Systèmes Automatisés', 'Réseaux et Télécommunications', 'Technologie de l\'Information et du Multimédia', 'Technologie Navale', 'Bâtiment', 'Travaux Publics', 'Commerce', 'Tourisme et Gestion Hôtelière', 'Gestion Financière et Comptable', 'Techniques Bancaires et Assurance']
  }
};

export const quartiers = [
  'Ambalakazaha',
  'Ambalavola',
  'Ambohimitsinjo',
  'Anamakia',
  'Avenir',
  'Bazar Kely',
  'Cap Diego',
  'Cité Ouvrière',
  'Grand Pavois',
  'Lazaret Nord',
  'Lazaret Sud',
  'Mahatsara',
  'Mangarivotra',
  'Manongalaza',
  'Morafeno',
  'Place Kabary',
  'SCAMA',
  'Soafeno',
  'Tanambao III',
  'Tanambao IV',
  'Tanambao Nord',
  'Tanambao Sud',
  'Tanambao Tsena',
  'Tanambao V',
  'Tsaramandroso'
];
export const optionsCampus = {
  'Bloc': {
    nom: 'Bloc',
    options: ['Bloc A1', 'Bloc A3', 'Bloc A24', 'Bloc A25']
  },
  'PJ': {
    nom: 'Prefavé Jaune',
    options: ['PJ A11', 'PJ A12', 'PJ A15', 'PJ A16', 'PJX C1', 'PJX C4', 'PJ B27', 'PJ Foyer', 'PJ7 C6']
  },
  'PV': {
    nom: 'Prefavé Vert',
    options: ['PV F16', 'PV F02', 'PV K4']
  },
  'Belle Rose': {
    nom: 'Belle Rose',
    options: ['Porte 001', 'Porte 002', 'Porte 003', 'Porte 124', 'Porte 214', 'Porte 236']
  },
  'Batiment Master': {
    nom: 'Batiment Master',
    options: ['BM 01', 'BM 16', 'BM 21', 'BM 32']
  }
};

export const getNiveauxOptions = (selectedParcours) => {
  if (selectedParcours === 'Médecin Généraliste') {
    return Array.from({ length: 8 }, (_, i) => `${i + 1}ère année`);
  }
  return ['L1', 'L2', 'L3', 'M1', 'M2'];
};

export const getPromotionsOptions = () => {
  return Array.from({ length: 7 }, (_, i) => 2019 + i);
};

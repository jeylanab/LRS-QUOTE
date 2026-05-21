// src/data/pricingConfig.js

export const pricingConfig = {

  windowCleaning: {
    'semi-detached': { '2-3': 20, '4': 24, '5+': 35 },
    'detached':      { '2': 20, '3': 24, '4': 26, '5+': 35 },
    // PLACEHOLDER — confirm with Liam
    'terraced':      { '1-2': 18, '3': 20, '4': 22, '5+': 35 },
    'town-house':    { '2-3': 24, '4': 28, '5+': 35 },
    'bungalow':      { '1-2': 18, '3': 20, '4': 24, '5+': 35 },
    'flat':          { '1-2': 18, '3': 22, '4': 26, '5+': 35 },
  },

  windowAddons: {
    conservatory: 5,
    extension:    3,
    lantern:      7,
    velux:        3,
  },

  additionalServices: {
    gutterVacuum: {
      label:        'Gutter Vacuum',
      description:  'Full gutter vacuum clear-out',
      '2-bed':      { base: 70,  withExtra: 85  },
      '3-bed-semi': { base: 75,  withExtra: 90  },
      '4-bed-semi': { base: 80,  withExtra: 95  },
      '4-bed-det':  { base: 85,  withExtra: 100 },
      'townhouse':  { base: 90,  withExtra: 105 },
      'placeholder':{ base: 75,  withExtra: 90  },
    },
    gutterWash: {
      label:        'Gutter Wash, Fascia & Soffits',
      description:  'Full exterior gutter wash including fascia and soffits',
      '2-bed':      { base: 90,  withExtra: 110 },
      '3-bed-semi': { base: 100, withExtra: 120 },
      '4-bed-semi': { base: 110, withExtra: 130 },
      '4-bed-det':  { base: 120, withExtra: 140 },
      'townhouse':  { base: 130, withExtra: 150 },
      'placeholder':{ base: 100, withExtra: 120 },
    },
    conservatoryRoof: {
      label:        'Conservatory Roof Clean',
      description:  'Full conservatory roof clean',
      price:        140,
    },
  },
};

export const BEDROOM_OPTIONS = {
  'semi-detached': [
    { value: '2-3', label: '2 / 3 Bedrooms' },
    { value: '4',   label: '4 Bedrooms'     },
    { value: '5+',  label: '5+ Bedrooms'    },
  ],
  'detached': [
    { value: '2',  label: '2 Bedrooms'  },
    { value: '3',  label: '3 Bedrooms'  },
    { value: '4',  label: '4 Bedrooms'  },
    { value: '5+', label: '5+ Bedrooms' },
  ],
  'terraced': [
    { value: '1-2', label: '1 / 2 Bedrooms' },
    { value: '3',   label: '3 Bedrooms'     },
    { value: '4',   label: '4 Bedrooms'     },
    { value: '5+',  label: '5+ Bedrooms'    },
  ],
  'town-house': [
    { value: '2-3', label: '2 / 3 Bedrooms' },
    { value: '4',   label: '4 Bedrooms'     },
    { value: '5+',  label: '5+ Bedrooms'    },
  ],
  'bungalow': [
    { value: '1-2', label: '1 / 2 Bedrooms' },
    { value: '3',   label: '3 Bedrooms'     },
    { value: '4',   label: '4 Bedrooms'     },
    { value: '5+',  label: '5+ Bedrooms'    },
  ],
  'flat': [
    { value: '1-2', label: '1 / 2 Bedrooms' },
    { value: '3',   label: '3 Bedrooms'     },
    { value: '4',   label: '4 Bedrooms'     },
    { value: '5+',  label: '5+ Bedrooms'    },
  ],
};

export const getServiceTierKey = (propertyType, bedrooms) => {
  if (propertyType === 'semi-detached') return bedrooms === '4' || bedrooms === '5+' ? '4-bed-semi' : '3-bed-semi';
  if (propertyType === 'detached') {
    if (bedrooms === '2') return '2-bed';
    if (bedrooms === '3') return '4-bed-semi';
    if (bedrooms === '4' || bedrooms === '5+') return '4-bed-det';
  }
  if (propertyType === 'town-house') return 'townhouse';
  return 'placeholder';
};

export const calculateWindowTotal = (data) => {
  const { propertyType, bedrooms, hasConservatory, hasExtension, hasLantern, hasVelux, veluxCount } = data;
  if (!propertyType || !bedrooms) return 0;
  const base              = pricingConfig.windowCleaning[propertyType]?.[bedrooms] || 0;
  const conservatoryAddon = hasConservatory ? pricingConfig.windowAddons.conservatory : 0;
  const extensionAddon    = hasExtension    ? pricingConfig.windowAddons.extension    : 0;
  const lanternAddon      = hasLantern      ? pricingConfig.windowAddons.lantern      : 0;
  const veluxAddon        = hasVelux        ? (parseInt(veluxCount) || 1) * pricingConfig.windowAddons.velux : 0;
  return base + conservatoryAddon + extensionAddon + lanternAddon + veluxAddon;
};

export const getAdditionalServicePrice = (serviceKey, tierKey, hasExtra) => {
  const service = pricingConfig.additionalServices[serviceKey];
  if (!service) return 0;
  if (serviceKey === 'conservatoryRoof') return service.price;
  const tier = service[tierKey] || service['placeholder'];
  if (!tier) return 0;
  return hasExtra ? tier.withExtra : tier.base;
};
const sap = {
  testGroupSet: {
    'CH3': 1,
    'CH2': 2,
  },
  PNIPAGroupSet: {
    'CH2': 1,
    'CH': 1,
    'CONH': 1,
    'Isopropyl': 1.
  },
  data: {
    'CH3': { volume:13.67, e: -61.6012, de: -51.8462, deH:-12753.7, deS: -44.653},
    'CH2': { volume:10.23, e: -33.6959, de:28.3266, deH:-21894.1, deS:-91.0072 },
    'CH': { volume:6.8, e: -237.466, de:195.359, deH:7213.02, deS:-50.3343 },
    'C': { volume:3.3, e: -209.164, de:173.235, deH:-451933, deS:-1453.64 },
    'Isopropyl': { volume:34.1, e: -46.5288, de:39.8091, deH:2398.52, deS:-1.18258 },
    'Tertiary butyl': { volume:44.35, e: -33.8780, de:29.9307, deH:24861.3, deS:67.7202 },
    'O': { volume:5.5, e: 368.805, de:-302.051, deH:135412, deS:541.486 },
    'COO': { volume:15.2, e: 3.75940, de:-3.19114, deH:-28816.6, deS:-97.4972 },
    'CON': { volume:16, e: 207.239, de:-157.450, deH:40375.5, deS:191.535 },
    'CONH': { volume:13, e: 267.257, de:-219.413, deH:-56960.3, deS:-110.328 },
    'Caprolactam': { volume:67.15, e: 29.2934, de:-11.0805, deH:-33178.4, deS:-73.1455 },
    'Cyclopropyl': { volume:27.26, e: 255.8443, de:47.4383, deH:23696.6, deS:70.2153 },
    'OH': { volume:8, e: 326.768, de:-264.969, deH:318868, deS:1143.19 },
  },
  params: ['e', 'de', 'deH', 'deS'],
  getInteraction(groupSet, t) {
    let totalVolume = 0;
    Object.keys(groupSet).forEach((group) => {
      totalVolume += sap.data[group].volume;
      console.log(sap.data[group].volume);
    })
    Object.keys(sap.params).forEach((index) => {
      const param = sap.params[index];
      console.log(index, param);
      let total = 0;
      Object.keys(groupSet).forEach((group) => {
        console.log(group, groupSet[group], sap.data[group].volume, sap.data[group][param]);
        total += groupSet[group] * (sap.data[group].volume / totalVolume) * sap.data[group][param];
      });
      console.log(`total ${total}`);
    });
    const param = sap.data[key];
    const mathematical = 2.71828182845904523536;

    return param.e + (param.de / (1 + Math.pow(mathematical, param.deS - param.deH / t)));
  },
};

const interaction = sap.getInteraction(sap.PNIPAGroupSet, 100);
console.log(interaction);
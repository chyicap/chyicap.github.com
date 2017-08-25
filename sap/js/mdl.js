module.exports = {
  eT: 0,
  setET(value) {
    this.eT = value;
  },
  mdl(x) {
    return ((1/x)*(1/x) + 2*(1/x)*(1/x)*(1/x)) * -0.76646 + (1/x) + 0.3 * (1/x)*(1/x) + Math.log(1-(1/x)) + (3 * (Math.pow((1/x), 1/3) - (1/x)) * (1 + (1/x)) / 4 + (1/x)*(1/x) * Math.log((1/x)) / 2 + (1/x) * (-3 * (Math.pow((1/x), 1/3) - (1/x)) / 4 + 3 * ( 1 - Math.pow((1/x), -2/3) / 3 ) * ( 1 + (1/x)) / 4 -(1/x)/2 - (1/x) * Math.log((1/x)))) / 80;
  }
};

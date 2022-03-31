export default {
  moneyFilter(value) {
    return Number(value)
      .toFixed(2)
      .toString()
      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, '$1,')
  },
  weightFilter(value) {
    return Number(value)
      .toFixed(4)
      .toString()
      .replace(/(\d{1,3})(?=(\d{3})+(?:￥|\.))/g, '$1,')
  }
}

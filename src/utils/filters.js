export default {
  moneyFilter(value) {
    value = Number(value).toFixed(2)
    return Number(value)
  },
  weightFilter(value) {
    value = Number(value).toFixed(4)
    return Number(value)
  }
}

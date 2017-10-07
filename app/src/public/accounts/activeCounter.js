module.exports = function (d) {
  return d.reduce((acc, account) => {
    if (account.active) { acc++ }
    return acc
  }, 0)
}

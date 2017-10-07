module.exports = function (d) {
  return d.reduce((acc, student) => {
    if (student.active) { acc++ }
    return acc
  }, 0)
}

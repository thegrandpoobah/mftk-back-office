module.exports = function (number, opts) {
  let extraClass = 'progress-bar-default'
  if (number <= opts.hash.danger) {
    extraClass = 'progress-bar-danger'
  } else if (number <= opts.hash.warning) {
    extraClass = 'progress-bar-warning'
  } else if (number <= opts.hash.info) {
    extraClass = 'progress-bar-info'
  }
  return `<span class="badge ${extraClass}">${number}/${opts.hash.max}</span>`
}

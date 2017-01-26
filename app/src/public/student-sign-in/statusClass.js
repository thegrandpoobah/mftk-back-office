module.exports = function (status) {
	switch (status) {
    case 'Early':
      return 'success'
    case 'On Time':
      return 'warning'
    case 'Late':
      return 'danger'
    default:
      return 'default'
  }
}

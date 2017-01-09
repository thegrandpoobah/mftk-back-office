include_recipe 'nodejs::nodejs_from_package'
include_recipe 'monit'
include_recipe 'postgresql::client'

package 'zip'

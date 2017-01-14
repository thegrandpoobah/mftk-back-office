include_recipe 'nodejs'
include_recipe 'postgresql::client'
include_recipe 'postgresql::server'
include_recipe 'openssl'

package 'build-essential'
package 'git'
package 'zip'
package 'awscli'

nodejs_npm "webpack"
nodejs_npm "mocha"
nodejs_npm "feathers"
nodejs_npm "feathers-cli"

aws_secret = data_bag_item('passwords', 'aws')

magic_shell_environment 'AWS_ACCESS_KEY_ID' do
	value aws_secret['aws_access_key_id']
end

magic_shell_environment 'AWS_SECRET_ACCESS_KEY' do
	value aws_secret['aws_secret_access_key']
end

openssl_x509 '/home/vagrant/mftk-back-office/app/config/localhost.crt' do
  common_name 'localhost'
  org 'MFTK Martial Arts Academy'
  org_unit ''
  key_length 4096
  country 'CA'
end

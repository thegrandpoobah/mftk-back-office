include_recipe 'nodejs'
include_recipe 'monit'
include_recipe 'postgresql::client'
include_recipe 'openssl'

nodejs_npm "sequelize-cli"

package 'zip'
package 'htop'

openssl_x509 '/srv/www/shared/localhost.crt' do
  common_name 'localhost'
  org 'MFTK Martial Arts Academy'
  org_unit ''
  key_length 4096
  country 'CA'
end

remote_file '/usr/bin/certbot' do
  source 'https://dl.eff.org/certbot-auto'
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

cron 'update ssl certificate' do
  minute "27" # this should be random
  hour "11,23"
  weekday "*"

  command "/usr/bin/certbot renew --quiet --no-self-upgrade --post-hook \"ln --force --symbolic /etc/letsencrypt/live/#{node['cert_domain']}/fullchain.pem /srv/www/shared/localhost.crt; ln --force --symbolic /etc/letsencrypt/live/#{node['cert_domain']}/privkey.pem /srv/www/shared/localhost.key; monit restart mftk-back-office\""
end

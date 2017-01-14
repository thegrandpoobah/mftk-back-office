include_recipe 'aws'
include_recipe 'monit'

file '/usr/local/bin/mftk-back-office' do
	content <<-EOF
#!/bin/bash
cd /srv/www/current
npm start &
echo "$!" > /var/run/mftk-back-office.pid
EOF
	mode '0744'
	owner 'root'
	group 'root'
end

monit_monitrc "mftk-back-office" do
	variables({})
end

app = search("aws_opsworks_app").first

aws_s3_file '/tmp/mftk-back-office.zip' do
	bucket 'mftk-back-office-deploy'
	remote_path 'server.zip'
	aws_access_key app['app_source']['user']
	aws_secret_access_key app['app_source']['password']
end

directory '/srv/www/current' do 
	recursive true
	action :delete
end

directory '/srv/www/current' do
	recursive true
	action :create
	owner 'root'
	group 'root'
end

directory '/srv/www/shared' do
	recursive true
	action :create
	owner 'root'
	group 'root'
end

execute 'unzip package' do
	command 'unzip /tmp/mftk-back-office.zip -d /srv/www/current'
end

execute 'npm install' do
	command '(cd /srv/www/current && npm install --production)'
end

rds_db_instance = search("aws_opsworks_rds_db_instance").first

template '/srv/www/shared/app.env' do
	source "app.env.erb"
	mode 0770
	owner 'root'
	group 'root'
	variables(
		:environment => app['environment'],
		:postgres_uri => "postgres://#{rds_db_instance['db_user']}:#{rds_db_instance['db_password']}@#{rds_db_instance['address']}/mftk"
	)
end

execute 'restart mftk-back-office' do
	command 'monit restart mftk-back-office'
	returns [0, 1]
end

execute 'generate first certificate' do
	command "/usr/bin/certbot certonly --webroot -w /srv/www/current/public -d #{node['cert_domain']} --non-interactive --agree-tos --email #{node['cert_email']} --rsa-key-size 4096 --post-hook \"ln --force --symbolic /etc/letsencrypt/live/#{node['cert_domain']}/fullchain.pem /srv/www/shared/localhost.crt; ln --force --symbolic /etc/letsencrypt/live/#{node['cert_domain']}/privkey.pem /srv/www/shared/localhost.key; monit restart mftk-back-office\""
end

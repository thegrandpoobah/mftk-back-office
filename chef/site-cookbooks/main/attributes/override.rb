node.override['nodejs']['repo'] = 'https://deb.nodesource.com/node_5.x'
node.override['monit']['default_monitrc_configs'] = []
# node.override['poise-monit']['recipe']['httpd_port'] = 2812

node.override['postgresql']['password']['postgres'] = "iloverandompasswordsbutthiswilldo"
node.override['postgresql']['pg_hba'] = [
  {
    :type => 'host',
    :db => 'all',
    :user => 'all',
    :addr => '127.0.0.1/32',
    :method => 'md5'
  },
  {
    :type => 'host',
    :db => 'all',
    :user => 'all',
    :addr => '::1/128',
    :method => 'md5'
  } 
]
node.override['nodejs']['repo'] = 'https://deb.nodesource.com/node_5.x'
node.override['monit']['default_monitrc_configs'] = []
# node.override['poise-monit']['recipe']['httpd_port'] = 2812

node.override['postgresql']['password']['postgres'] = "iloverandompasswordsbutthiswilldo"
node.override['postgresql']['pg_hba'] = [
  {
    :type => 'local',
    :db => 'all',
    :user => 'vagrant',
    :addr => nil,
    :method => 'ident'
  }
]
#/bin/bash
(cd ./app/src/public && rm -rf ../../public && webpack)
(cd ./app && zip -FSr ../server.zip ./* .sequelizerc --exclude '/node_modules*' '/test*')
aws s3 cp --region us-east-1 ./server.zip s3://mftk-back-office-deploy

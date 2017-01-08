#/bin/bash
(cd ./app && rm -rf public && npm run-script webpack)
(cd ./app && zip -FSr ../server.zip ./* --exclude '/node_modules*' '/test*')
aws s3 cp --region us-east-1 ./server.zip s3://mftk-back-office-deploy

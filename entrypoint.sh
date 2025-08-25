#!/bin/bash
#

# Add config/creds copying here..
az storage blob download --container-name $CONTAINER_NAME --name env.config --file /app/.env --account-name $ACCOUNT_NAME --account-key $ACCOUNT_KEY

cd /app

# Add any other scripts here...
# Start the service
# npm run start
pm2-runtime src/index.js

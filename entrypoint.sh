#!/bin/bash
#

if [ "${SECRETS_STORE_ENABLED}" = "true" ]; then
	SECRETS_DIR="${SECRETS_STORE_PATH:-/mnt/secrets-store}"

	read_secret_file() {
		local key="$1"
		local file_path="${SECRETS_DIR}/${key}"

		if [ -f "${file_path}" ]; then
			tr -d '\r' < "${file_path}"
		fi
	}

	# DB creds and API keys — read from CSI-mounted files
	export DB_USER_NAME="$(read_secret_file DB_USER_NAME)"
	export DB_USER_PASSWORD="$(read_secret_file DB_USER_PASSWORD)"
	export OPENAI_API_KEY="$(read_secret_file OPENAI_API_KEY)"
	# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and STORAGE_BUCKET_* are
	# injected directly as env vars by the Deployment (from aws-iam-credentials K8s Secret).
fi

# Add config/creds copying here..
aws s3 cp s3://$S3_CONFIG_BUCKET/$S3_CONFIG_PATH/.env /app/.env

cd /app

# Add any other scripts here...
# Start the service
# npm run start
pm2-runtime src/index.js

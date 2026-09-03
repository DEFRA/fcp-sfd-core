# NOTE!
## Every endpoint except /health and /api/v1/callback requires a bearer token.
## Add the token to each authenticated request: -H "Authorization: Bearer ${TOKEN}"
## Token instructions are on Confluence: https://eaflood.atlassian.net/wiki/spaces/SFD/pages/6468732912/Generate+Cognito+Bearer+token+for+use+with+Object-Processor

## The initiate payload accepts only `redirect` and `metadata`. The bucket, path, callback URL,
## permitted MIME types and max file size are all server-side config and are rejected if sent
## by the client. Cross check against the OpenAPI spec:
## https://github.com/DEFRA/fcp-sfd-object-processor/blob/main/docs/openapi/v1.json

########################################

# DEV

## 1. Initiate via object-processor uploader endpoint
curl -X POST https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/uploader/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
  "redirect": "/health",
  "metadata": {
    "sbi": 138190174,
    "crn": 1890677690,
    "frn": 1102658375,
    "submissionId": "1733826312",
    "uosr": "138190174_1733826312",
    "type": "CS_Agreement_Evidence",
    "reference": "Hello SFD S&T Test",
    "service": "fcp-sfd-frontend"
  }
}' | jq

## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/upload-example-1.jpg'


## 3. Check scan status via the object-processor (uses the uploadId from step 1)
### Returns a mapped uploadStatus of pending | success | failure
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/uploader/status/{uploadId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

### Or go direct to cdp-uploader for the raw, unmapped status
curl --request GET \
  --url https://cdp-uploader.dev.cdp-int.defra.cloud/status/{uploadId} | jq


## 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

### Documents are stored with subdocuments: metadata, file, s3, messaging, raw
db.uploadMetadata.find({
 "file.fileId": "182c7b44-962e-4437-8321-ffd4ec7649f9"
})

### By S3 key (stored at s3.key, not form.file.s3Key)
db.uploadMetadata.find({
 "s3.key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

### All files uploaded in the same callback share a correlationId
db.uploadMetadata.find({ "messaging.correlationId": "{correlationId}" })

### Outbox entries. Valid statuses: PENDING, PROCESSING, SENT, PERMANENT_FAILURE
db.outbox.find({ status: { $ne: "SENT" } })


## 5. GET metadata by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 \
  -H "Authorization: Bearer ${TOKEN}" | jq


## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/blob/{fileId} \
  -H "Authorization: Bearer ${TOKEN}" | jq


## 7. GET persisted callback validation status by correlationId
### Records why a callback was rejected, when Joi or contract validation failed
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/status/{correlationId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

########################################

# TEST

## 1. Initiate via object-processor uploader endpoint
curl -X POST https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/uploader/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
  "redirect": "/health",
  "metadata": {
    "sbi": 138190174,
    "crn": 1890677690,
    "frn": 1102658375,
    "submissionId": "1733826312",
    "uosr": "138190174_1733826312",
    "type": "CS_Agreement_Evidence",
    "reference": "Hello SFD S&T Test",
    "service": "fcp-sfd-frontend"
  }
}' | jq


## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/hello-sfd.docx'


## 3. Check scan status via the object-processor (uses the uploadId from step 1)
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/uploader/status/{uploadId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

### Or go direct to cdp-uploader for the raw, unmapped status
curl --request GET \
  --url https://cdp-uploader.test.cdp-int.defra.cloud/status/{uploadId} | jq


#### 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "s3.key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

## 5. GET metadata by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 \
  -H "Authorization: Bearer ${TOKEN}" | jq


## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/blob/{fileId} \
  -H "Authorization: Bearer ${TOKEN}" | jq


## 7. GET persisted callback validation status by correlationId
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/status/{correlationId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

########################################

# PERF-TEST

## 1. Initiate via object-processor uploader endpoint
curl -X POST https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/uploader/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
  "redirect": "/health",
  "metadata": {
    "sbi": 138190174,
    "crn": 1890677690,
    "frn": 1102658375,
    "submissionId": "1733826312",
    "uosr": "138190174_1733826312",
    "type": "CS_Agreement_Evidence",
    "reference": "Hello SFD S&T Test",
    "service": "fcp-sfd-frontend"
  }
}' | jq

## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/hello-sfd.docx'


## 3. Check scan status via the object-processor (uses the uploadId from step 1)
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/uploader/status/{uploadId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

### Or go direct to cdp-uploader for the raw, unmapped status
curl --request GET \
  --url https://cdp-uploader.perf-test.cdp-int.defra.cloud/status/{uploadId} | jq


## 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "s3.key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

## 5. GET by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 \
  -H "Authorization: Bearer ${TOKEN}" | jq

## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/blob/{fileId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

## 7. GET persisted callback validation status by correlationId
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/status/{correlationId} \
  -H "Authorization: Bearer ${TOKEN}" | jq

########################################

# GET from SQS Queue

aws sqs receive-message \
  --queue-url https://sqs.eu-west-2.amazonaws.com/332499610595/fcp_sfd_crm_requests \
  --max-number-of-messages 10 \
  --wait-time-seconds 20

awslocal sqs receive-message \
  --queue-url http://sqs.eu-west-2.127.0.0.1:4566/000000000000/fcp_sfd_crm_requests \
  --max-number-of-messages 10 \
  --wait-time-seconds 20 | jq

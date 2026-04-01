# NOTE!
## If AUTH_COGNITO_ENABLED is true, ensure a bearer token is generated so requests made for retrieving metadata or blobs are authenticated.
## Instructions are available on Confluence: https://eaflood.atlassian.net/wiki/spaces/SFD/pages/6468732912/Generate+Cognito+Bearer+token+for+use+with+Object-Processor

########################################

# DEV

## 1. Initiate via object-processor uploader endpoint (ensure to cross check the below payload with the OpenAPI spec available on fcp-sfd-object-processor: https://github.com/DEFRA/fcp-sfd-object-processor/blob/main/docs/openapi/v1.json)
curl -X POST https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/uploader/initiate -d '{
  "redirect": "/health",
  "callback": "https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/callback",
  "s3Bucket": "dev-fcp-sfd-object-processor-bucket-c63f2",
  "s3Path": "scanned",
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
}' -H "Content-Type: application/json" | jq

## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/upload-example-1.jpg'


## 3. Check status of file via cdp-uploader (again use the uploadId given in step 1)
curl --request GET \
  --url https://cdp-uploader.dev.cdp-int.defra.cloud/status/{uploadId} | jq


## 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "file.fileId": { $regex: "182c7b44-962e-4437-8321-ffd4ec7649f9" }
})

## 5. GET metadata by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 | jq


## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/blob/{fileId} | jq

########################################

# TEST

## 1. Initiate via object-processor uploader endpoint (ensure to cross check the below payload with the OpenAPI spec available on fcp-sfd-object-processor: https://github.com/DEFRA/fcp-sfd-object-processor/blob/main/docs/openapi/v1.json)
curl -X POST https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/uploader/initiate -d '{
  "redirect": "/health",
  "callback": "https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/callback",
  "s3Bucket": "test-fcp-sfd-object-processor-bucket-6bf3a",
  "s3Path": "scanned",
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
}' -H "Content-Type: application/json" | jq


## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/hello-sfd.docx'


## 3. Check status of file via cdp-uploader (again use the uploadId given in step 1)
curl --request GET \
  --url https://cdp-uploader.test.cdp-int.defra.cloud/status/{uploadId} | jq


#### 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "form.file.s3Key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

## 5. GET metadata by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 | jq

  
## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/blob/{fileId} | jq

########################################

# PERF-TEST

## 1. Initiate via object-processor uploader endpoint (ensure to cross check the below payload with the OpenAPI spec available on fcp-sfd-object-processor: https://github.com/DEFRA/fcp-sfd-object-processor/blob/main/docs/openapi/v1.json)
curl -X POST https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/uploader/initiate -d '{
  "redirect": "/health",
  "callback": "https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/callback",
  "s3Bucket": "perf-test-fcp-sfd-object-processor-bucket-05244",
  "s3Path": "scanned",
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
}' -H "Content-Type: application/json" | jq

## 2. Upload file direct to cdp-uploader using uploadUrl from step 1 response, triggers callback
### Note: files must be uploaded to the terminal first! (ensure file name matches the associated reference in the POST request e.g. upload-example-1.jpg)
curl --request POST \
  --url {uploadUrl} \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/hello-sfd.docx'


## 3. Check status of file via cdp-uploader (again use the uploadId given in step 1)
curl --request GET \
  --url https://cdp-uploader.perf-test.cdp-int.defra.cloud/status/{uploadId} | jq


## 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "form.file.s3Key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

## 5. GET by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/metadata/sbi/138190174 | jq

## 6. GET blob reference by fileId
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/blob/{fileId} | jq

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

#### DEV

#### 1. Initiate
## metadata has been updated 
curl -X POST https://cdp-uploader.dev.cdp-int.defra.cloud/initiate \
  -d '{
    "redirect": "/health",
    "callback": "https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/callback",
    "s3Bucket": "dev-fcp-sfd-object-processor-bucket-c63f2",
    "s3Path": "scanned",
    "metadata": {
      "sbi": 138190174,
      "crn": 1890677690,
      "frn": "1102658375",
      "submissionId": "1733826312",
      "uosr": "107220150_1733826312",
      "submissionDateTime": "10/12/2024 10:25:12",
      "files": ["107220150_1733826312_SBI107220150.pdf"],
      "filesInSubmission": 2,
      "type": "CS_Agreement_Evidence",
      "reference": "Hello SFD S&T Test",
      "service": "SFD"
    }
  }' \
  -H "Content-Type: application/json" | jq




#### 2. upload file direct to cdp-upload, triggers callback (change the id)
#### files must be uploaded to the terminal first
curl --request POST \
  --url https://cdp-uploader.dev.cdp-int.defra.cloud/upload-and-scan/9e498dbc-665e-4f8b-b86f-72d070e7ae92 \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/upload-example-1.jpg'


#### 3. check status of file via cdp-uploader (change the id)
curl --request GET \
  --url https://cdp-uploader.dev.cdp-int.defra.cloud/status/aa7000e1-17a7-41b1-ab12-54f25dcbfd41 | jq


#### 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "file.fileId": { $regex: "182c7b44-962e-4437-8321-ffd4ec7649f9" }
})

#### 4a. GET metadata
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/metadata/sbi/105000000 | jq


#### 5. GET blob reference by file id
curl --request GET \
  --url https://fcp-sfd-object-processor.dev.cdp-int.defra.cloud/api/v1/blob/182c7b44-962e-4437-8321-ffd4ec7649f9 | jq

########################################
## TEST ENV

#### 1. init request to cdp uploader
curl -X POST https://cdp-uploader.test.cdp-int.defra.cloud/initiate \
  -d '{"redirect": "/health",
  "callback": "https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/callback",
  "s3Bucket": "test-fcp-sfd-object-processor-bucket-6bf3a",
  "s3Path": "scanned",
  "metadata": {  
      "sbi": "105000000",
      "crn": "1050000000",
      "frn": "1102658375",
      "submissionId": "1733826312",
      "uosr": "107220150_1733826312",
      "submissionDateTime": "10/12/2024 10:25:12",
      "files": ["107220150_1733826312_SBI107220150.pdf"],
      "filesInSubmission": 2,
      "type": "CS_Agreement_Evidence",
      "reference": "user entered reference",
      "service": "SFD"
    }
  }' \
  -H "Content-Type: application/json"  | jq


#### 2. upload file direct to cdp-upload, triggers callback (change the id)
#### files must be uploaded to the terminal first
curl --request POST \
  --url https://cdp-uploader.test.cdp-int.defra.cloud/upload-and-scan/edcbd2d0-06f5-4f67-ba5f-5c1f43ee6246 \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/hello-sfd.docx'


#### 3. check status of file via cdp-uploader (change the id)
curl --request GET \
  --url https://cdp-uploader.test.cdp-int.defra.cloud/status/a247f531-24ad-47b4-9086-1503feda2942 | jq


#### 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "form.file.s3Key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

#### 5. GET by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/metadata/sbi/105000000 | jq

  
#### 6. GET blob reference by file id
curl --request GET \
  --url https://fcp-sfd-object-processor.test.cdp-int.defra.cloud/api/v1/blob/3a63ac78-f46a-49f3-9752-124c65139e52 | jq



## PERF TEST ENV

#### 1. init request to cdp uploader
curl -X POST https://cdp-uploader.perf-test.cdp-int.defra.cloud/initiate \
  -d '{"redirect": "/health",
  "callback": "https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/callback",
  "s3Bucket": "perf-test-fcp-sfd-object-processor-bucket-05244",
  "s3Path": "scanned",
  "metadata": {  
      "sbi": "105000000",
      "crn": "1050000000",
      "frn": "1102658375",
      "submissionId": "1733826312",
      "uosr": "107220150_1733826312",
      "submissionDateTime": "10/12/2024 10:25:12",
      "files": ["107220150_1733826312_SBI107220150.pdf"],
      "filesInSubmission": 2,
      "type": "CS_Agreement_Evidence",
      "reference": "user entered reference",
      "service": "SFD"
    }
  }' \
  -H "Content-Type: application/json"  | jq


#### 2. upload file direct to cdp-upload, triggers callback (change the id)
#### files must be uploaded to the terminal first
curl --request POST \
  --url https://cdp-uploader.perf-test.cdp-int.defra.cloud/upload-and-scan/f7de8763-e50e-436b-816a-b935bcbc461a \
  --header 'Content-Type: multipart/form-data' \
  --form 'file=@/home/cdpshell/software-meme.png'


#### 3. check status of file via cdp-uploader (change the id)
curl --request GET \
  --url https://cdp-uploader.perf-test.cdp-int.defra.cloud/status/f7de8763-e50e-436b-816a-b935bcbc461a | jq


#### 4. check the mongo database
# db.getCollectionNames()
# db.<collection-name>.find({params: go-here})

db.uploadMetadata.find({
 "form.file.s3Key": { $regex: "5fd2ad6d-df32-42ea-899a-700db6b1fe35" }
})

#### 5. GET by sbi
curl --request GET \
  --url https://fcp-sfd-object-processor.perf-test.cdp-int.defra.cloud/api/v1/metadata/sbi/105000000 | jq




######### GET from SQS Queue
aws sqs receive-message \
  --queue-url https://sqs.eu-west-2.amazonaws.com/332499610595/fcp_sfd_crm_requests \
  --max-number-of-messages 10 \
  --wait-time-seconds 20

awslocal sqs receive-message \
  --queue-url http://sqs.eu-west-2.127.0.0.1:4566/000000000000/fcp_sfd_crm_requests \
  --max-number-of-messages 10 \
  --wait-time-seconds 20 | jq

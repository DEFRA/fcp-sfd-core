// MongoDB Compass Script - Insert Test Data
// Run this in the MongoDB shell

// PREREQUISITES:
// within mongosh change to the fcp-sfd-object-processor database 
// use this command `use fcp-sfd-object-processor`


const numberOfRecords = 110

const generateUuids = (numberOfRecords) => {
  return Array.from({ length: numberOfRecords }, () => {
    const oid = new ObjectId().toString();
    // Format as UUID with proper v4 version and variant bits
    return `${oid.substring(0, 8)}-${oid.substring(8, 12)}-4${oid.substring(13, 16)}-8${oid.substring(17, 20)}-${oid.substring(20, 24)}00000000`
  })
}

// Generate UUIDs upfront to use in both metadata and outbox records
const fileIds = generateUuids(numberOfRecords)

// Generate correlationIds upfront to use in both metadata and outbox records
const correlationIds = generateUuids(numberOfRecords)

// create the payload that can be used across both metadata and outbox
const createPayload = (i) => {
  return {
    metadata: {
      sbi: `105${String(i).padStart(6, '0')}`,
      crn: `105${String(i).padStart(7, '0')}`,
      frn: `110265${8375 + i}`,
      submissionId: `173382${6312 + i}`,
      uosr: `107220${150 + i}_173382${6312 + i}`,
      submissionDateTime: '10/12/2024 10:25:12',
      files: [`107220${150 + i}_173382${6312 + i}_SBI107220${150 + i}.pdf`],
      filesInSubmission: 1,
      type: 'CS_Agreement_Evidence',
      reference: `Test reference ${i + 1}`,
      service: 'SFD'
    },
    file: {
      fileId: fileIds[i],
      filename: `test-document-${i + 1}.pdf`,
      contentType: 'application/pdf',
      fileStatus: 'complete',
      url: `https://fcp-placeholder.cdp-int.defra.cloud/api/v1/blobs/${fileIds[i]}`
    },
    s3: {
      key: `uploads/test-document-${i + 1}.pdf`,
      bucket: 'test-bucket'
    },
    messaging: {
      publishedAt: null,
      correlationId: correlationIds[i]
    },
    raw: {
      uploadStatus: 'complete',
      numberOfRejectedFiles: 0
    }
  }
}

// First, insert metadata records
const metadataRecords = Array.from({ length: numberOfRecords }, (_, i) => {
  return {
    ...createPayload(i)
  }
})

// Insert metadata records
const metadataResult = db.uploadMetadata.insertMany(metadataRecords)
print(`Inserted ${Object.keys(metadataResult.insertedIds).length} metadata records`)

// Get the inserted IDs
const insertedIds = Object.values(metadataResult.insertedIds)

// Create outbox entries linked to metadata via messageId
const outboxRecords = insertedIds.map((metadataId, i) => {
  return {
    messageId: metadataId, // Links to the metadata _id
    payload: createPayload(i),
    status: 'FAILED', // PENDING and FAILED will be processed. SENT will not.
    attempts: 1,
    createdAt: new Date()
  }
})

// Insert outbox records
const outboxResult = db.outbox.insertMany(outboxRecords)
print(`Inserted ${Object.keys(outboxResult.insertedIds).length} outbox records`)

// Print summary
print('---')
print(`Total metadata records: ${Object.keys(metadataResult.insertedIds).length}`)
print(`Total outbox records: ${Object.keys(outboxResult.insertedIds).length}`)
print('Sample metadata ID:', insertedIds[0].toString())
print('Sample outbox entry messageId:', outboxRecords[0].messageId.toString())

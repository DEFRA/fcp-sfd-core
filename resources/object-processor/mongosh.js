// MongoDB Compass Script - Insert Test Data
// Run this in the MongoDB shell

// PREREQUISITES:
// within mongosh change to the fcp-sfd-object-processor database 
// use this command `use fcp-sfd-object-processor`

const Crypto = require('crypto');

const numberOfRecords = 110

// Generate UUIDs upfront to use in both metadata and outbox records
const fileIds = Array.from({ length: numberOfRecords }, () => Crypto.randomUUID())

// Generate correlationIds upfront to use in both metadata and outbox records
const correlationId = Array.from({ length: numberOfRecords }, () => Crypto.randomUUID())

// create teh payload that can be used across both metadata and outbox
const createPayload = (i) => {
  return {
    metadata: {
      sbi: `10500000${i}`,
      crn: `105000000${i}`,
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
      correlationId: correlationId[i]
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
    status: 'PENDING',
    attempts: 0,
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

// MongoDB Compass Script - Insert Test Data
// Run this in the MongoDB shell

// PREREQUISITES:
// within mongosh change to the fcp-sfd-object-processor database
// use this command `use fcp-sfd-object-processor`

// The document shape below mirrors formatInboundMetadata in
// fcp-sfd-object-processor/src/repos/metadata.js. Note that sbi, crn and frn are
// stored as numbers: GET /api/v1/metadata/sbi/{sbi} parses the URL param to an
// integer before querying, so string values would never be returned.

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
  const filename = `test-document-${i + 1}.pdf`
  const s3Key = `uploads/${filename}`
  const s3Bucket = 'test-bucket'

  return {
    // The metadata subdocument is the callback's metadata object verbatim.
    // Any field outside this set is rejected by the callback schema.
    metadata: {
      sbi: 105000000 + i,
      crn: 1050000000 + i,
      frn: 1102658375 + i,
      submissionId: `${1733826312 + i}`,
      uosr: `${105000000 + i}_${1733826312 + i}`,
      type: 'CS_Agreement_Evidence',
      reference: `Test reference ${i + 1}`,
      service: 'fcp-sfd-frontend'
    },
    file: {
      fileId: fileIds[i],
      filename,
      contentType: 'application/pdf',
      fileStatus: 'complete'
    },
    s3: {
      key: s3Key,
      bucket: s3Bucket
    },
    messaging: {
      publishedAt: null,
      correlationId: correlationIds[i],
      // Number of files accepted in the callback that produced this record.
      // All records sharing a correlationId carry the same value.
      filesInBatch: 1
    },
    // raw is the untouched callback envelope plus the form upload it came from
    raw: {
      uploadStatus: 'ready',
      numberOfRejectedFiles: 0,
      fileId: fileIds[i],
      filename,
      contentType: 'application/pdf',
      detectedContentType: 'application/pdf',
      fileStatus: 'complete',
      contentLength: 102400,
      checksumSha256: 'bng5jOVC6TxEgwTUlX4DikFtDEYEc8vQTsOP0ZAv21c=',
      s3Key,
      s3Bucket
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
    // Valid statuses are PENDING, PROCESSING, SENT and PERMANENT_FAILURE.
    // The poller claims PENDING entries, and PROCESSING entries whose claim
    // has expired. SENT and PERMANENT_FAILURE are never reprocessed, and any
    // entry whose attempts have reached messaging.outboxMaxAttempts is skipped.
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

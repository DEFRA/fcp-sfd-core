// This file is used to seed MongoDB with file metadata events for testing purposes
// It can be used locally or uploaded to the CDP terminal

db.fileMetadataEvents.updateOne(
  { _id: 'a058de5b-42ad-473c-91e7-0797a43fda30' },
  { $push: { events: {
      id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-17T14:48:00.000Z'),
      data: {
        sbi: '105000000',
        blobReference: 'example-blob-reference-1',
        correlationId: 'a058de5b-42ad-473c-91e7-0797a43fda30'
      }
    }}},
  { upsert: true }
)

db.fileMetadataEvents.updateOne(
  { _id: 'b058de5b-42ad-473c-91e7-0797a43fda31' },
  { $push: { events: {
      id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-18T15:30:00.000Z'),
      data: {
        sbi: '205000000',
        blobReference: 'example-blob-reference-2',
        correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31'
      }
    }}},
  { upsert: true }
)

db.fileMetadataEvents.updateOne(
  { _id: 'c058de5b-42ad-473c-91e7-0797a43fda32' },
  { $push: { events: {
      id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-19T16:15:00.000Z'),
      data: {
        sbi: '305000000',
        blobReference: 'example-blob-reference-3',
        correlationId: 'c058de5b-42ad-473c-91e7-0797a43fda32'
      }
    }}},
  { upsert: true }
)

db.fileMetadataEvents.updateOne(
  { _id: 'a058de5b-42ad-473c-91e7-0797a43fda30' },
  { $push: { events: {
      id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-17T14:49:00.000Z'),
      data: {
        sbi: '105000000',
        blobReference: 'example-blob-reference-1-nested',
        correlationId: 'a058de5b-42ad-473c-91e7-0797a43fda30'
      }
    }}},
  { upsert: true }
)

db.fileMetadataEvents.updateOne(
  { _id: 'b058de5b-42ad-473c-91e7-0797a43fda31' },
  { $push: { events: {
      id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-18T15:31:00.000Z'),
      data: {
        sbi: '205000000',
        blobReference: 'example-blob-reference-2-nested',
        correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31'
      }
    }}},
  { upsert: true }
)
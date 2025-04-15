// This file is used to seed MongoDB with notification events for testing purposes
// It can be used locally or uploaded to the CDP terminal

db.notificationEvents.updateOne(
  { _id: 'a058de5b-42ad-473c-91e7-0797a43fda30' },
  { $push: { events: {
      id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-17T14:48:00.000Z'),
      data: {
        correlationId: 'a058de5b-42ad-473c-91e7-0797a43fda30',
        crn: '1050000000',
        sbi: '105000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'd8017132-1909-4bee-b604-b07e8081dc82',
        commsType: 'email',
        commsAddresses: [
          'jane.doe@defra.gov.uk',
          'john.doe@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference',
          applicationReference: 'test-application-reference',
          amount: '100'
        },
        reference: 'ffc-ahwr-example-reference',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '8e222534-7f05-4972-86e3-17c5d9f894e2'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'b058de5b-42ad-473c-91e7-0797a43fda31' },
  { $push: { events: {
      id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-18T15:30:00.000Z'),
      data: {
        correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31',
        crn: '2050000000',
        sbi: '205000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'e8017132-1909-4bee-b604-b07e8081dc83',
        commsType: 'email',
        commsAddresses: [
          'alice.smith@defra.gov.uk',
          'bob.jones@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-2',
          applicationReference: 'test-application-reference-2',
          amount: '200'
        },
        reference: 'ffc-ahwr-example-reference-2',
        statusDetails: { status: 'pending' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '9e222534-7f05-4972-86e3-17c5d9f894e3'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'b058de5b-42ad-473c-91e7-0797a43fda31' },
  { $push: { events: {
      id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-18T15:31:00.000Z'),
      data: {
        correlationId: 'b058de5b-42ad-473c-91e7-0797a43fda31',
        crn: '2050000000',
        sbi: '205000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'e8017132-1909-4bee-b604-b07e8081dc83',
        commsType: 'email',
        commsAddresses: [
          'alice.smith@defra.gov.uk',
          'bob.jones@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-2-nested',
          applicationReference: 'test-application-reference-2-nested',
          amount: '250'
        },
        reference: 'ffc-ahwr-example-reference-2-nested',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '9e222534-7f05-4972-86e3-17c5d9f894e3'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'c058de5b-42ad-473c-91e7-0797a43fda32' },
  { $push: { events: {
      id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-19T16:15:00.000Z'),
      data: {
        correlationId: 'c058de5b-42ad-473c-91e7-0797a43fda32',
        crn: '3050000000',
        sbi: '305000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'f8017132-1909-4bee-b604-b07e8081dc84',
        commsType: 'email',
        commsAddresses: [
          'carol.white@defra.gov.uk',
          'dave.brown@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-3',
          applicationReference: 'test-application-reference-3',
          amount: '300'
        },
        reference: 'ffc-ahwr-example-reference-3',
        statusDetails: { status: 'failed' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '0e222534-7f05-4972-86e3-17c5d9f894e4'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'c058de5b-42ad-473c-91e7-0797a43fda32' },
  { $push: { events: {
      id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-19T16:16:00.000Z'),
      data: {
        correlationId: 'c058de5b-42ad-473c-91e7-0797a43fda32',
        crn: '3050000000',
        sbi: '305000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'f8017132-1909-4bee-b604-b07e8081dc84',
        commsType: 'email',
        commsAddresses: [
          'carol.white@defra.gov.uk',
          'dave.brown@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-3-nested-1',
          applicationReference: 'test-application-reference-3-nested-1',
          amount: '350'
        },
        reference: 'ffc-ahwr-example-reference-3-nested-1',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '0e222534-7f05-4972-86e3-17c5d9f894e4'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'c058de5b-42ad-473c-91e7-0797a43fda32' },
  { $push: { events: {
      id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-19T16:17:00.000Z'),
      data: {
        correlationId: 'c058de5b-42ad-473c-91e7-0797a43fda32',
        crn: '3050000000',
        sbi: '305000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'f8017132-1909-4bee-b604-b07e8081dc84',
        commsType: 'email',
        commsAddresses: [
          'carol.white@defra.gov.uk',
          'dave.brown@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-3-nested-2',
          applicationReference: 'test-application-reference-3-nested-2',
          amount: '400'
        },
        reference: 'ffc-ahwr-example-reference-3-nested-2',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '0e222534-7f05-4972-86e3-17c5d9f894e4'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'd058de5b-42ad-473c-91e7-0797a43fda33' },
  { $push: { events: {
      id: 'd058de5b-42ad-473c-91e7-0797a43fda33',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-20T17:00:00.000Z'),
      data: {
        correlationId: 'd058de5b-42ad-473c-91e7-0797a43fda33',
        crn: '4050000000',
        sbi: '405000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'g8017132-1909-4bee-b604-b07e8081dc85',
        commsType: 'email',
        commsAddresses: [
          'eve.green@defra.gov.uk',
          'frank.black@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-4',
          applicationReference: 'test-application-reference-4',
          amount: '400'
        },
        reference: 'ffc-ahwr-example-reference-4',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '1e222534-7f05-4972-86e3-17c5d9f894e5'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'd058de5b-42ad-473c-91e7-0797a43fda33' },
  { $push: { events: {
      id: 'd058de5b-42ad-473c-91e7-0797a43fda33',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-20T17:01:00.000Z'),
      data: {
        correlationId: 'd058de5b-42ad-473c-91e7-0797a43fda33',
        crn: '4050000000',
        sbi: '405000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'g8017132-1909-4bee-b604-b07e8081dc85',
        commsType: 'email',
        commsAddresses: [
          'eve.green@defra.gov.uk',
          'frank.black@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-4-nested-1',
          applicationReference: 'test-application-reference-4-nested-1',
          amount: '450'
        },
        reference: 'ffc-ahwr-example-reference-4-nested-1',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '1e222534-7f05-4972-86e3-17c5d9f894e5'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'd058de5b-42ad-473c-91e7-0797a43fda33' },
  { $push: { events: {
      id: 'd058de5b-42ad-473c-91e7-0797a43fda33',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-20T17:02:00.000Z'),
      data: {
        correlationId: 'd058de5b-42ad-473c-91e7-0797a43fda33',
        crn: '4050000000',
        sbi: '405000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'g8017132-1909-4bee-b604-b07e8081dc85',
        commsType: 'email',
        commsAddresses: [
          'eve.green@defra.gov.uk',
          'frank.black@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-4-nested-2',
          applicationReference: 'test-application-reference-4-nested-2',
          amount: '500'
        },
        reference: 'ffc-ahwr-example-reference-4-nested-2',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '1e222534-7f05-4972-86e3-17c5d9f894e5'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'd058de5b-42ad-473c-91e7-0797a43fda33' },
  { $push: { events: {
      id: 'd058de5b-42ad-473c-91e7-0797a43fda33',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-20T17:03:00.000Z'),
      data: {
        correlationId: 'd058de5b-42ad-473c-91e7-0797a43fda33',
        crn: '4050000000',
        sbi: '405000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'g8017132-1909-4bee-b604-b07e8081dc85',
        commsType: 'email',
        commsAddresses: [
          'eve.green@defra.gov.uk',
          'frank.black@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-4-nested-3',
          applicationReference: 'test-application-reference-4-nested-3',
          amount: '550'
        },
        reference: 'ffc-ahwr-example-reference-4-nested-3',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '1e222534-7f05-4972-86e3-17c5d9f894e5'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'e058de5b-42ad-473c-91e7-0797a43fda34' },
  { $push: { events: {
      id: 'e058de5b-42ad-473c-91e7-0797a43fda34',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-21T18:45:00.000Z'),
      data: {
        correlationId: 'e058de5b-42ad-473c-91e7-0797a43fda34',
        crn: '5050000000',
        sbi: '505000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'h8017132-1909-4bee-b604-b07e8081dc86',
        commsType: 'email',
        commsAddresses: [
          'grace.blue@defra.gov.uk',
          'henry.red@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-5',
          applicationReference: 'test-application-reference-5',
          amount: '500'
        },
        reference: 'ffc-ahwr-example-reference-5',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '2e222534-7f05-4972-86e3-17c5d9f894e6'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'e058de5b-42ad-473c-91e7-0797a43fda34' },
  { $push: { events: {
      id: 'e058de5b-42ad-473c-91e7-0797a43fda34',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-21T18:46:00.000Z'),
      data: {
        correlationId: 'e058de5b-42ad-473c-91e7-0797a43fda34',
        crn: '5050000000',
        sbi: '505000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'h8017132-1909-4bee-b604-b07e8081dc86',
        commsType: 'email',
        commsAddresses: [
          'grace.blue@defra.gov.uk',
          'henry.red@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-5-nested-1',
          applicationReference: 'test-application-reference-5-nested-1',
          amount: '550'
        },
        reference: 'ffc-ahwr-example-reference-5-nested-1',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '2e222534-7f05-4972-86e3-17c5d9f894e6'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'e058de5b-42ad-473c-91e7-0797a43fda34' },
  { $push: { events: {
      id: 'e058de5b-42ad-473c-91e7-0797a43fda34',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-21T18:47:00.000Z'),
      data: {
        correlationId: 'e058de5b-42ad-473c-91e7-0797a43fda34',
        crn: '5050000000',
        sbi: '505000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'h8017132-1909-4bee-b604-b07e8081dc86',
        commsType: 'email',
        commsAddresses: [
          'grace.blue@defra.gov.uk',
          'henry.red@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-5-nested-2',
          applicationReference: 'test-application-reference-5-nested-2',
          amount: '600'
        },
        reference: 'ffc-ahwr-example-reference-5-nested-2',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '2e222534-7f05-4972-86e3-17c5d9f894e6'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'e058de5b-42ad-473c-91e7-0797a43fda34' },
  { $push: { events: {
      id: 'e058de5b-42ad-473c-91e7-0797a43fda34',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-21T18:48:00.000Z'),
      data: {
        correlationId: 'e058de5b-42ad-473c-91e7-0797a43fda34',
        crn: '5050000000',
        sbi: '505000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'h8017132-1909-4bee-b604-b07e8081dc86',
        commsType: 'email',
        commsAddresses: [
          'grace.blue@defra.gov.uk',
          'henry.red@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-5-nested-3',
          applicationReference: 'test-application-reference-5-nested-3',
          amount: '650'
        },
        reference: 'ffc-ahwr-example-reference-5-nested-3',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '2e222534-7f05-4972-86e3-17c5d9f894e6'
      }
    }}},
  { upsert: true }
)

db.notificationEvents.updateOne(
  { _id: 'e058de5b-42ad-473c-91e7-0797a43fda34' },
  { $push: { events: {
      id: 'e058de5b-42ad-473c-91e7-0797a43fda34',
      source: 'ffc-ahwr-claim',
      specversion: '1.0',
      type: 'uk.gov.fcp.sfd.notification.request',
      datacontenttype: 'application/json',
      time: ISODate('2023-10-21T18:49:00.000Z'),
      data: {
        correlationId: 'e058de5b-42ad-473c-91e7-0797a43fda34',
        crn: '5050000000',
        sbi: '505000000',
        sourceSystem: 'AHWP',
        notifyTemplateId: 'h8017132-1909-4bee-b604-b07e8081dc86',
        commsType: 'email',
        commsAddresses: [
          'grace.blue@defra.gov.uk',
          'henry.red@defra.gov.uk'
        ],
        personalisation: {
          reference: 'test-reference-5-nested-4',
          applicationReference: 'test-application-reference-5-nested-4',
          amount: '700'
        },
        reference: 'ffc-ahwr-example-reference-5-nested-4',
        statusDetails: { status: 'delivered' },
        oneClickUnsubscribeUrl: 'https://unsubscribe.example.com',
        emailReplyToId: '2e222534-7f05-4972-86e3-17c5d9f894e6'
      }
    }}},
  { upsert: true }
)
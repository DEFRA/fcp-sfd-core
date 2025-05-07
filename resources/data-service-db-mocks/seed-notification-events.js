// This file is used to seed MongoDB with notification events for testing purposes
// It can be used locally or uploaded to the CDP terminal

db.notificationEvents.deleteMany({})

db.notificationEvents.insertMany([
  {
    _id: 'a058de5b-42ad-473c-91e7-0797a43fda30',
    events: [{
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
        recipient: [
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
    }]
  },
  {
    _id: 'b058de5b-42ad-473c-91e7-0797a43fda31',
    events: [
      {
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
          recipient: [
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
      },
      {
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
          recipient: [
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
      }
    ]
  },
  {
    _id: 'c058de5b-42ad-473c-91e7-0797a43fda32',
    events: [
      {
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
          recipient: [
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
      },
      {
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
          recipient: [
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
      },
      {
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
          recipient: [
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
      }
    ]
  }
])
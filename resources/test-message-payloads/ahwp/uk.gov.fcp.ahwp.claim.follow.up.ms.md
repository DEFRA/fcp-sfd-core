Update `commsAddresses` to your own email address.

```
{
    "id": "7A807F97-2DEE-481E-93B4-5762F9FD32BE",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "3f632459-b852-48a7-88db-5a3137efd7b2",
        "commsType": "email",
        "commsAddresses": [
            "jane.doe@defra.gov.uk",
            "john.doe@defra.gov.uk"
        ],
        "personalisation": {
            "species": "chicken",
            "reference": "test-reference",
            "applicationReference": "test-application-reference",
            "amount": "100"
        },
        "reference": "ffc-ahwr-example-reference",
        "oneClickUnsubscribeUrl": "https://unsubscribe.example.com",
        "emailReplyToId": "da1afd3e-3368-4c3e-b239-76676471c2d4"
    }
}
```
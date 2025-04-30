Update `commsAddresses` to your own email address.

```
{
    "id": "EDAAA96D-A4F7-4B75-9104-F982F2D61412",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "d8017132-1909-4bee-b604-b07e8081dc82",
        "commsType": "email",
        "recipient": "jane.doe@defra.gov.uk",
        "personalisation": {
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
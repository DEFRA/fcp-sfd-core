Update `recipient` to your own email address.

```
{
    "id": "A0A3F5A0-CF6C-4359-AA1E-51F611330083",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "2f9b1e0e-b678-481c-839e-892ebf42fddf",
        "commsType": "email",
        "recipient": "jane.doe@defra.gov.uk",
        "personalisation": {
            "reference": "test-reference",
            "link_to_file": {
                "file": "SGVsbG8gd29ybGQK",
                "filename": "attachment.txt"
            }
        },
        "reference": "ffc-ahwr-example-reference",
        "oneClickUnsubscribeUrl": "https://unsubscribe.example.com",
        "emailReplyToId": "da1afd3e-3368-4c3e-b239-76676471c2d4"
    }
}
```

Update `commsAddresses` to your own email address.

```
{
    "id": "FFD4A226-CD25-483B-9231-67E143F15657",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "8d5b8cdf-49b1-46f0-b34e-4de62eec857a",
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
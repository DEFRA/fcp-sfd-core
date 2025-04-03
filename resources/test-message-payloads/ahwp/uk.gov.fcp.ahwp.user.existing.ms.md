Update `commsAddresses` to your own email address.

```
{
    "id": "123e4567-e89b-12d3-a456-426655440000",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "b6e58d4f-d396-439e-8b97-73e33b7b41c9",
        "commsType": "email",
        "commsAddresses": [
            "jane.doe@defra.gov.uk",
            "john.doe@defra.gov.uk"
        ],
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
Update `commsAddresses` to your own email address.

```
{
    "id": "BD711487-821F-4913-ACE7-7F4E3D721E44",
    "source": "ffc-ahwr-claim",
    "specversion": "1.0",
    "type": "uk.gov.fcp.sfd.notification.request",
    "datacontenttype": "application/json",
    "time": "2023-10-17T14:48:00Z",
    "data": {
        "crn": "1050000000",
        "sbi": "105000000",
        "sourceSystem": "ahwp",
        "notifyTemplateId": "32e4f0fc-cfe7-4545-bd6f-0b3389d40a22",
        "commsType": "email",
        "recipient": "jane.doe@defra.gov.uk",
        "personalisation": {
            "sbi": "105000000",
            "orgName": "Single Front Door Farms Ltd.",
            "claimReference": "test-claim-reference",
            "agreementReference": "test-agreement-reference",
            "customSpeciesBullets": "chicken"
        },
        "reference": "ffc-ahwr-example-reference",
        "oneClickUnsubscribeUrl": "https://unsubscribe.example.com",
        "emailReplyToId": "da1afd3e-3368-4c3e-b239-76676471c2d4"
    }
}
```
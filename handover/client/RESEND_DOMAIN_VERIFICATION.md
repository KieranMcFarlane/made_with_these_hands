# Resend Domain Verification

The application is configured to send product enquiries from
`enquiries@madewiththesehands.com` to Hugh's published podcast contact address.
The API key and addresses are stored in the server-only `.env.local` file and
are not included in this handover.

Resend domain `madewiththesehands.com` was created in the `eu-west-1` region on
25 August 2026. Its DNS is hosted by GoDaddy. Add these records in the
`madewiththesehands.com` DNS zone:

| Purpose | Type | Name | Value | Priority |
| --- | --- | --- | --- | --- |
| DKIM | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOc5so/QKUSlpq+mELCCrBTeF+c4zFbimuhJGgP6vRkl0jBhGWQFlRorYQomPb6PkMHCmcywfoeDUjaxdcHEKQ2gRufmCcH8nSyH2hl8jNo25FJ+cLxiHA/EUm+IdfSeYtd4+5zj2kuVbxl8FzT68No30yM4kCZNTV6Cjx2eHpPwIDAQAB` | - |
| Return path | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` | `10` |
| SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` | - |

After GoDaddy has propagated the records:

```bash
npm run production:readiness
npm run enquiries:send-test
```

Do not run the send test until readiness reports `verified: true`. Run it once,
then confirm that Hugh received the message and that it did not land in spam.

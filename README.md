# actions-docs

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This action builds and pushes latest docs to docs s3 storage

## Usage `tradeshift/actions-docs@v1`

The following are a few different usage examples

### Build and push latest docs

```yaml
jobs:
  docs:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v2
      - uses: tradeshift/actions-docs@v1
        with:
          path: docs/swagger.json
```

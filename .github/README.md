# Build and Deploy to Github Container Registry

This workflow will test, build and deploy a new version of the dual-job-date container to Github Container Registry.

## Jobs

### test

This job will test the application with a Headless Chrome browser.

#### Actions used in test job

- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/cache@v4

### build

This job will build the application and upload the dist folder to the artifacts.

#### Actions used in build job

- uses: actions/checkout@v4
- uses: actions/setup-node@v4
- uses: actions/cache@v4
- uses: actions/upload-artifact@v3

### deploy

This job will deploy the application to Github Container Registry.

#### Actions used in deploy job

- uses: actions/checkout@v4
- uses: actions/download-artifact@v4
- uses: docker/login-action@v3
- uses: docker/build-push-action@v5

## Cache

This workflow uses a cache to store the npm directory.

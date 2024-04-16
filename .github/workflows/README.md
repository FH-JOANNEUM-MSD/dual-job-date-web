# Dual Job Dating Web CI/CD Pipeline

![Build Test Deploy Workflow](https://github.com/FH-JOANNEUM-MSD/dual-job-date-web/actions/workflows/pipeline-build-test-deploy.yml/badge.svg)

A CI/CD Pipeline for the Section Web of the Dual Job Dating project. The goal of this Pipeline is the automatic building/testing and deployment of an Angular to the Github Container Registry.

## CI/CD Pipeline Documentation

This YAML file defines a Continuous Integration/Continuous Deployment (CI/CD) pipeline for an Angular project using Github Actions. The pipeline is triggered on push or pull request events to the main branch, and on release creation.

To use this workflow, you will need to push or merge to the `main` branch.

### Jobs

This pipeline consists of three jobs: `test`, `build`, and `deploy`.

#### Test Job

The `test` job performs the following steps:

1. **Checkout code**: This step checks out the repository code using the [actions/checkout@v4](https://github.com/actions/checkout) action.
2. **Setup Node**: This step sets up the Node.js environment using the [actions/setup-node@v4](https://github.com/actions/setup-node) action with caching enabled for npm.
3. **Install dependencies**: This step installs the project dependencies using the pipeline friendly `npm ci` command.
4. **Run tests**: This step runs the Angular tests using the predefined `npm run test:ci` command. The command can be found in the [package.json](../../package.json) file.

#### Build Job

The `build` job performs the following steps:

1. **Checkout code**: This step checks out the repository code using the [actions/checkout@v4](https://github.com/actions/checkout) action.
2. **Setup Node**: This step sets up the Node.js environment using the [actions/setup-node@v4](https://github.com/actions/setup-node) action with caching enabled for npm.
3. **Install dependencies**: This step installs the project dependencies using the pipeline friendly `npm ci` command.
4. **Build**: This step builds the Angular Application using the predefined `npm run build:ci` command. The command can be found in the [package.json](../../package.json) file.
5. **Archive Application**: This step saves the dist folder as an artifact using the [actions/upload-artifact@v4](https://github.com/actions/upload-artifact) action.

#### Deploy Job

The `deploy` job performs the following steps and needs following permissions to access the Github Container Registry:

1. **Checkout code**: This step checks out the repository code using the [actions/checkout@v4](https://github.com/actions/checkout) action.
2. **Convert to lowercase**: This step converts the repository name to lowercase to use it within the image name.
3. **Download Artifact**: This step downloads the artifact generated in the `build` job using the [actions/download-artifact@v4](https://github.com/actions/download-artifact) action.
4. **Login to GHCR**: This step logs in to the Github Container Registry using the [docker/login-action@v3](https://github.com/docker/login-action) action and the `GITHUB_TOKEN` secret to authenticate.
5. **Build and push Docker image**: This step builds and pushes the Container image to the Github Container Registry using the [docker/build-push-action@v5](https://github.com/docker/build-push-action) action.

##### Permissions

The `deploy` job requires the following permissions:

- contents: read
- packages: write

## Limitations

- The pipeline is triggered on push or pull request events to the main branch, and on release creation.
- The pipeline does not automatically deploy the application to the Kubernetes cluster. To deploy the application, you will need to manually deploy the image to the Kubernetes cluster using the `kubectl rollout restart deployment` command.

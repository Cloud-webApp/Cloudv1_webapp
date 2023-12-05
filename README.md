# :label: Web-App 

## :surfer: Author

[Altaf Shaikh](mailto:shaikh.alt@northeastern.edu)

This web application provides a platform for managing assignments by different users, submitting it and downloading via email link.

Below are example of how to perform Continuos Deployment - Instance Refresh and a demo api reference
[[Instance Refresh](https://github.com/Cloud-webApp/Cloudv1_webapp/blob/main/.github/workflows/build-ami-on-merge.yml)]

RESTful Backend API service for a fullstack web application.

Demo API for reference: [Swaggerhub](https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/fall2023-a9#/authenticated/assignment_submission)

## :package: Prerequisites

Before you begin, ensure you have met the following requirements:
- `git` (configured with ssh) [[link](https://git-scm.com/downloads)]
- `node v.16.17.0` and above [[link](https://nodejs.org/en/download/)]
- `Postman` to demo hit the APIs [[link](https://www.postman.com/downloads/)]

## :hammer_and_wrench: Install Web-App

1. **Clone thie project:**

   ```bash
   mkdir web-app
   git@github.com:Cloud-webApp/Cloudv1_webapp.git
   ```

2. **Initialize new Node.js:**
   ```bash
   npm init
   ```
   
3. **Install Dependencies if any version issue occurs:**
   ```bash
   npm install express sequelize@^6.33.0 pg pg-hstore sequelize-cli dotenv bcryptjs lodash csv-parser
   ```

4. **Database Setup:**
   -Create a postgres database for your project.
   -Update the .env file in your project root with your database configuration:

   ```bash
   DB_HOST=localhost
   DB_PORT="the port"s
   DB_USER="user-name"
   DB_PASSWORD="your passwprd"
   DB_DATABASE="db name"
   DB_DIALECT=postgres
   ```

5. **Starting the Application:**
   
   ```bash
   node app.js  //or npm start 
   ```

## :test_tube: Testing

To run the test suite, use the following commands:

- To run the test suite in interactive mode:

```shell
  npm run test:dev
```

- To run the test suite without interactive mode:

```shell
  #for npm users
  npm run test
```

-To perform Load Testing, we will use [Postman's](https://blog.postman.com/postman-api-performance-testing/) API performance runner

## :rocket: Production

To run the app in production mode, use the following command:

```shell
  npm run start
```

## :package: [Packer](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli?in=packer/aws-get-started)

We will build custom AMI (Amazon Machine Image) using Packer from HashiCorp.

### :arrow_heading_down: Installing Packer

Install Packer using Homebrew (only on MacOS):

- First, install the HashiCorp tap, a repository of all our Homebrew packages:

```shell
brew tap hashicorp/tap
```

- Now, install Packer with `hashicorp/tap/packer`:

```shell
brew install hashicorp/tap/packer
```

- To update to the latest, run:

```shell
brew upgrade hashicorp/tap/packer
```

- After installing Packer, verify the installation worked by opening a new command prompt or console, and checking that `packer` is available:

```shell
packer
```

> NOTE: If you get an error that packer could not be found, then your PATH environment variable was not set up properly. Please go back and ensure that your PATH variable contains the directory which has Packer installed. Otherwise, Packer is installed and you're ready to go!

### :wrench: Building Custom AMI using Packer

Packer uses Hashicorp Configuration Language(HCL) to create a build template. We'll use the [Packer docs](https://www.packer.io/docs/templates/hcl_templates) to create the build template file.

> NOTE: The file should end with the `.pkr.hcl` extension to be parsed using the HCL2 format.

#### Create the `.pkr.hcl` template

The custom AMI should have the following features:

> NOTE: The builder to be used is `amazon-ebs`.

- **OS:** `Ubuntu 22.04 LTS`
- **Build:** built on the default VPC
- **Device Name:** `/dev/sda1/`
- **Volume Size:** `50GiB`
- **Volume Type:** `gp2`
- Have valid `provisioners`.
- Pre-installed dependencies using a shell script.
- Web application software pre-installed on the AMI.

#### Shell Provisioners

This will automate the process of updating the OS packages and installing software on the AMI and will have our application in a running state whenever the custom AMI is used to launch an EC2 instance. It should also copy artifacts to the AMI in order to get the application running. It is important to bootstrap our application here, instead of manually SSH-ing into the AMI instance.

Install application prerequisites, middlewares and runtime dependencies here. Update the permission and file ownership on the copied application artifacts.

> NOTE: The file provisioners must copy the application artifacts and configuration to the right location.

#### Custom AMI creation

To create the custom AMI from the `.pkr.hcl` template created earlier, use the commands given below:

- If you're using Packer plugins , run the `init` command first:

```shell
# Installs all packer plugins mentioned in the config template
packer init .
```

- To format the template, use:

```shell
packer fmt .
```

- To validate the template, use:

```shell
# to validate syntax only
packer validate -syntax-only .
# to validate the template as a whole
packer validate -evaluate-datasources .
```

- To build the custom AMI using packer, use:

```shell
packer build <filename>.pkr.hcl
```

#### Packer HCL Variables

To prevent pushing sensitive details to your version control, we can have variables in the `<file-name>.pkr.hcl` file, and then declare the actual values for these variables in another HCL file with the extension `.pkrvars.hcl`.

If you want to validate your build configuration, you can use the following command:

```shell
packer validate -evaluate-datasources --var-file=<variables-file>.pkrvars.hcl <build-config>.pkr.hcl
```

> NOTE: To use the `-evaluate-datasources` parameter, you'll have to update packer to `v1.8.5` or greater. For more details, refer [this issue](https://github.com/hashicorp/packer/issues/12056).

To use this variables files when creating a golden image, use the build command as shown:

```shell
packer build --var-file=<variables-file>.pkrvars.hcl <build-config>.pkr.hcl
```

> NOTE: Using variables is the preferred way/best practice to build a custom AMI using HCP Packer!

#### [systemd](https://systemd.io/)

`systemd` is a suite of basic building blocks for a Linux system. It provides a system and service manager that runs as PID 1 and starts the rest of the system.. This will help us bootstrap our application and have it in a running state when we launch our custom AMI EC2 instance using the CloudFormation stack.

For a detailed example, please refer [this ShellHacks blog](https://www.shellhacks.com/systemd-service-file-example/).


## :arrows_clockwise: CI/CD pipelines

### Unit tests

This CI pipeline must run before changes are merged via a PR to the upstream master branch. Once the unit tests pass, the CI pipeline should check the validity of the packer build configuration.

### Validate template

This CI pipeline will validate the packer build template when a pull request is opened. The PR status checks should fail and block merge in case the template is invalid.

### Build AMI

This is the CD pipeline for our organization.

The AMI should be built when the PR is merged. The ami should be shared with the AWS `prod` account automatically. [This can be done by providing the AWS account ID in the packer template, [see here](https://developer.hashicorp.com/packer/plugins/builders/amazon/ebs#ami_users)].

Create the `.env` file on the fly, when unpacking artifacts! You will need to declare the environment secrets in the organization secrets, and read them during the CI/CD workflow.

After the AMI is built, we will create a new version of the launch template and update the original launch template. With this latest version of the launch template, we will issue an `instance-refresh` command that will update the instances running in our CloudFormation stack to use the latest version of the launch template.

Using the `instance-refresh` approach, we are just replacing the golden image in our app infra where instances using an older golden image are sacked, and new instances are launched using the latest golden image(AMI).


## :surfer: Author

[Altaf Shaikh](mailto:shaikh.alt@northeastern.edu)

## :scroll: License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
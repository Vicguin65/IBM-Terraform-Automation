# Identity Center API

AWS's IAM Identity Center [SCIM API](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) does not provide a user with certian functionalites. Consequently, it is recommendeed to go through the SDK. Exaples of the SCIM API limitations include paginated requests for ListUsers and certain requests that exist in Identity Store SDK functions do not exist in the SCIM API. Therefore, this project aims to build a REST API to to replicate the current SDK.

## Installation

Create a python virtual environment.

```bash
python -m venv .\venv
```

Activate the virtual environment.

```bash
venv\Scripts\activate.bat
```

Download the Python libraries.

```bash
pip install -r requirements.txt
```

## Prerequisites

Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
Setup [AWS credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
Install [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

## Setup

Change directory to identity-store-lambda

```bash
cd identity-store-lambda
```

Build with sam build

```bash
sam build
```

Deploy sam guided

```bash
sam deploy --guided
```

## Verification

Visit API Gateway on the AWS Console to see the endpoint URL.

## License

[MIT](https://choosealicense.com/licenses/mit/)

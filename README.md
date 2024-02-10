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

## License

[MIT](https://choosealicense.com/licenses/mit/)
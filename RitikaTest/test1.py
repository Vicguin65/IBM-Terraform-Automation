import boto3
from dotenv import load_dotenv
import pprint

"# Create a session in a specific region

session = boto3.Session(region_name='us-east-1')

# Create an IAM client
identity_store_client = session.client('identity_store')

# Call the list_users() method
response = identity_store_client.list_users()

# Extract user information from the response
print(response)
users = response['Users']


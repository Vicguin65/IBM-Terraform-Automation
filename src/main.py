import boto3
from dotenv import load_dotenv
import pprint

load_dotenv()

# API Calls
# TODO
# Add comments and description for each parameter 
def create_group(client, store_id, name, desc = 'No Description'):
    return client.create_group(IdentityStoreId = store_id, DisplayName = name, Description = desc)

def delete_group(client, store_id, group_id):
    return client.delete_group(IdentityStoreId = store_id, GroupId = group_id)

# TODO
# remove pagination
def list_group(client, store_id):
    # List the groups
    response = client.list_groups(IdentityStoreId = store_id)
    token = response.get('NextToken')

    while token is not None:
        next_response = client.list_groups(IdentityStoreId = id, NextToken = token)
        token = next_response.get('NextToken')
        response['Groups'] += next_response['Groups']
    
    return response

# Helper Functions
# TODO
# add more precaution/ "Are you sure you want to delete"
def delete_all_groups(client, store_id):
    response = list_group(client, store_id)
    for group in response['Groups']:
        delete_group(client, store_id, group['GroupId'])

def create_random_groups(client, store_id, amount: int):
    for i in range(amount):
        name = 'Test Group ' + str(i)
        create_group(client, store_id, name)

def main():
    # Create Identity Store client
    client = boto3.client('identitystore', region_name='us-west-1')
    store_id = 'd-916710dec9'
    pp = pprint.PrettyPrinter(indent=4)

    # Clear all groups
    delete_all_groups(client, store_id)
    response = list_group(client, store_id)
    pp.pprint(response)

    # Create random amount of groups
    num_groups = 1000
    create_random_groups(client, id, num_groups)
    response = list_group(client, id)
    # List the groups
    pp.pprint(response)
    
    return

main()
import boto3
from dotenv import load_dotenv
import pprint

load_dotenv()

# API Calls
def create_group(client, id, name, desc = 'No Description'):
    return client.create_group(IdentityStoreId = id, DisplayName = name, Description = desc)

def delete_group(client, id, group_id):
    return client.delete_group(IdentityStoreId = id, GroupId = group_id)

def list_group(client, id):
    return client.list_groups(IdentityStoreId = id)

# Helper Functions
def delete_all_groups(client, id):
    response = list_group(client, id)
    for group in response['Groups']:
        delete_group(client, id, group['GroupId'])

def create_random_groups(client, id, amount: int):
    for i in range(amount):
        name = 'Test Group ' + str(i)
        create_group(client, id, name)

def main():
    # Create Identity Store client
    client = boto3.client('identitystore', region_name='us-west-1')
    id = 'd-916710dec9'
    pp = pprint.PrettyPrinter(indent=4)

    # Clear all groups
    delete_all_groups(client, id)
    response = list_group(client, id)
    pp.pprint(response)

    # Create random amount of groups
    num_groups = 9
    create_random_groups(client, id, num_groups)
    response = list_group(client, id)
    # List the groups
    pp.pprint(response)
    

    return

main()
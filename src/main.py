import boto3
from dotenv import load_dotenv
import pprint

load_dotenv()

# API Calls
'''
Author: Tyler Du
 
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        name (string): The name of the group
        desc (string): Optional. Description of the group

    Returns:
        dict: The json response as a dict.
'''
def create_group(client, store_id, name, desc = 'No Description'):
    return client.create_group(IdentityStoreId = store_id, DisplayName = name, Description = desc)

'''
Author: Tyler Du
 
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        group_id (string): The id of the group being deleted

    Returns:
        dict: The json response as a dict.
'''
def delete_group(client, store_id, group_id):
    return client.delete_group(IdentityStoreId = store_id, GroupId = group_id)

'''
Author: Tyler Du
 
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        
    Returns:
        dict: The json response as a dict.
'''
def list_group(client, store_id):
    # List the first page of groups
    response = client.list_groups(IdentityStoreId = store_id)
    # Get the next page's token 
    token = response.get('NextToken')

    # While there is a next page, add to response dict
    while token is not None:
        next_response = client.list_groups(IdentityStoreId = id, NextToken = token)
        # Get next page's token
        token = next_response.get('NextToken')
        # Add this page's groups to the first response dict
        response['Groups'] += next_response['Groups']
    
    return response

# Helper Functions
'''
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        
    Returns:
        None
'''
def delete_all_groups(client, store_id):
    check_confirmation = input("Are you sure you want to delete all groups? (y/n)\n")
    if check_confirmation != 'y':
        return
    
    response = list_group(client, store_id)
    for group in response['Groups']:
        delete_group(client, store_id, group['GroupId'])

'''
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        amount (int): number of groups to be made     
    Returns:
        None
'''
def create_random_groups(client, store_id, amount: int):
    for i in range(amount):
        name = 'Test Group ' + str(i)
        create_group(client, store_id, name)

if __name__ == '__main__':
    # Create Identity Store client
    client = boto3.client('identitystore', region_name='us-west-1')
    store_id = 'd-916710dec9'
    pp = pprint.PrettyPrinter(indent=4)

    # Clear all groups
    delete_all_groups(client, store_id)
    response = list_group(client, store_id)
    pp.pprint(response)

    # Create random amount of groups
    num_groups = 400
    create_random_groups(client, store_id, num_groups)
    response = list_group(client, store_id)
    # List the groups
    pp.pprint(response)


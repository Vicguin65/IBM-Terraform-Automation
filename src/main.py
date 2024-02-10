import boto3
from dotenv import load_dotenv
import pprint

load_dotenv()

#GROUP FUNCTIONS

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

#USER FUNCTIONS
#create users must pass in client, identity_store_id, username, name
        
'''
    Author: Ritika Brahmadesam
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
        username (int): username of user
        first_name (string)
        last_name (string)     
    Returns:
        None
'''

def create_user(client, identity_store_id, username, first_name, last_name,
                middle_name=None, display_name=None, nickname=None, honorific_prefix=None,
                honorific_suffix=None, profile_url=None, 
                emails=None, addresses=None, phone_numbers=None, 
                user_type=None, title=None, preferred_language=None, 
                locale=None, timezone=None):
    #create a dictionary for the paramenters
    request_params = {
    'IdentityStoreId': identity_store_id,
    'UserName': username,
    'Name': {
        'Formatted': 'string',
        'FamilyName': last_name,
        'GivenName': first_name,
    },
}

    # IF ADDITIONAL PARAMETERS ARE SPECIFIED, ADD THEM AS WELL
    # if no display name is specifed, set it to the first and last name
    if display_name:
        request_params['DisplayName'] = display_name
    else:
        request_params['DisplayName'] = first_name + " " + last_name
    if middle_name:
        request_params["Name"]["MiddleName"] = middle_name
    if profile_url:
        request_params['ProfileUrl'] = profile_url
    if emails:
        request_params['Emails'] = emails
    if addresses:
        request_params['Addresses'] = addresses
    if phone_numbers:
        request_params['PhoneNumbers'] = phone_numbers
    if user_type:
        request_params['UserType'] = user_type
    if title:
        request_params['Title'] = title
    if preferred_language:
        request_params['PreferredLanguage'] = preferred_language
    if locale:
        request_params['Locale'] = locale
    if timezone:
        request_params['Timezone'] = timezone

    client.create_user(**request_params)

'''
    Author: Ritika Brahmadesam
    Args:
        client (boto3 client): The authenticated boto3 client
        store_id (string): The identity store id
    Returns:
        dict: the json file as a dict
'''

#lists all users in identity store using BOTO3
def list_users(client, identity_store_id):
    response = client.list_users(IdentityStoreId = identity_store_id)
    token = response.get('NextToken')

    # While there is a next page, add to response dict
    while token is not None:
        next_response = client.list_users(IdentityStoreId = identity_store_id, NextToken = token)
        # Get next page's token
        token = next_response.get('NextToken')
        # Add this page's users to the first response dict
        response['Users'] += next_response['Users']
    
    return response

#delete a user given an id. The id passed in is for the user you want to delete
def delete_user(identity_store_id, user_id):
    option = input("ARE YOU SURE YOU WANT TO DELETE USER " + user_id + "(Y/N): ")
    if(option.lower() != "y"):
        return

    response = client.delete_user(
        IdentityStoreId=identity_store_id,
        UserId=user_id
    )

# list information of a user
def helper_describe_user(client, identity_store_id, user_id):
    return client.describe_user(
    IdentityStoreId=identity_store_id,
    UserId=user_id
)    

if __name__ == "__main__":
    # Create Identity Store client
    client = boto3.client('identitystore', region_name='us-west-1')
    store_id = 'd-916710dec9'
    pp = pprint.PrettyPrinter(indent=4)
    print(client)
    # Clear all groups
    # delete_all_groups(client, store_id)
    # create_user(client, store_id, "bbob", "billy", "bob")
    # response = list_users(client, store_id)
    # pp.pprint(response)
    # response = list_group(client, store_id)
    # pp.pprint(response)

    # # # Create random amount of groups
    # num_groups = 1000
    # create_random_groups(client, id, num_groups)
    # response = list_group(client, id)
    # # List the groups
    # pp.pprint(response)


import boto3
from dotenv import load_dotenv
import pprint

load_dotenv()

#GROUP FUNCTIONS

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

#USER FUNCTIONS
#create users must pass in client, identity_store_id, username, name
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
        'MiddleName': middle_name,
    },
}

    # IF ADDITIONAL PARAMETERS ARE SPECIFIED, ADD THEM AS WELL
    # if no display name is specifed, set it to the first and last name
    if display_name:
        request_params['DisplayName'] = display_name
    else:
        request_params['DisplayName'] = first_name + " " + last_name
    
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
    return "Successfully created user {}".format(username)


#lists all users in identity store using BOTO3
def list_users(client, id, max_results):
    return client.list_users(
    IdentityStoreId=id,
    MaxResults=max_results,
)

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
def describe_user(identity_store_id, user_id):
    return client.describe_user(
    IdentityStoreId=identity_store_id,
    UserId=user_id
)    

if __name__ == "__main__":
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


import json
import boto3
from regions import regions

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
    
    try:
        client.create_user(**request_params)
    except Exception as e: 
        #duplicate usernames
        if "Duplicate UserName" in str(e):
            return {
                    'statusCode': 400,
                    'body': "Bad Request: duplicate usernames"
                }
        elif "emails.value" in str(e):
            return {
                    'statusCode': 400,
                    'body': "Bad Request: duplicate emails"
                }
        
        else:
            return {
                    'statusCode': 400,
                    'body': "Unexpected error " + str(e) 
                }
    

def post_user(event, client, identity_store_id):
    username = event['queryStringParameters'].get('username')
    if username is None:
        return {
            'statusCode': 400,
            'body': 'Bad request. No username provided.'
        }
            
    first_name = event['queryStringParameters'].get('firstName')
    if first_name is None:
        return {
            'statusCode': 400,
            'body': 'Bad request. No first name provided.'
        }
    last_name = event['queryStringParameters'].get('lastName')
    if last_name is None:
        return {
            'statusCode': 400,
            'body': 'Bad request. No last name provided.'
        }
    
    display_name = event['queryStringParameters'].get('displayName')
    middle_name = event['queryStringParameters'].get('middleName')
    profile_url = event['queryStringParameters'].get('profileUrl')
    email = event['queryStringParameters'].get('email')
    #if there is an email put it in appropriate format
    if email is not None:
        email = [{'Value': email}]
    addresses = event['queryStringParameters'].get('addresses')
    phone_numbers = event['queryStringParameters'].get('phoneNumbers')
    user_type = event['queryStringParameters'].get('userType')
    title = event['queryStringParameters'].get('title')
    preferred_language = event['queryStringParameters'].get('preferredLanguage')
    locale = event['queryStringParameters'].get('locale')
    timezone = event['queryStringParameters'].get('timezone')
    honorific_prefix = event['queryStringParameters'].get('honorificPrefix')
    honorific_suffix = event['queryStringParameters'].get('honorificSuffix')
    nickname = event['queryStringParameters'].get('nickname')
    

    return create_user(client, identity_store_id, username, first_name, last_name,
                middle_name, display_name, nickname, honorific_prefix,
                honorific_suffix, profile_url, email, addresses, phone_numbers,
                user_type, title, preferred_language, locale, timezone)



    
    
def lambda_handler(event, context):
    
    request_type = event['httpMethod']
    

    # parse out query stirng params
    if 'queryStringParameters' not in event or event['queryStringParameters'] is None:
        return {
            'statusCode': 400,
            'body': 'Bad request. No parameters provided with request'
        }
    
    
    # Check Store id was provided
    identity_store_id = event['queryStringParameters'].get('storeId')
    if identity_store_id is None or not identity_store_id:
        return {
            'statusCode': 400,
            'body': 'Bad request. No storeId provided.'
        }

    # Check region name parameter
    region = event['queryStringParameters'].get('regionName')
    if region is None or not region:
        return {
            'statusCode': 400,
            'body': 'Bad request. No regionName provided.'
        }
    if region not in regions:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid regionName {region}.'
        }
        
    client = boto3.client('identitystore', region_name=region)

    #Check if Store id provided is valid
    try: 
        client.list_users(IdentityStoreId=identity_store_id)
    except Exception as e:
        if 'ValidationException' in str(type(e)):
            return {
                'statusCode': 400,
                'body': f'Bad request. Invalid storeId {identity_store_id}.'
            }
        elif 'ResourceNotFoundException' in str(type(e)):
            return {
                'statusCode': 400,
                'body': f'Bad request. No IdentityStore in region {region}.'
            }
        else:
            return {
                'statusCode': 400,
                'body': 'Bad request.'
            }
    
    
        
    response = {}
    #Return provided request
    if(request_type == "GET"):
        response = list_users(client, identity_store_id)
            
    elif(request_type == "POST"):
        response = post_user(event, client, identity_store_id)
    else:
        return {
            'statusCode': 400,
            'body': f'Request type {request_type} not valid for users'
        }
    
    # Transform to Camel Case
    response = {key[0].lower() + key[1:]: value for key, value in response.items()}
    
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
    



import json
import boto3 
from regions import regions

def lambda_handler(event, context):
    
    request_type = event['httpMethod']
    membership_id = event['pathParameters']['membershipId']
    
    # Check queryStringParameters Exist
    if event['queryStringParameters'] is None:
        return {
            'statusCode': 400,
            'body': 'Bad request. No parameters provided with request'
        }
    
    # Check Valid Store id
    store_id = event['queryStringParameters'].get('storeId')
    if store_id is None or not store_id:
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
    
    # This is the current best way to check if store_id and region_name are valid
    try: 
        client.list_groups(IdentityStoreId=store_id)
    except Exception as e:
        if 'ValidationException' in str(type(e)):
            return {
                'statusCode': 400,
                'body': f'Bad request. Invalid storeId {store_id}.'
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
    
    try:
        response = client.describe_group_membership(
            IdentityStoreId=store_id,
            MembershipId=membership_id
        )
    except:
        return {
            'statusCode': 404,
            'body': f'Bad request. Invalid membershipId {membership_id}.'
        }
    
    if request_type == 'GET':
        # turn this dict into camelCase
        response['MemberId'] = {key[0].lower() + key[1:]: value for key, value in response['MemberId'].items()}
        
        
    elif request_type == 'DELETE':
        try:
            response = client.delete_group_membership(
                IdentityStoreId=store_id,
                MembershipId=membership_id
            )
        except:
            return {
                'statusCode': 404,
                'body': f'Bad request. Invalid membershipId {membership_id}.'
            }
    
    else:
        return {
            'statusCode': 400,
            'body': f'Request type {request_type} not valid for memberships'
        }
    
    # Transform to Camel Case
    response = {key[0].lower() + key[1:]: value for key, value in response.items()}
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

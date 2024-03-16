import json
import boto3 

def lambda_handler(event, context):
    
    client = boto3.client('identitystore', region_name='us-west-1')
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
    
    #TODO Find a better way to implement store_id check.
    try: 
        client.list_groups(IdentityStoreId=store_id)
    except:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid storeId {store_id}.'
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
        pass
        
        
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
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

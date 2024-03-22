import json
import boto3 

def lambda_handler(event, context):
    # TODO IMPLEMENT GOOD SECURITY!!! CURRENTLY THE ENTIRE IDENTITY STORE IS EXPOSED
    
    client = boto3.client('identitystore', region_name='us-west-1')
    request_type = event['httpMethod']
    group_id = event['pathParameters']['groupId']
    
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
    
    # Check if valid group
    try:
        response = client.describe_group(
            IdentityStoreId=store_id,
            GroupId=group_id
        )
    except:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid groupId {group_id}.'
        }
        
    response = {}
    if request_type == 'GET':
        response = client.describe_group(
            IdentityStoreId=store_id,
            GroupId=group_id
        )
        
    elif request_type == 'DELETE':
        try:
            response = client.delete_group(
                IdentityStoreId=store_id,
                GroupId=group_id
            )
            response['Message'] = f'Successfully deleted group {group_id}'
        except:
            return {
                'statusCode': 400,
                'body': 'Bad request.'
            }
    
    elif request_type == 'PATCH':
        name = event['queryStringParameters'].get('name')
        description = event['queryStringParameters'].get('desc')
        operations = []
        if name:
           operations.append(
                {
                    'AttributePath':'DisplayName',
                    'AttributeValue': name
                }   
            ) 
            
        if description:
            operations.append(
                {
                    'AttributePath':'Description',
                    'AttributeValue': description
                }   
            )
            
        try:
            response = client.update_group(
                IdentityStoreId=store_id,
                GroupId=group_id,
                Operations=operations
            )
            response['Operations'] = operations
        except Exception as e:
            # Duplicate Groups Error
            if 'Conflict' in str(e):
                return {
                    'statusCode': 400,
                    'body': 'Bad request. Duplicate Group name.'
                }
            
            # Some other error
            else:
                return {
                    'statusCode': 400,
                    'body': 'Bad request.'
                }
    else:
        return {
            'statusCode': 400,
            'body': f'Request type {request_type} not valid for groups'
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

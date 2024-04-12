import json
import boto3 
import botocore

def lambda_handler(event, context):
    
    request_type = event['httpMethod']
    group_id = event['pathParameters']['groupId']
    
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

    # Create client
    client = boto3.client('identitystore', region_name=region)

    # This is the current best way to check if store_id and region_name are valid
    try: 
        client.list_groups(IdentityStoreId=store_id)
    except botocore.exceptions.EndpointConnectionError as e:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid regionName {region}.'
        }
    except Exception as e:
        if 'ValidationException' in str(type(e)):
            return {
                'statusCode': 400,
                'body': f'Bad request. Invalid storeId {store_id}.'
            }
        else:
            return {
                'statusCode': 400,
                'body': 'Bad request.'
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
        
        # Transform to Camel Case
        response = {key[0].lower() + key[1:]: value for key, value in response.items()}
        return {
            'statusCode': 201,
            'body': json.dumps(response),
        }
    else:
        return {
            'statusCode': 400,
            'body': f'Request type {request_type} not valid for groups'
        }
    
    # Transform to Camel Case
    response = {key[0].lower() + key[1:]: value for key, value in response.items()}
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

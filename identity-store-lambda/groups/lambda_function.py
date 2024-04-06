import json
import boto3
import botocore 

def lambda_handler(event, context):
    
    
    request_type = event['httpMethod']
    
    # Check queryStringParameters Exists
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
    
    response = {}
    if request_type == 'POST':
        
        # Check Valid Group Name
        group_name = event['queryStringParameters'].get('name')
        if group_name is None or not group_name:
            return {
                'statusCode': 400,
                'body': 'Bad request. No name provided.'
            }
            
        # Check Valid Description
        description = event['queryStringParameters'].get('desc')
        if description is None or not description:
            return {
                'statusCode': 400,
                'body': 'Bad request. No description provided.'
            }
            
        try:
            response = client.create_group(IdentityStoreId = store_id, DisplayName = group_name, Description = description)
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
                
        return {
            'statusCode': 201,
            'body': json.dumps(response)
        }
            
    elif request_type == 'GET':
        # List the first page of groups
        response = client.list_groups(IdentityStoreId = store_id)
        # Get the next page's token 
        token = response.get('NextToken')
    
        # While there is a next page, add to response dict
        while token is not None:
            next_response = client.list_groups(IdentityStoreId = store_id, NextToken = token)
            # Get next page's token
            token = next_response.get('NextToken')
            # Add this page's groups to the first response dict
            response['Groups'] += next_response['Groups']
        
        # Remove NextToken
        response.pop('NextToken', None)
    
    else:
        return {
            'statusCode': 400,
            'body': f'Request type {request_type} not valid for groups'
        }
    
    
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

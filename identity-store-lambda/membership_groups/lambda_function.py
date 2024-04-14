import json
import boto3 
from regions import regions

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
    
    # Check if valid group
    try:
        response = client.describe_group(
            IdentityStoreId=store_id,
            GroupId=group_id
        )
    except:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid groupId "{group_id}".'
        }
        
    response = {}
    if request_type == 'GET':
        # Create paginator
        paginator = client.get_paginator('list_group_memberships')

        # Create page iterator
        page_iterator = paginator.paginate(IdentityStoreId=store_id, GroupId=group_id)

        # Add each page to response
        response['GroupMemberships'] = []
        for page in page_iterator:
            for membership in page['GroupMemberships']:
                membership = {key[0].lower() + key[1:]: value for key, value in membership.items()}
                membership['memberId'] = {key[0].lower() + key[1:]: value for key, value in membership['memberId'].items()}
                response['GroupMemberships'].append(membership)
        
        
    elif request_type == 'DELETE':
        user_id = event['queryStringParameters'].get('userId')
        if user_id is None or not user_id:
            return {
                'statusCode': 400,
                'body': 'Bad request. No userId provided.'
            }
        try:    
            response_membership = client.get_group_membership_id(
                IdentityStoreId = store_id,
                GroupId = group_id,
                MemberId={
                    'UserId': user_id
                }
            )
        except Exception as e:
            if 'Resource' in str(e):
                return {
                    'statusCode': 400,
                    'body': f'Bad request. No membership for userId {user_id}'
                }
            elif 'Validation' in str(e):
                return {
                    'statusCode': 400,
                    'body': f'Bad request. Invalid userId "{user_id}"'
                }
                
            return {
                'statusCode': 400,
                'body': 'Bad request.'
            }
        response = client.delete_group_membership(
            IdentityStoreId=store_id,
            MembershipId=response_membership['MembershipId']
        )
        response['Message'] = f'Successfully deleted group membership for userId {user_id}'
            
    elif request_type == 'POST':
        user_id = event['queryStringParameters'].get('userId')
        if user_id is None or not user_id:
            return {
                'statusCode': 400,
                'body': 'Bad request. No userId provided.'
            }
        try:    
            client.describe_user(
                IdentityStoreId=store_id,
                UserId=user_id
            )
        except Exception as e:
            if 'Validation' in str(e):
                return {
                    'statusCode': 400,
                    'body': f'Bad request. Invalid userId "{user_id}"'
                }
                
            return {
                'statusCode': 400,
                'body': 'Bad request.'
            }
        
        try:
            response = client.create_group_membership(
                IdentityStoreId=store_id,
                GroupId=group_id,
                MemberId={
                    'UserId': user_id
                }
            )
        except:
            return {
                'statusCode': 409,
                'body': f'Bad request. Membership already exists with groupId {group_id} and userId {user_id}'
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
            'body': f'Request type {request_type} not valid for memberships'
        }
    
    # Transform to Camel Case
    response = {key[0].lower() + key[1:]: value for key, value in response.items()}
    return {
        'statusCode': 200,
        'body': json.dumps(response),
    }

import json
import boto3 

def lambda_handler(event, context):
    
    client = boto3.client('identitystore', region_name='us-west-1')
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
    
    #TODO Find a better way to implement store_id check.
    try: 
        client.list_groups(IdentityStoreId=store_id)
    except:
        return {
            'statusCode': 400,
            'body': f'Bad request. Invalid storeId "{store_id}".'
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

        # List the first page of memberships
        response = client.list_group_memberships(
            IdentityStoreId=store_id,
            GroupId=group_id
        )
        # Get the next page's token 
        token = response.get('NextToken')
    
        # While there is a next page, add to response dict
        while token is not None:
            next_response = client.list_group_memberships(
                IdentityStoreId = store_id,
                GroupId = group_id,
                NextToken = token
            )
            # Get next page's token
            token = next_response.get('NextToken')
            # Add this page's groups to the first response dict
            response['Groups'] += next_response['Groups']
        
        # Remove NextToken
        response.pop('NextToken', None)
        
        
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
        
        return {
            'statusCode': 201,
            'body': json.dumps(response),
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

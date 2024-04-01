import json
import boto3 

def update_user(client, identity_store_id, user_id, new_username, new_path=None):
    try:
        response = client.update_user(
            IdentityStoreId=identity_store_id,
            UserId=user_id,
            NewUserName=new_username,
            NewPath=new_path
        )
        return response
    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"An unexpected error occurred: {str(e)}"
        }


def delete_user(client, identity_store_id, user_id):
    try:
        client.delete_user(
            IdentityStoreId=identity_store_id,
            UserId=user_id
        )
        return {
            "body": "deleted user: " + str(user_id)
        }
    except Exception as e:
        return {
            "body": "An unexpected error occured: " + str(e)
        }
            


# list information of a user
def describe_user(client, identity_store_id, user_id):
    try:
        response = client.describe_user(
            IdentityStoreId=identity_store_id,
            UserId=user_id
        )
        return response
    except Exception as e:
        return{
            "body":str(e)
        }


def lambda_handler(event, context):
    client = boto3.client('identitystore', region_name='us-west-1')
    request_type = event['httpMethod']
    user_id = event['pathParameters']['userId']  # Fixed variable name

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
    
    #check if the store id can call a boto3 function
    try: 
        client.list_users(IdentityStoreId=store_id)
    except Exception as e:
        return {
                    'statusCode': 400,
                    'body': f"store id {store_id} is invalid"
                }
    
    response = {}
    
    if request_type == 'GET':
        response = describe_user(client, store_id, user_id)  # Pass store_id instead of identity_store_id
    elif request_type == 'DELETE':
        response = delete_user(client, store_id, user_id)
    elif request_type == 'PATCH':
        pass
    

    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }

regions = [
            'eu-north-1', 'ap-south-1', 'eu-west-3', 'eu-west-2',
            'eu-west-1', 'ap-northeast-3', 'ap-northeast-2'
            'ap-northeast-1', 'sa-east-1', 'ca-central-1', 
            'ap-southeast-2', 'eu-central-1', 'us-east-1', 'us-east-2',
            'us-west-1', 'us-west-2']

def to_camel(s):
  return s[0].lower() + s[1:]

def t_dict(d):
   if isinstance(d, list):
      return [t_dict(i) if isinstance(i, (dict, list)) else i for i in d]
   return {to_camel(a):t_dict(b) if isinstance(b, (dict, list)) else b for a, b in d.items()}
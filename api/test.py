import boto3

client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("access_key"),
    aws_secret_access_key=os.getenv("secret_access_key"),
)

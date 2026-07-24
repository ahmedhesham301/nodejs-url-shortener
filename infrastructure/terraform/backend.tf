# terraform {
#   backend "s3" {
#     bucket                      = "url-shortener"
#     key                         = "url.tfstate"
#     region                      = "auto" # Tigris is region-agnostic for the S3 API
#     endpoints                   = { s3 = "https://t3.storage.dev" } # Official Tigris S3 endpoint
#     # use_lockfile                = true # Enables native S3 state locking
    
#     # Credentials (avoid hardcoding; pass as environment variables instead)

    
#     # Required compatibility settings for third-party S3 endpoints
#     skip_credentials_validation = true
#     skip_requesting_account_id  = true
#     skip_metadata_api_check     = true
#     skip_region_validation      = true
#     use_path_style              = true
#   }
# }
    
variable "hcloud_token" {
  sensitive = true
}

# variable "tigris_access_key" {
#     sensitive = true
# }

# variable "tigris_secret_key" {
#     sensitive = true
# }

variable "my_ip" {
    sensitive = true
    default = "0.0.0.0/0"
}
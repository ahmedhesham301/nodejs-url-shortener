output "k6_server_ip" {
  value       = hcloud_server.k6_server.ipv4_address
  sensitive   = false            #optional
}

output "database_private_ip" {
  value = [for network in hcloud_server.database.network : network.ip]
}

output "multi_purpose_server_ip" {
  value = [for network in hcloud_server.multi_purpose_server.network : network.ip]
}
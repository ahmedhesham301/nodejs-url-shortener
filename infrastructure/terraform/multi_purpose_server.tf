resource "hcloud_server" "multi_purpose_server" {
  name        = "multi-purpose-server"
  location    = "nbg1"
  image       = "docker-ce"
  server_type = "cpx22"
  ssh_keys    = ["ahmed@ahmed-82k1"]
  network {
    network_id = hcloud_network.network.id
  }
  public_net {
    ipv4_enabled = true
    ipv6_enabled = false
  }
  firewall_ids = [hcloud_firewall.allow_https.id, hcloud_firewall.allow_ssh.id]
  user_data    = <<EOT
#cloud-config
package_update: true
runcmd:
  - mkdir -p /app/configs/ca
  - wget https://raw.githubusercontent.com/ahmedhesham301/nodejs-url-shortener/refs/heads/main/backend/docker-compose.yaml -P /app
  - wget https://raw.githubusercontent.com/ahmedhesham301/nodejs-url-shortener/refs/heads/main/backend/configs/nginx.conf -P /app/configs
  - openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /app/configs/ca/nginx-selfsigned.key -out /app/configs/ca/nginx-selfsigned.crt -subj '/C=EG/ST=Cairo/L=Cairo'
  - docker compose -f /app/docker-compose.yaml up -d grafana loki pgadmin prometheus nginx
EOT
}

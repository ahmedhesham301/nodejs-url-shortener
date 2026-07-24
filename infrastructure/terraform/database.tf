# Create a new server running debian
resource "hcloud_server" "database" {
  name        = "database"
  location    = "nbg1"
  image       = "docker-ce"
  server_type = "cpx22"
  ssh_keys = [ "ahmed@ahmed-82k1" ]
  network {
    network_id = hcloud_network.network.id
  }
  public_net {
    ipv4_enabled = true
    ipv6_enabled = false
  }
  firewall_ids = [ hcloud_firewall.allow_ssh.id ]
  user_data = <<EOT
#cloud-config
runcmd:
  - mkdir -p /opt/configs
  - wget https://raw.githubusercontent.com/ahmedhesham301/nodejs-url-shortener/refs/heads/main/backend/configs/init.sql -P /opt/configs
  - |
    docker run -d \
      --name db \
      --hostname db \
      -e POSTGRES_PASSWORD=1234 \
      -p 5432:5432 \
      --restart unless-stopped \
      -v /opt/configs/init.sql:/docker-entrypoint-initdb.d/init.sql \
      postgres:18
EOT
}

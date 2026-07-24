# Create a new server running debian
resource "hcloud_server" "k6_server" {
  name        = "k6"
  location    = "nbg1"
  image       = "debian-12"
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
packages:
  - git
runcmd:
  - curl -fsSL https://dl.k6.io/key.gpg | gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
  - echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | tee /etc/apt/sources.list.d/k6.list
  - apt-get update
  - apt-get install k6
  - git clone https://github.com/ahmedhesham301/nodejs-url-shortener-infra.git
EOT
}

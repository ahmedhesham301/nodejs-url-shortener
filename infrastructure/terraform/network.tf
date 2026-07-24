resource "hcloud_network" "network" {
  name     = "network"
  ip_range = "10.0.0.0/16"
}

resource "hcloud_network_subnet" "network_subnet" {
  type         = "cloud"
  network_id   = hcloud_network.network.id
  network_zone = "eu-central"
  ip_range     = "10.0.1.0/24"
}

resource "hcloud_firewall" "allow_https" {
  name = "allow-https"
  rule {
    direction = "in"
    protocol  = "tcp"
    port = "443"
    source_ips = [
      var.my_ip
    ]
  }
}

resource "hcloud_firewall" "allow_ssh" {
  name = "allow-ssh"
  rule {
    direction = "in"
    protocol  = "tcp"
    port = "22"
    source_ips = [
      var.my_ip
    ]
  }
}

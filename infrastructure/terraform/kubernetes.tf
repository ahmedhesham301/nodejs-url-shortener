module "kubernetes" {
  source  = "hcloud-k8s/kubernetes/hcloud"
  version = "5.3.0"

  cluster_name = "k8s"
  hcloud_token = var.hcloud_token
  hcloud_network = {
    id = hcloud_network.network.id
  }

  cluster_access = "public"
  firewall_use_current_ipv6 = false
  cluster_delete_protection = false
    
  # Export configs for talosctl and kubectl (optional)
  cluster_kubeconfig_path  = "kubeconfig"
  cluster_talosconfig_path = "talosconfig"

  # Enable Cilium Gateway API and Cert Manager (optional)
  cert_manager_enabled       = true
  cilium_gateway_api_enabled = true

  control_plane_nodepools = [
    { name = "control", type = "cpx22", location = "nbg1", count = 1 }
  ]
  worker_nodepools = [
    { name = "worker", type = "cpx22", location = "nbg1", count = 1 }
  ]
  
}   
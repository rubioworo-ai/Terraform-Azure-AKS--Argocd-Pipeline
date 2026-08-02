location            = "East US"
resource_group_name = "kml_rg_main-9968987ef1434245"
vnet_name           = "k8s-vnet"
address_space = [
  "10.0.0.0/16"
]
public_subnet_name = "master-subnet"
public_subnet_prefix = [
  "10.0.1.0/24"
]
private_subnet_name = "worker-subnet"

private_subnet_prefix = [
  "10.0.2.0/24"
]
master_vm_name  = "k8s-master"
worker1_vm_name = "k8s-worker-1"
worker2_vm_name = "k8s-worker-2"
vm_size         = "Standard_B2s"
admin_username  = "azureuser"
admin_password  = "Admin@123"
subscription_id = "a2b28c85-1948-4263-90ca-bade2bac4df4"
acr_name        = "devquickbite"

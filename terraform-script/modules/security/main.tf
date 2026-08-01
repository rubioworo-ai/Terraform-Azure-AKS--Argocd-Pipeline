resource "azurerm_network_security_group" "master" {
  name                = "master-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_network_security_rule" "master_ssh" {
  name                        = "allow-ssh"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.master.name
}

resource "azurerm_network_security_rule" "kube_api" {
  name                        = "kubernetes-api"
  priority                    = 110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "6443"
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.master.name
}

resource "azurerm_network_security_rule" "worker_to_master" {
  name                        = "worker-master"
  priority                    = 120
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = "10.0.2.0/24"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.master.name
}

resource "azurerm_network_security_group" "worker" {
  name                = "worker-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name
}

resource "azurerm_network_security_rule" "worker_ssh" {
  name                        = "worker-ssh"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "22"
  source_address_prefix       = "10.0.1.0/24"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.worker.name
}

resource "azurerm_network_security_rule" "kubelet" {
  name                        = "kubelet"
  priority                    = 110
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = "10250"
  source_address_prefix       = "10.0.1.0/24"
  destination_address_prefix  = "*"
  resource_group_name         = var.resource_group_name
  network_security_group_name = azurerm_network_security_group.worker.name
}

resource "azurerm_subnet_network_security_group_association" "master" {
  subnet_id                 = var.public_subnet_id
  network_security_group_id = azurerm_network_security_group.master.id
}

resource "azurerm_subnet_network_security_group_association" "worker" {
  subnet_id                 = var.private_subnet_id
  network_security_group_id = azurerm_network_security_group.worker.id
}

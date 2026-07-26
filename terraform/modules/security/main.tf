resource "azurerm_network_security_group" "this" {
  name                = var.nsg_name
  location            = var.location
  resource_group_name = var.resource_group_name



  security_rule {
    name                       = "allow-ssh"
    priority                   = 100
    direction                  = "Inbound"
    access                    = "Allow"
    protocol                  = "Tcp"

    source_port_range          = "*"
    destination_port_range     = "22"

    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }



  security_rule {
    name                       = "allow-k3s-api"
    priority                   = 110
    direction                  = "Inbound"
    access                    = "Allow"
    protocol                  = "Tcp"

    source_port_range          = "*"
    destination_port_range     = "6443"

    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }


  security_rule {
    name                       = "allow-internal-k3s"
    priority                   = 120
    direction                  = "Inbound"
    access                    = "Allow"
    protocol                  = "*"

    source_port_range          = "*"
    destination_port_range     = "*"

    source_address_prefix      = "10.0.1.0/24"
    destination_address_prefix = "10.0.1.0/24"
  }
}



resource "azurerm_subnet_network_security_group_association" "this" {
  subnet_id                 = var.subnet_id
  network_security_group_id = azurerm_network_security_group.this.id
}
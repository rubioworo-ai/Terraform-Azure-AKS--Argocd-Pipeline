resource "azurerm_public_ip" "this" {
  count = var.vm_count

  name                = "k3s-vm-${count.index + 1}-public-ip"
  location            = var.location
  resource_group_name = var.resource_group_name

  allocation_method = "Static"
  sku               = "Standard"
}

resource "azurerm_network_interface" "this" {
  count = var.vm_count

  name                = "k3s-vm-${count.index + 1}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.this[count.index].id
  }
}

resource "azurerm_network_interface_security_group_association" "this" {
  count                     = var.vm_count
  network_interface_id      = azurerm_network_interface.this[count.index].id
  network_security_group_id = var.nsg_id
}

resource "azurerm_linux_virtual_machine" "this" {
  count = var.vm_count

  name                = "k3s-vm-${count.index + 1}"
  location            = var.location
  resource_group_name = var.resource_group_name

  size           = var.vm_size
  admin_username = var.admin_username

  network_interface_ids = [
    azurerm_network_interface.this[count.index].id
  ]

  disable_password_authentication = true

  admin_ssh_key {
    username   = var.admin_username
    public_key = file(var.ssh_public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }

  custom_data = base64encode(
    count.index == 0 ?
    <<-EOT
      #!/bin/bash
      apt-get update
      apt-get install -y curl
      curl -sfL https://get.k3s.io | sh -
      echo "K3s Server installation completed"
    EOT
    :
    <<-EOT
      #!/bin/bash
      apt-get update
      apt-get install -y curl
      echo "K3s Agent VM is ready"
    EOT
  )
}

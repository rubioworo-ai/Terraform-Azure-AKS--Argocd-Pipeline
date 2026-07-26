resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

module "network" {
  source   = "./modules/network"
  rg_name  = azurerm_resource_group.main.name
  location = azurerm_resource_group.main.location
}

module "compute" {
  source              = "./modules/compute"
  rg_name             = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  public_subnet_id    = module.network.public_subnet_id
  nsg_id              = module.network.nsg_id
  admin_username      = "adminuser"
  ssh_public_key_path = "~/.ssh/id_rsa.pub"
}

module "database" {
  source            = "./modules/database"
  rg_name           = azurerm_resource_group.main.name
  location          = azurerm_resource_group.main.location
  private_subnet_id = module.network.private_subnet_id
}

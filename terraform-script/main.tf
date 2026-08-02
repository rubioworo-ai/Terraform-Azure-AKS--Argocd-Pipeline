data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

module "network" {
  source                = "./modules/network"
  resource_group_name   = data.azurerm_resource_group.main.name
  location              = var.location
  vnet_name             = var.vnet_name
  address_space         = var.address_space
  public_subnet_name    = var.public_subnet_name
  public_subnet_prefix  = var.public_subnet_prefix
  private_subnet_name   = var.private_subnet_name
  private_subnet_prefix = var.private_subnet_prefix
}

module "security" {
  source              = "./modules/security"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  public_subnet_id    = module.network.public_subnet_id
  private_subnet_id   = module.network.private_subnet_id
}

module "compute" {
  source              = "./modules/compute"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  public_subnet_id    = module.network.public_subnet_id
  private_subnet_id   = module.network.private_subnet_id
  public_ip_id        = module.network.master_public_ip_id
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  vm_size             = var.vm_size
}

module "acr" {
  source              = "./modules/acr"
  acr_name            = var.acr_name
  resource_group_name = var.resource_group_name
  location            = var.location

}
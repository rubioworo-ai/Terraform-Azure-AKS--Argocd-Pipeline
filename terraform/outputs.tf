output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "public_subnet_id" {
  value = module.network.public_subnet_id
}

output "private_subnet_id" {
  value = module.network.private_subnet_id
}

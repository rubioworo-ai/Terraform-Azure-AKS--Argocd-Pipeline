output "public_subnet_id" { value = azurerm_subnet.public_subnet.id }
output "private_subnet_id" { value = azurerm_subnet.private_subnet.id }
output "master_public_ip_id" { value = azurerm_public_ip.master.id }

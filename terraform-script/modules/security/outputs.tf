output "master_nsg_id" { value = azurerm_network_security_group.master.id }
output "worker_nsg_id" { value = azurerm_network_security_group.worker.id }

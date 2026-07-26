output "vm_names" {
  description = "Names of the K3s VMs"
  value       = azurerm_linux_virtual_machine.this[*].name
}

output "vm_public_ips" {
  description = "Public IP addresses"
  value       = azurerm_public_ip.this[*].ip_address
}

output "vm_private_ips" {
  description = "Private IP addresses"
  value       = azurerm_network_interface.this[*].private_ip_address
}

output "vm_ids" {
  description = "VM resource IDs"
  value       = azurerm_linux_virtual_machine.this[*].id
}
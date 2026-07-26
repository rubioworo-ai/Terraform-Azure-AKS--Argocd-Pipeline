variable "resource_group_name" {
  description = "Existing Azure Resource Group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for the K3s VMs"
  type        = string
}

variable "nsg_id" {
  description = "NSG ID for the K3s VMs"
  type        = string
}

variable "vm_count" {
  description = "Number of VMs"
  type        = number
  default     = 3
}

variable "vm_size" {
  description = "Azure VM size"
  type        = string
  default     = "Standard_B2s"
}

variable "admin_username" {
  description = "VM admin username"
  type        = string
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key"
  type        = string
}

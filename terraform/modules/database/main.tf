resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "app-postgres-server"
  location               = var.location
  resource_group_name    = var.rg_name
  sku_name               = "B_Standard_B1ms"
  administrator_login    = "dbadmin"
  administrator_password = "Password1234!" 
  delegated_subnet_id    = var.private_subnet_id
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (prod | staging)"
  type        = string
  default     = "prod"
}

variable "api_futebol_key" {
  description = "API key for api-futebol.com.br"
  type        = string
  sensitive   = true
}

variable "serie_a_id" {
  description = "Campeonato ID for Série A in API Futebol"
  type        = number
  default     = 10
}

variable "serie_b_id" {
  description = "Campeonato ID for Série B in API Futebol"
  type        = number
  default     = 11
}

variable "monte_carlo_n" {
  description = "Number of Monte Carlo simulations per run"
  type        = number
  default     = 10000
}

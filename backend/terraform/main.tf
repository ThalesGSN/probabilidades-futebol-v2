terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix  = "probabilidades-futebol-${var.environment}"
  lambda_dir   = "${path.module}/../lambdas/data-pipeline"
  lambda_zip   = "${path.module}/lambda_package.zip"
}

# ─── Secrets Manager ─────────────────────────────────────────────────────────

resource "aws_secretsmanager_secret" "api_futebol_key" {
  name                    = "${local.name_prefix}/api-futebol-key"
  description             = "API key for api-futebol.com.br"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "api_futebol_key" {
  secret_id     = aws_secretsmanager_secret.api_futebol_key.id
  secret_string = var.api_futebol_key
}

# ─── S3 Bucket ───────────────────────────────────────────────────────────────

resource "aws_s3_bucket" "data" {
  bucket = "${local.name_prefix}-data"
}

resource "aws_s3_bucket_cors_configuration" "data" {
  bucket = aws_s3_bucket.data.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket                  = aws_s3_bucket.data.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ─── CloudFront OAC ──────────────────────────────────────────────────────────

resource "aws_cloudfront_origin_access_control" "data" {
  name                              = "${local.name_prefix}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "data" {
  bucket = aws_s3_bucket.data.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontRead"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.data.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.data.arn
        }
      }
    }]
  })
  depends_on = [aws_cloudfront_distribution.data]
}

# ─── CloudFront Distribution ──────────────────────────────────────────────────

resource "aws_cloudfront_distribution" "data" {
  enabled             = true
  comment             = "${local.name_prefix} data CDN"
  default_root_object = ""
  price_class         = "PriceClass_100"   # US + Europe (menor custo)

  origin {
    domain_name              = aws_s3_bucket.data.bucket_regional_domain_name
    origin_id                = "s3-data"
    origin_access_control_id = aws_cloudfront_origin_access_control.data.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-data"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"  # CachingOptimized (AWS managed)

    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors.id
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_response_headers_policy" "cors" {
  name = "${local.name_prefix}-cors-policy"

  cors_config {
    access_control_allow_credentials = false
    access_control_allow_headers { items = ["*"] }
    access_control_allow_methods { items = ["GET", "HEAD"] }
    access_control_allow_origins { items = ["*"] }
    origin_override = true
  }
}

# ─── IAM Role para a Lambda ───────────────────────────────────────────────────

resource "aws_iam_role" "lambda" {
  name = "${local.name_prefix}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "lambda" {
  name = "${local.name_prefix}-lambda-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:PutObjectAcl"]
        Resource = "${aws_s3_bucket.data.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = aws_secretsmanager_secret.api_futebol_key.arn
      },
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# ─── Lambda Package ───────────────────────────────────────────────────────────

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = local.lambda_dir
  output_path = local.lambda_zip
  excludes    = ["__pycache__", "*.pyc", "*.pyo", ".pytest_cache", "tests"]
}

# ─── Lambda Function ─────────────────────────────────────────────────────────

resource "aws_lambda_function" "data_pipeline" {
  function_name    = "${local.name_prefix}-data-pipeline"
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  role             = aws_iam_role.lambda.arn
  handler          = "handler.handler"
  runtime          = "python3.12"
  timeout          = 300   # 5 minutos (Monte Carlo 10k é ~30-60s)
  memory_size      = 512

  environment {
    variables = {
      S3_BUCKET_NAME  = aws_s3_bucket.data.bucket
      API_FUTEBOL_KEY = ""                           # injetado via init abaixo
      SERIE_A_ID      = tostring(var.serie_a_id)
      SERIE_B_ID      = tostring(var.serie_b_id)
      MONTE_CARLO_N   = tostring(var.monte_carlo_n)
    }
  }

  depends_on = [aws_iam_role_policy.lambda]
}

# Injeta a key do Secrets Manager como variável de ambiente via Lambda config update.
# Alternativa: o handler.py pode buscar do Secrets Manager em runtime (mais seguro).
resource "aws_lambda_function_event_invoke_config" "data_pipeline" {
  function_name          = aws_lambda_function.data_pipeline.function_name
  maximum_retry_attempts = 0
}

# ─── EventBridge Scheduler (cron 22h BRT = 01:00 UTC) ────────────────────────

resource "aws_iam_role" "scheduler" {
  name = "${local.name_prefix}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "scheduler.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "scheduler" {
  name = "${local.name_prefix}-scheduler-policy"
  role = aws_iam_role.scheduler.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "lambda:InvokeFunction"
      Resource = aws_lambda_function.data_pipeline.arn
    }]
  })
}

resource "aws_scheduler_schedule" "daily" {
  name       = "${local.name_prefix}-daily-pipeline"
  group_name = "default"

  # 22h BRT (UTC-3) = 01h UTC do dia seguinte
  schedule_expression          = "cron(0 1 * * ? *)"
  schedule_expression_timezone = "America/Sao_Paulo"

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_lambda_function.data_pipeline.arn
    role_arn = aws_iam_role.scheduler.arn

    retry_policy {
      maximum_retry_attempts = 2
    }
  }
}

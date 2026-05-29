# Backend — Pipeline de Dados

Lambda Python que roda diariamente às **22h (BRT)**, busca resultados na [API Futebol](https://www.api-futebol.com.br/), roda simulação Monte Carlo e publica os JSONs no S3 + CloudFront.

## Estrutura

```
lambdas/data-pipeline/   ← código da Lambda
  handler.py             ← entrypoint
  models/                ← dataclasses (Team, MatchResult, StandingRow…)
  sources/               ← cliente da API Futebol
  compute/               ← standings, Monte Carlo, estatísticas, probabilidades
  upload/                ← serialização JSON + upload S3
  requirements.txt

terraform/               ← infra como código
  main.tf                ← Lambda, S3, CloudFront, EventBridge, IAM
  variables.tf
  outputs.tf             ← cloudfront_url para usar no Vercel
```

## Pré-requisitos

- Python 3.12+
- Terraform 1.6+
- AWS CLI configurado (`aws configure`)
- Conta na [API Futebol](https://www.api-futebol.com.br/) (plano gratuito)

## Deploy

```bash
# 1. Empacotar dependências Python junto ao código
cd lambdas/data-pipeline
pip install -r requirements.txt -t .

# 2. Provisionar infra
cd ../../terraform
terraform init
terraform apply -var="api_futebol_key=SUA_KEY_AQUI"

# 3. Anotar a URL CloudFront do output
terraform output cloudfront_url
# → https://xxxxxxxxxxxx.cloudfront.net
```

## Configurar o Frontend

No painel do Vercel, adicionar variável de ambiente:
```
VITE_DATA_BASE_URL=https://xxxxxxxxxxxx.cloudfront.net
```

Em desenvolvimento local, não definir a variável — o site continuará lendo de `/public/data/`.

## Testar manualmente

```bash
# Invocar a Lambda diretamente
aws lambda invoke \
  --function-name probabilidades-futebol-prod-data-pipeline \
  --payload '{}' \
  response.json && cat response.json

# Verificar JSONs no S3
aws s3 ls s3://probabilidades-futebol-prod-data/brasileirao-a/

# Verificar via CloudFront
curl https://xxxxxxxxxxxx.cloudfront.net/brasileirao-a/probabilities.json | python3 -m json.tool | head -30
```

## Testar localmente (sem AWS)

```bash
cd lambdas/data-pipeline
pip install -r requirements.txt

# Exportar variáveis
export API_FUTEBOL_KEY=SUA_KEY
export S3_BUCKET_NAME=probabilidades-futebol-prod-data
export AWS_DEFAULT_REGION=us-east-1

python handler.py
```

## IDs dos Campeonatos

Confirmar os IDs corretos para a temporada atual no painel da API Futebol.
Atualizar em `terraform/variables.tf`:
- `serie_a_id` (default: 10)
- `serie_b_id` (default: 11)

## Cron

`cron(0 1 * * ? *)` no fuso `America/Sao_Paulo` = **22h BRT todo dia**.

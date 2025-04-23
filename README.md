# Code Review GPT
Добавить в нужный репозиторий экшен

```yaml
name: Code Review GPT

permissions:
  pull-requests: write
  contents: write
  issues: write

on:
# Запуск при любом пулреквесте
  pull_request:
# Запуск при любом коммите
  push:

  # Вызов из другого workflow
  workflow_call:
    inputs:
      target_branch:
        required: false
        default: ""
        type: string
  # Ручной запуск
  workflow_dispatch:
    inputs:
      target_branch:
        description: "Целевая ветка для сравнения (по умолчанию main)"
        required: false
  # Запуск через внешний webhook
  repository_dispatch:
    types: [ run_code_review ]

jobs:
  run_code_review:
    runs-on: self-hosted
    steps:
      - uses: forproxyband/code-review-gpt@main
        with:
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
          github_token: ${{ github.token }}
          target_branch: ${{ github.event.inputs.target_branch }}
          jira_token: ${{ secrets.JIRA_TOKEN_1Y }}
          jira_user: ${{ secrets.JIRA_TOKEN_USER }}
          jira_base_url: ${{ secrets.JIRA_BASE_URL }}

```
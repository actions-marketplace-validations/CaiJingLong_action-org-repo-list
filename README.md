# Auto make organization .github/profile/README.md

The organization profile README.md is used to display the organization profile.

The action will automatically generate the organization profile README.md file based on the organization profile README.md template file.

A example of the organization profile README.md like this: [example](./example.md)

## About action

The action will output the following variables:

- `table`: The organization repositories table markdown.

Next, we can use the `table` variable to do everything.

```yml
name: "Generate fluttercandies profile/README.md"

on:
  schedule:
    # Runs every 30 minutes
    - cron: '0/30 0/1 * * *'
  workflow_dispatch:

env:
  ORG: fluttercandies
  # ORG: flutter-fix-something

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: caijinglong/action-org-repo-list@v1
        id: org_repo_list
        with:
          github-token: ${{ secrets.PERSON_TOKEN }}
          org: ${{ env.ORG }}
          exclude-repo-names: '.github,.github-workflow'
          wrap-with-details: true
      - name: Generate README.md
        env:
          GH_TOKEN: ${{ secrets.PERSON_TOKEN }}
        run: |
          echo "${{ steps.org_repo_list.outputs.table }}" > README.md
          cat README.md
```

## Example

Next is an example of the organization profile README.md template file.

Step1: Create a repository named .github in the organization. If the repository already exists, skip this step.

Step2: Config a workflow file, **DO NOT** use the `.github` repository to do it, I suggest you create a repository named `.github-workflow` in the organization, and config the workflow file in it.

Step3: Config secrets token, the token must have the organization/.github write permission.

Step4: Config the workflow file, the workflow file like [this](.github/workflows/update-org-readme.yml).

## Preview

The example workflow file will run every 30 minutes. See [preview](https://github.com/flutter-fix-something).

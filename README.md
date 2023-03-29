# Auto make organization .github/profile/README.md

The organization profile README.md is used to display the organization profile.

The action will automatically generate the organization profile README.md file based on the organization profile README.md template file.

A example of the organization profile README.md like this: [example](./example.md)

## Configuration

Step1: Create a repository named .github in the organization. If the repository already exists, skip this step.

Step2: Config a workflow file, **DO NOT** use the `.github` repository to do it, I suggest you create a repository named `.github-workflow` in the organization, and config the workflow file in it.

Step3: Config secrets token, the token must have the organization/.github write permission.

Step4: Config the workflow file, the workflow file like this:

```yaml
name: Generate organization profile README.md

on:
  push:
    branches:
      - master
      - main
  schedule:
    # Run at every hour
    - cron: '0 * * * *'
    workflow_dispatch:
    
env:
  ORG: fluttercandies

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: caijinglong/action-org-repo-list@main
        id: org_repo_list
        with:
          github-token: ${{ secrets.PersonToken }}
          org: ${{ env.ORG }}
          exclude-repo-names: '.github,.github-workflow'
      - name: Generate README.md
        env:
          GH_TOKEN: ${{ secrets.PersonToken }}
        run: |
          export table_output=${{ steps.org_repo_list.outputs.table }}
          export TARGET_FILE=/tmp/.github/profile/README.md
          gh repo clone ${{ env.ORG }}/.github /tmp/.github
          cd /tmp/.github
          if [ -f "$TARGET_FILE" ]; then
            rm $TARGET_FILE
          fi
          touch $TARGET_FILE
          echo "## Welcome to the Flutter Candies organization\n" >> $TARGET_FILE
          echo "Custom Flutter Candies (packages) for you to build your Flutter app easily. Enjoy it!\n" >> $TARGET_FILE
          echo "## Organization Repositories\n" >> $TARGET_FILE
          echo "$table_output" >> $TARGET_FILE
          echo "\n" >> $TARGET_FILE
          git add .
          git commit -m "Update profile/README.md from CI"
          git push
```

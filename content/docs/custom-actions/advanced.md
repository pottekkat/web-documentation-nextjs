---
title: Advanced script actions
slug: custom-actions/advanced
description: null
date: 2024-08-12T14:42:34.817Z
lastmod: 2024-08-13T07:50:28.315Z
weight: 500.3
---

# Advanced script actions

In addition to the basic script actions, you can also use more advanced script actions to interact
with the user, ask questions, or execute scripts in bulk.

## Asking questions

In case you need more information from a user to execute a script, you can ask questions using the
`askQuestions` method from the `ContentScript` or `MediaScript` class.

You could for instance use this functionality to ask the user where they want to share an article,
what the width and height of an image should be, or any other question you want to ask.
Here is an example of how you can ask a question:

```javascript {{ "title": "Ask questions" }}
import { ContentScript } from "@frontmatter/extensibility";

(() => {
  const contentScriptArgs = ContentScript.getArguments();
  if (!contentScriptArgs) {
    contentScriptArgs.done(`No arguments found`);
    return;
  }

  // Retrieve the answers from the arguments
  const { answers } = contentScriptArgs;
  if (!answers) {
    // No answers found, ask the user
    ContentScript.askQuestions([{
      name: "platform",
      message: "Where do you want to share the article?",
      options: ["Twitter", "LinkedIn"]
    }]);
    // No further script execution is needed, the user will be prompted with the question
    return;
  }

  // Once the user answered the question, the script will be executed again
  // with the answers provided by the user
  ContentScript.done(`You selected ${answers.platform}`);
})();
```

When you run the script, the user will be prompted with the question "Where do you want to share the
article?" and can select either "Twitter" or "LinkedIn".

![Ask a question via the extensibility library][01]

## Bulk execution

If you want, you can run a script for multiple content files at once. This is useful when you want to
generate a social image for all your markdown files or perform any other bulk operation.

To enable bulk script execution, you need to configure the `frontMatter.custom.scripts` setting for
your project as follows:

```json {{ "title": "Bulk script configuration" }}
{
  "frontMatter.custom.scripts": [
    {
      "title": "Generate social image",
      "script": "./scripts/social-img.js",
      "command": "~/.nvm/versions/node/v16.13.0/bin/node",
      "bulk": true,
      "output": "editor"
    }
  ]
}
```

> **Info**: Since the introduction of the actions bar, you can now also select all items in the current
> view and run content or media scripts for all selected items.

<!-- Link References -->

[01]: /releases/v10.3.0/extensibility-ask-question.webp
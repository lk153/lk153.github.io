---
layout: post
title: "8 Types of Prompt Engineering"
permalink: "type-prompt-engineering.html"
desc: "What’s the Difference Between Supervised, Unsupervised, Semi-Supervised and Reinforcement Learning?"
category: "AI"

---

# 8 Types of Prompt Engineering

```
There are 8 prompt engineering methods:
(1) Zero-Shot Learning
(2) One-Shot Learning
(3) Few-Shot Learning
(4) Chain-of-Thought Prompting
(5) Iterative Prompting
(6) Negative Prompting
(7) Hybrid Prompting
(8) Prompt Chaining
```

Prompt engineering is a technique used to effectively communicate with large language models (LLM) like GPT-3 or GPT-4 and get the desired output. Here there are applications of 8 distinct prompt techniques, find out how we can prompt effectively to learn about Foundation Models.

1. **Zero-Shot Learning**: This involves giving the AI a task without any prior examples. You describe what you want in detail, assuming the AI has no prior knowledge of the task.

`Prompt: “Explain what a large language model is.”`

2. **One-Shot Learning**: You provide one example along with your prompt. This helps the AI understand the context or format you’re expecting.

`Prompt: “A Foundation Model in AI refers to a model like GPT-3, which is trained on a large dataset and can be adapted to various tasks. Explain what BERT is in this context.”`

3. **Few-Shot Learning**: This involves providing a few examples (usually 2–5) to help the AI understand the pattern or style of the response you’re looking for.

`Prompt: “Foundation Models such as GPT-3 are used for Natural Language Processing (NLP), while models like DALL-E are used for image generation. How are Foundation Models used in the field of robotics?”`

4. **Chain-of-Thought Prompting**: Here, you ask the AI to detail its thought process step-by-step. This is particularly useful for complex reasoning tasks.

`Prompt: “Describe the process of developing a Foundation Model in AI, from data collection to model training.”`

5. **Iterative Prompting**: This is a process where you refine your prompt based on the outputs you get, slowly guiding the AI to the desired answer or style of answer.

`Initial Prompt: “Tell me about the latest developments in Foundation Models in AI.”`

`Refined Prompt: “Can you provide more details about these improvements in multi-modal learning within Foundation Models?”`

6. **Negative Prompting**: In this method, you tell the AI what not to do. For instance, you might specify that you don’t want a certain type of content in the response.

`Prompt: “Explain the concept of Foundation Models in AI without mentioning natural language processing or NLP.”`

7. **Hybrid Prompting**: Combining different methods, like few-shot with chain-of-thought, to get more precise or creative outputs.

`Prompt: “Like GPT-3, which is a versatile model used in various language tasks, explain how Foundation Models are applied in other domains of AI, such as computer vision.”`

8. **Prompt Chaining**: Breaking down a complex task into smaller prompts and then chaining the outputs together to form a final response.

`First Prompt: “List some examples of Foundation Models in AI.”`

`Second Prompt: “Choose one of these models and explain its foundational role in AI development.”`

While prompt engineering should be most suitable for interacting with small models, it is also the most difficult task to achieve. Small models like Mistral have the tendency to not follow the prompt. In the example of “Negative Prompting”, GPT 4 manages to follow the instruction, while Mistral failed to complete the task of describing “Foundation Models without mentioning NLP”.
---
layout: post
title: "Go - Best practices for tool dependencies"
permalink: "go-best-practice-tool-deps.html"
desc: "Go modules support developer tools (commands) as dependencies. For example, your project might require a tool to help with code generation, or to lint/vet your code for correctness. Adding developer tool dependencies ensures that all developers use the same version of each tool."

---

# Developer tools as module dependencies

## Introduction

Go modules support developer tools (commands) as dependencies. For example, your project might require a tool to help with code generation, or to lint/vet your code for correctness. Adding developer tool dependencies **ensures that all developers use the same version of each tool**.

This guide shows you how to manage developer tool dependencies with a Go module, specifically the code generator **[stringer](https://pkg.go.dev/golang.org/x/tools/cmd/stringer)**.

## Prerequisites

You should already have completed: [Go Fundamentals](https://play-with-go.dev/go-fundamentals_go119_en/)

This guide is running using:

    $ go version
    go version go1.19.1 linux/amd64

Your project will be a simple command line application that gives advice on what painkillers to take for certain ailments. So let’s name your module accordingly:

    $ mkdir painkiller
    $ cd painkiller
    $ go mod init painkiller
    go: creating new go.mod: module painkiller

Start with a basic version of your application. Given that you are writing a command line application, you need to declare a **main** package; do so in a file named **main.go**:

```go
package main

import "fmt"

type Pill int

const (
	Placebo Pill = iota
	Ibuprofen
)

func main() {
	fmt.Printf("For headaches, take %v\n", Ibuprofen)
}
```
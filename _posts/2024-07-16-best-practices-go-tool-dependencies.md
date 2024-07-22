---
layout: post
title: "Go - Best practices for tool dependencies"
permalink: "go-best-practice-tool-deps.html"
desc: "Go modules support developer tools (commands) as dependencies. For example, your project might require a tool to help with code generation, or to lint/vet your code for correctness. Adding developer tool dependencies ensures that all developers use the same version of each tool."
category: "golang"

---

# Developer tools as module dependencies

## Introduction

Go modules support developer tools (commands) as dependencies. For example, your project might require a tool to help with code generation, or to lint/vet your code for correctness. Adding developer tool dependencies **ensures that all developers use the same version of each tool**.

This guide shows you how to manage developer tool dependencies with a Go module, specifically the code generator **[stringer](https://pkg.go.dev/golang.org/x/tools/cmd/stringer)**.

## Prerequisites

You should already have completed: [Go Fundamentals](https://play-with-go.dev/go-fundamentals_go119_en/)

This guide is running using:

```bash
$ go version
go version go1.19.1 linux/amd64
```

Your project will be a simple command line application that gives advice on what painkillers to take for certain ailments. So let’s name your module accordingly:

```bash
$ mkdir painkiller
$ cd painkiller
$ go mod init painkiller
go: creating new go.mod: module painkiller
```

Start with a basic version of your application. Given that you are writing a command line application that suggest a beverage for your dinner, you need to declare a **main** package; do so in a file named **main.go**:

```go
package main

import "fmt"

type Beverage int

const (
	Lemonade Beverage = iota
	Smoothie
)

func main() {
	fmt.Printf("You could try %v\n", Smoothie)
}
```

This first version of your app provides some suggestion for beverage. Using integer types provides a nice convenient way to define a sequence of constant values. Here you define the type `Beverage`.

Run the program to see its output:

```bash
$ go run .
You could try 1
```

That’s not particularly user friendly. The integer value of your constant is meaningless to your user.
You can improve this by making the `Beverage` type implement the `fmt.Stringer` interface:

```go
type Stringer interface {
	String() string
}
```

The `String()` method defines the “native” format for a value.

Update code to define a `String()` method on `Beverage`

```go
package main

import "fmt"

type Beverage int

func (b Beverage) String() string {
	switch b {
	case Lemonade:
		return "lemonade"
	case Smoothie:
		return "smoothie"
	default:
		panic(fmt.Errorf("unknown Beverage value %v", b))
	}
}

const (
	Lemonade Beverage = iota
	Smoothie
)

func main() {
	fmt.Printf("You could try %v\n", Smoothie)
}
```

Run the program to see the new output:

```bash
$ go run .
You could try smoothie
```

That’s better. But as you can see there is a lot of repetition in your `String()` method. Adding more constants will mean more manual, robotic effort… not to mention being error prone. Can we do better? Enter `stringer`.

`stringer` is a tool to automate the creation of methods that satisfy the `fmt.Stringer` interface. Given the name of an (signed or unsigned) integer type `T` that has constants defined, `stringer` will create a new self-contained Go source file implementing:

```go
func (t T) String() string
```

This sounds much better than maintaining a definition by hand, so let’s add `stringer` as a dependency.

But before you do, remove the hand-written `String()` method:

## Adding tool dependencies
Go modules establishes a convention for tool dependencies. You simply import the command as you would any other package, but do so in a special file that is ignored by any of the `go build` commands. Again, by convention, these imports are declared in a file called `tools.go` at the root of your module:

```go
// +build tools

package tools

import (
	_ "golang.org/x/tools/cmd/stringer"
)
```
In this code you:

- Declare a **build constraint** on the first line of `tools.go`. This tells the `go` command to only consider this file when the `tools` build tag is provided. By convention, `tools` is used as the constraint name.
- Declare that `tools.go` belongs to the `tools` package. Because this file is going to be ignored by `go` build commands, it actually doesn’t matter what package it belongs to. But again, by convention, it is generally considered good practice to use tools as the package name.
- Import `golang.org/x/tools/cmd/stringer`, which declares a dependency relation between your `main` package and `stringer`. But hang on a minute: isn’t `stringer` a command, and therefore a `main` package itself? How does this work? Again, because this file is going to be ignore by `go build` commands the fact that you are importing a `main` package doesn’t actually matter. You are only importing `golang.org/x/tools/cmd/stringer` to declare the dependency on that package. And because you don’t use the imported `golang.org/x/tools/cmd/stringer` package, the blank identifier `_` is used to signal the import exists solely for its side effects, in this case the declaration of the dependency.

With the package dependency declared, you can now add a dependency on the module that contains `golang.org/x/tools/cmd/stringer`. Use `go get` to add a dependency:

```bash
$ go get golang.org/x/tools/cmd/stringer@v0.1.13-0.20220917004541-4d18923f060e
go: downloading golang.org/x/tools v0.1.13-0.20220917004541-4d18923f060e
go: downloading golang.org/x/sys v0.0.0-20220722155257-8c9f86f7a55f
go: downloading golang.org/x/mod v0.6.0-dev.0.20220419223038-86c51ed26bb4
go: added golang.org/x/mod v0.6.0-dev.0.20220419223038-86c51ed26bb4
go: added golang.org/x/sys v0.0.0-20220722155257-8c9f86f7a55f
go: added golang.org/x/tools v0.1.13-0.20220917004541-4d18923f060e
```

You can see your new dependency in the project’s `go.mod` file:

```go
module beverage

go 1.19

require (
	golang.org/x/mod v0.6.0-dev.0.20220419223038-86c51ed26bb4 // indirect
	golang.org/x/sys v0.0.0-20220722155257-8c9f86f7a55f // indirect
	golang.org/x/tools v0.1.13-0.20220917004541-4d18923f060e // indirect
)
```

This guide uses a specific version of `stringer` so as to remain reproducible. In a real-world project you would almost certainly omit the version to get the latest version, or explicitly use the special version `@latest`. Alternatively, you could simply run `go mod tidy` instead of `go get`:

As you can see, `Beverage` must be passed as an argument to the -type flag:

```bash
$ go run golang.org/x/tools/cmd/stringer -type Beverage
```

Listing the directory contents reveals what stringer has generated for us:

```bash
$ ls
go.mod	go.sum	main.go  beverage_string.go  tools.go

```

Examine the contents of the `stringer`-generated file:

```go
// Code generated by "stringer -type Beverage"; DO NOT EDIT.

package main

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[Lemonade-0]
	_ = x[Smoothie-1]
}

const _Beverage_name = "LemonadeSmoothie"

var _Beverage_index = [...]uint8{0, 8, 16}

func (i Beverage) String() string {
	if i < 0 || i >= Beverage(len(_Beverage_index)-1) {
		return "Beverage(" + strconv.FormatInt(int64(i), 10) + ")"
	}
	return _Beverage_name[_Beverage_index[i]:_Beverage_index[i+1]]
}
```
Notice the first line of this generated file is a comment warning you against editing it by hand: **this header is a standard convention of generated files**.

Run your program to verify it behaves as expected:
```bash
$ go run .
You could try Smoothie

```

## Using stringer via a go:generate directive

It is not fair or realistic to expect your fellow developers to remember the command for re-running `stringer`. A more scalable approach is to declare a `go:generate` directive for each code generation step needed for your project:

```go
package main

import "fmt"

//go:generate go run golang.org/x/tools/cmd/stringer -type=Beverage

type Beverage int

const (
	Lemonade Beverage = iota
	Smoothie
)

func main() {
	fmt.Printf("You could try %v\n", Smoothie)
}
```

Now you can re-run all code generation steps (there is currently only one, but still) for current package by running:

```bash
$ go generate .
```

Try this out by extending your program to give another piece of suggestion:

```go
package main

import "fmt"

//go:generate go run golang.org/x/tools/cmd/stringer -type=Beverage

type Beverage int

const (
	Lemonade Beverage = iota
	Smoothie
	Coffee
)

func main() {
    fmt.Printf("You could try %v\n", Smoothie)
    fmt.Printf("You could also try %v\n", Coffee)
}
```

Re-run your code generation steps:

```bash
$ go generate .
```

Finally, check your program’s output:

```bash
$ go run .
You could try Smoothie
You could also try Coffee
```

## Conclusion
That’s it! This guide has shown you how to add tool dependencies to a module, with a focus on the `stringer` code generation tool and its use via `go generate`.
---
layout: post
title: "GOMAXPROCS Insight"
permalink: "gomaxprocs-insight.html"
desc: "GOMAXPROCS sets the maximum number of CPUs that can be executing simultaneously and returns the previous setting. If n < 1, it does not change the current setting."
category: "golang"

---

# 1. Introduction
- It sets how many OS threads (CPU cores) Go can run goroutines on at the same time.
- Default = number of CPU cores on your machine.

***

### Without setting GOMAXPROCS
If you have 8 CPU cores, Go will schedule goroutines across all 8 by default.

Otherwise, the Go runtime selects an appropriate default value from a combination of
- the number of logical CPUs on the machine,
- the process’s CPU affinity mask,
- and, on Linux, the process’s average CPU throughput limit based on cgroup CPU quota, if any.
***


# 2. Usage Examples
### Example

```go
runtime.GOMAXPROCS(1) // use only 1 core
```

👉 Even if you have 8 cores, all goroutines will share just 1 core, running concurrently but not in true parallel.

```go
runtime.GOMAXPROCS(4) // use 4 cores
```

👉 Go can schedule goroutines on 4 different cores simultaneously → parallelism.

***
### Key idea
- **Concurrency** = many tasks in progress (goroutines).
- **Parallelism** = many tasks running at the same time (needs multiple CPU cores).
- **GOMAXPROCS** controls how much parallelism you allow.

✅ You usually don’t need to change it.
Only tweak when:
- Benchmarking parallel vs single-core performance.
- Running in environments with CPU limits (like Docker cgroups).

# 3. Comparation
 
### CPU-Bound
Firstly I define a function as CPU-bound task
```go
func runCPUBoundTask() {
	const iter = 1_000_000
	start := time.Now() // start timer
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go cpuWork(iter, &wg)
	}

	wg.Wait()
	fmt.Println("runCPUBoundTask took:", time.Since(start))
}

// cpuWork runs heavy floating-point work
func cpuWork(iter int, wg *sync.WaitGroup) {
	defer wg.Done()

	sum := 0.0
	for i := 0; i < iter; i++ {
		sum += float64(i) * 0.000001
		if sum > 1e9 {
			sum = 0
		}
	}
	fmt.Println("Result:", sum) // prevent compiler optimization
}
```

then in `main.go` I set `GOMAXPROCS` to `1` first experiment
```go
func main() {
	runtime.GOMAXPROCS(1)
	runCPUBoundTask()
}
```

Then I update `GOMAXPROCS` to `4` & `8`. Each time change `GOMAXPROCS` I run experiment 3 times to get execution times. Then we have a comparasion table as below

|        GOMAXPROCS|       First Time|      Second Times|     Third Times|
|-----------------:|----------------:|-----------------:|---------------:|
|             **1**|     24.215125 ms|      24.308458 ms|    23.794709 ms|
|             **4**|      8.678666 ms|       8.489667 ms|     6.727209 ms|
|             **8**|      5.086542 ms|       5.024125 ms|      5.08575 ms|

### I/O-Bound
Firstly I define a function as I/O-bound task
```go
func runIOBloundTask() {
	start := time.Now() // start timer
	var wg sync.WaitGroup

	for i := 1; i <= 10; i++ {
		wg.Add(1)
		go callAPI(fmt.Sprintf("https://jsonplaceholder.typicode.com/posts/%d", i), &wg)
	}

	wg.Wait()
	fmt.Println("runIOBoundTask took:", time.Since(start))
}

func callAPI(url string, wg *sync.WaitGroup) {
	defer wg.Done()

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Request to %s failed: %v\n", url, err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Printf("Response from %s:\n%s\n\n", url, string(body)[:100]) // Print first 100 chars
}
```

then in `main.go` I set `GOMAXPROCS` to `1` first experiment
```go
func main() {
	runtime.GOMAXPROCS(1)
	runIOBloundTask()
}
```

Then I update `GOMAXPROCS` to `4` & `8`. Each time change `GOMAXPROCS` I run experiment 3 times to get execution times. Then we have a comparasion table as below

|        GOMAXPROCS|       First Time|      Second Times|     Third Times|
|-----------------:|----------------:|-----------------:|---------------:|
|             **1**|    122.841417 ms|      123.66525 ms|   123.409875 ms|
|             **4**|     128.13425 ms|       118.5735 ms|   130.491875 ms|
|             **8**|    137.731375 ms|        126.189 ms|     130.6665 ms|


# 4. Conclusion
### I/O-bound Example (API calls)
Here’s 3 goroutines (G1, G2, G3) making HTTP requests when `GOMAXPROCS=1`
```perl
Time → ─────────────────────────────────────────────────────────>

G1: |Send Req|====WAIT====|Process Resp|
G2:           |Send Req|====WAIT====|Process Resp|
G3:                     |Send Req|====WAIT====|Process Resp|
```
- `|Send Req|` and `|Process Resp|` → short CPU bursts

- `====WAIT====` → blocked on network (no CPU needed)
👉 Even with 1 CPU, while G1 is waiting, CPU is free for G2/G3 to run.
So they overlap nicely.
⏱️ Total time ≈ time of the slowest request.

### CPU-bound Example (heavy computation)
Now, if each goroutine runs a big computation loop (no I/O):

#### With `GOMAXPROCS=1`
```less
Time → ─────────────────────────────────────────────────────────>

G1: [Compute...............]
G2:                        [Compute...............]
G3:                                             [Compute...............]
```
- Each goroutine hogs the only CPU, so they run one after the other.
- ⏱️ Total time ≈ sum of all workloads.

#### With `GOMAXPROCS=3` (3 CPUs available)
```less
Time → ─────────────────────────────────────────────────────────>

CPU1: [Compute...............] (G1)
CPU2: [Compute...............] (G2)
CPU3: [Compute...............] (G3)
```
- All goroutines run at the same time on different CPUs.
- ⏱️ Total time ≈ one goroutine’s workload.
- Huge speedup.

✅ So the big insight is:
- **I/O-bound tasks** overlap well even on 1 CPU, because goroutines are paused while waiting.
- **CPU-bound tasks** need multiple CPUs to run in true parallel, otherwise they serialize.
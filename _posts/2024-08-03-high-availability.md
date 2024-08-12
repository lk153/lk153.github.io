---
layout: post
title: "High Availability"
permalink: "high-availability.html"
desc: "What is high availability? High availability means that we eliminate single points of failure so that should one of those components go down, the application or system can continue running as intended."
category: "system-characteristic"

---

# Real life related issue

Picture your city’s power grid. It supplies electricity to all of the homes and businesses in the area, making it essential for every single person. Now, imagine that a transformer in one neighborhood experiences a fault and temporarily goes offline. Ideally, the power grid can reroute electricity from other sources to compensate for the fault. This ensures that all homes and businesses continue to receive electricity without prolonged disruptions.

This analogy helps us understand the concept of high availability (HA) and why it's so important in keeping a system or application running smoothly.

# The definition of high availability

What is high availability? High availability means that we eliminate single points of failure so that should one of those components go down, the application or system can continue running as intended.

In other words, there will be minimal system downtime — or, in a perfect world, zero downtime — as a result of that failure.

In fact, this concept is often expressed using a standard known as "five nines," meaning that 99.999% of the time, systems work as expected.

However, it’s worth noting some companies may have different availability targets, such as four nines (99.99%), three nines (99.9%), and two nines (99%). These tiers represent varying levels of availability commitment.

**Percentage calculation**

| Availability % | Downtime per year | Downtime per quarter | Downtime per month | Downtime per week | Downtime per day (24 hours) |
| -------- | ------- | ------- | ------- | ------- | ------- |
| 90% ("one nine") | 36.53 days | 9.13 days | 73.05 hours | 16.80 hours | 2.40 hours |
| 99% ("two nines") | 3.65 days | 21.9 hours | 7.31 hours | 1.68 hours | 14.40 minutes |
| 99.9% ("three nines") | 8.77 hours | 2.19 hours | 43.83 minutes | 10.08 minutes | 1.44 minutes |
| 99.99% ("four nines")	| 52.60 minutes | 13.15 minutes | 4.38 minutes | 1.01 minutes | 8.64 seconds |
| 99.999% ("five nines") | 5.26 minutes | 1.31 minutes | 26.30 seconds | 6.05 seconds | 864.00 milliseconds |
| 99.9999% ("six nines") | 31.56 seconds | 7.89 seconds | 2.63 seconds | 604.80 milliseconds | 86.40 milliseconds |
| 99.99999% ("seven nines") | 3.16 seconds | 0.79 seconds | 262.98 milliseconds | 60.48 milliseconds | 8.64 milliseconds |
| 99.999999% ("eight nines") | 315.58 milliseconds | 78.89 milliseconds  | 26.30 milliseconds | 6.05 milliseconds | 864.00 microseconds |
| 99.9999999% ("nine nines") | 31.56 milliseconds | 7.89 milliseconds | 2.63 milliseconds | 604.80 microseconds | 86.40 microseconds |

**How to measure high availability**

If you intend to maintain high availability 99.999% of the time, 24/7/365, that would mean a maximum of 5.256 minutes of yearly downtime.

This is how we got here:

```
- There are 60 minutes/hour x 24 hours/day x 365 days/year = 525,600 minutes/year
- 99.999% = 0.99999
- 0.99999 x 525,600 minutes = 525,594.744 minutes
- 525,600 minutes - 525,594.744 minutes = 5.256 minutes
```

## What you need to make it a reality

Two important aspects of high availability are (1) a **data failover system** and (2) **data backup**. To achieve high availability, the system has to have a way to maintain its functionality.

*In the example we provided earlier, the single point of failure is the transformer that went down. The city (hopefully) prepared for this with another transformer that can seamlessly pick up the slack.*

*Other examples of single points of failure that you might be able to relate to include routine server maintenance, network failure, hardware failure, software failure, and even power outages caused by natural disasters.*

All of these can lead to service disruption and hamper a system's performance, sometimes significantly.

## What about high-availability clusters?

Which are groups of servers that work together as one system. While these servers share storage, they're on different networks. High-availability clusters have **failover** capabilities, which means that if one of the servers goes down, there's a backup component that can take its place.

## Fault tolerance

When people talk about high availability, you might also hear *Fault Tolerance* used interchangeably. Essentially, they refer to the same concept.

Fault tolerance means that if one or more components within a system fail, there's a backup component ready to automatically take over, ensuring the system can **maintain continuous availability**, keeping users' access steady without interruption.

The backup components in a fault-tolerant system can include alternatives such as hardware, software, or power sources.

![Fault tolerance](/assets/img/high-availability.avif "High Availability")

# Why is high availability important?

Because this ensures that systems are able to operate continuously for the end user without disruption. It's part of a company's greater *disaster recovery protocol*, which defines exactly how they plan to **minimize downtime** and **loss** in the event of significant downtime.

In fact, having high availability should mean that you're able to avoid downtime almost completely and, thus, the need for disaster recovery.

"Well, all systems experience downtime at some point, right?" Maybe, but the point is that some companies simply can't allow this to happen.

High availability extends beyond **providing a positive user experience**, **preventing productivity losses** and **safeguarding a brand’s reputation**. It is a critical safeguard against potential disasters.

## Examples of high-availability systems

Imagine using the self-driving mode in an electric car, and due to a single point of failure, the entire system shuts down. In other words, the car — which was previously doing 80mph down the expressway — suddenly loses all control. Would you want to be sharing the road with that driver or be behind the wheel yourself?

This might seem like an extreme example (although it's completely feasible). However, some industries rely on high-availability systems to keep their data — and the people it belongs to — safe.

Think of electronic health records (EHRs) — real-time, digitized charts containing all of the information about a patient that their healthcare providers want to keep track of. We're talking about their diagnoses, medical history, prescriptions, vaccinations, you name it.

If those EHRs aren't built on high-availability architecture, and there's some sort of system failure, we might be looking at *massive data loss at best*, and *at worst, the exposure of that very sensitive data*. This underscores the critical importance of working with high-availability infrastructure to maintain the **integrity** and **security** of vital data.

# How high availability works

In reality, no system can achieve 100% availability at all times. However, to achieve the rule of five nines and build an HA system, there are four key pillars of high availability that we must make a priority.

## 1. Eliminating single points of failure

Eliminating single points of failure is key in a high-availability system. Without this safeguard, if everything was running on one server, and that server failed, the whole system would go down.

## 2. Implementing reliable redundancy

“Redundancy" means having backup components within the HA system. If the original component fails, its "twin" can take over for it, helping to minimize downtime caused by the failure and maintain high availability.

## 3. Facilitating system failure detection

In the event of a component failure within the primary system, there should be clear protocols in place so that (1) **the failure is obvious and documented** and (2) ideally, the component can **resolve the issue on its own**. This is an important part of disaster recovery.

## 4. Achieving load balancing

Load balancing means that workloads — like network traffic — are distributed across multiple systems or servers in an efficient manner. With load balancing, no one resource or server will become overwhelmed with its workload, and high availability becomes more feasible.

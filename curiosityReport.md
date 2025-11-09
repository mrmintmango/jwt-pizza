# Curiosity Report

For my curiosity report I wanted to find better ways to go about coding. I currently
write my code in a Feature Driven Development style because that's what I'm doing at my job. That 
being said, I've recognized the error in my ways (mainly a large lack of security) and wanted to 
shift gears to something aligned with what I'm learning in QA and DEVOPs. We recently hired a new
software architect at my job and he is a powerhouse for automation and testing. The first thing he
did was setup a software to track analytics because we didn't have one beforehand. That, plus 
the things I've been learning about metrics, have influenced the development style I chose. 
I looked into TDD and others, but have decided to focus this report on 
Obervability Driven Development. 

### Summary

### Learned

* What it is: ODD is all about embedding observability directly into the software development process
* Observability: the ability to understand a system's internal state by examning its external outputs
* Telemetry: the process of collecting, transmitting, and analyzing data to understand the behavior of a system
** Types of telemetry include: Logs, Metrics, Traces

Learning this was actually pretty interesting to me because during deliverable 8, I was confused
why we setup an open telemetry url, but recorded metrics through Prometheus in Grafana. This is becaues
telemetry is just the process of collecting data, and Metrics is a type of data collected, namelt numeric 
measurements of things over time. Logs are text-based records of events and Traces are End-to-end records
of requests across services. These different types have different tools specialized in recording them:
Logstash, Prometheus, OpenTelemetry are just a few. 

### Process

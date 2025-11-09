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

In summary, I've learned about the DEVOPs practice of ODD and how it's useful in increasing software reliability throughout development. By incorporating metrics, logs, and traces early on and throughout the dev process, the developer has a better understanding of how his system fucntions, and how each endpoint and call interacts with each other. Setting up vizuals also provides a faster method of finding weaknesses then standard testing (althuogh ODD does have it's own set of tests). ODD helps developers vizualize in realtime their systems functionality and helps them increase software reliability before it hits production.  

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

A big benefit of ODD is the real-time insight it provides on current software functionality. For example, collecting metrics and traces from a live application is great, and if something goes wrong then it shows you. With ODD, the development team will have a live feed of how well their next version is performing before it's ever released to production, meaning they can improve functionality easier and before the software gets released to the public. 

Some other benefits I've found are ODDs ability to help predict anomalies. I didn't fully understand this one, but by using AI algorithms with the metrics gathered during development, developers can identify patterns of abnormal behavior and predict future occurrences, thus increasing the software's reliability. ODD also helps with Load balancing and capacity planning. 

A big part of ODD is traced-based testing. Apparently by implementing trace tracking in the development environment, the developer gains a better understanding of where a request travels to throughout the system. Being able to trace an HTTP API call for example, throughout the system helps ensure the software is working correctly and can even help the developer find areas of improvement. 

I thought trace-based testing was cool so I digged a bit deeper (it's still a part of ODD so it's okay). Using a tracing solution (the tool that collects traces) like Jaeger, or Grafana Tempo, the developer can define a test trigger. When executed that trigger will flow throughout it's defined course, and the chosen solution will collect the entire trace and provide a visual representation of the execution path. You can then add assertions just like regular tests that validate whichever assumptions you had about where the trigger should have gone. Just like what we did with our Jest tests, you can then add the Trace tests to a CI/CD pipeline to solidify it as part of production! 

### Process

It seems like there are many ways to begin using ODD, but I've found that most are almost the same, the only differences being the tools used to do it. It's interesting how the major steps are the same steps we're doing for the JWT Pizza application, but focusing first on metrics rather then the other types of tests we did for class. 

First Step: Instrument the distributed system with OpenTelemetry or any other tool used to gather data.
* The three pillars of ODD are Metrics, Logs, and Traces. So as long as the tool you decide to use can gather all three, then you're good.

Second: Simulate load (also with whatever tool you'd like)
* This can be done with Curl commands or other software like k6.
* Once your beginning stages of development are recieving load and your succsefuly tracking data, make sure to be consistent with implementing tracking points throuhgout your system as you develope further.
* Each new feature / major trigger should have a helpful visualization so the dev team knows how everything is doing.

Third: run chaos testing / load testing
* Seeing how your software keeps up with technologically stressful situations during all phases of development help ensure it's a reliable build.
* Doing this often helps developers see what can be improved as they build the system instead of waiting for a big finishing milestone the then go back and fix faulty areas.

Fourth: Correlate data to analyze weeaknesses. 
* Some good tools for this are Loki and Tempo
* The key point here is to actually learn from the data you're recieving. Fancy lines and numbers are fun to look at, I'll agree, but being able to read the numbers and realize potential for improvement from them are more important.
* This is also a good spot to use AI or something else to search for anomolies that need to be patched, or simply to re-evaluate the teams work and find general areas for improvement. 

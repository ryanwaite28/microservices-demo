# MicroServices Demo


Hello World! This is my example of implementing a micro-services web application architecture to demonstrate my understanding of it. 
I will also speak on my advices on implementation and theory/philosophy behind it (not intended for every use-case, just common ones).

## Tech Stack

* NodeJS (MicroServices)
* ExpressJS (API Gateway)
* Rabbit MQ (Message Broker)
* Socket.IO (Used on API Gateway)
* Docker & Docker Compose (Containers ready for cloud deployment)
  

## Intro/Background

As we all or most know, Backend web applications were written as a **<a href="https://microservices.io/patterns/monolithic.html">Monolith</a>**: everything that the application needed to do was a part of a single running server/applicatio instance. This included connections to databases, managing file uploads, potentially serving html for a front end, processing payments, everything, all in one app/server instance. The pros is it's easy and simplicity in developing, testing and deploying; it's just one codebase. The cons on the other hand can be very drastic, such as growing to large, the entire app failing just because of a small aspect, being tied to a particlar programming language/tech stack, hard to refactor, etc. Here are the links where i learned more about monoliths:
* https://microservices.io/patterns/monolithic.html
* https://www.atlassian.com/microservices/microservices-architecture/microservices-vs-monolith#:~:text=A%20monolithic%20architecture%20is%20a%20singular%2C%20large%20computing%20network%20with,of%20the%20service%2Dside%20interface.

Now, most web application architectures are implementing the **<a href="https://microservices.io/index.html">Microservice</a>** design pattern. The real only difference is: instead of everything being managed and handle in a single app server instance, just split the features/functionalities into separate app server instances. That is the main gist of it. The only real challenge now is how to sync all of the separately running app instances, which isn't too hard to do.


## NodeJS
I've decided to use TypeScript because it was the first language i ever used but more importantly, it handles basic I/O operations fantastically because it is async in nature, which is exactly what is needed for the Microservice architecture. Mainly as an API Gateway; any service dealing with heavy CPU processing should use a multi-threaded language like Java. But for simply serving results from database, NodeJS will do just fine.



## ExpressJS
As an API Gateway, ExpressJS is perfect. Upon receiving a request, the gateway will simply emit a message event for some microservice to take action, passing along a request id (or something unique) that the microservice can take and use to track the status of that request.

## Rabbit MQ
This is a simple message broker for routing message events to message queues that other microservices can listen to for events. Once the microservice finishes processing, it can publish the results as an event that other microservices (or even gateways) can listen to.

## Socket.IO
For users/clients, they initiate some action over HTTP (the conventional way); they don't interact with microservices directly. Because of that, by HTTP design, every client request must wait for a response. This does not really fit well with the async approach of microservices: who knows how long some request can take. For that reason, the gateway can (and arguably) respond with a **pending** state to their request: it still satisfies the design of HTTP requiring a response while letting the client know that the request is still in the works.

This is where socket.IO comes in. Users can keep an open connection to the server to listen to event, like the results of a request that made. Socket.IO isn't *necessary* per se, using the standard SSE (server-sent-events) approach works fine. The main thing here is being able to reach the client when needed.

## Docker

By designing an application architecture with docker, it makes it almost trivial to deploy locally developed to other environments, like cloud environments.


## Running the demo

Normally, you would not include sensitive info in a github repo, like a .env file that contains database connection strings or API keys. I am doing it here because this is just a demo (no sensitive info) and to show a complete example on how to get started with a microservice architecture.



## Getting the demo up and running

Because this is a demo, i made it easy to start this example.
1. clone this repo
2. in the root of this folder, run this command:
```
docker-compose up --remove-orphans --force-recreate --build
```
3. open browser to <a href="http://localhost:300/users">http://localhost:300/users</a>
4. in the dev tools console, run this to create a user: 
```typescript
fetch(`http://localhost:3000/users`, {
  credentials: 'include', 
  method: `POST`, 
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify({ username: 'joe.doe' }) 
}).then(r => r.json())
.then(console.log);
```
5. refresh the page, you should see a new user object

To clean up after running:
1. run this command. NOTE that this will delete other containers, images, etc:
```
docker-compose down --rmi all --remove-orphans --volumes
```

## My Take

I actually really like microservices. Here are a few opinions i have:

<br/>  
<blockquote>
  Every microservice should have its own database.
</blockquote>
<br/>

I agree with that completely. How can a service be autonomous and isolated/standalone if it has any dependency on any other service? Some may worry about data duplication; i do not think that is much of an issue because data is cheap and if the entire system is architeched correctly, that could be a benefit. I don't see the issue with user data existing in multiple databases, especially if it is managed correctly.
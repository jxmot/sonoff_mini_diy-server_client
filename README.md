# sonoff_mini_diy-server_client

**WORK IN PROGRESS: As of 2020-09-04 the application(s) in this repo are functional. However work is still going on and there are likely to be changes. This message will be removed after the WIP phase is complete.**


For use with a Sonoff Mini in DIY mode. This repo contains a Node app and a web client. 

## Sonoff Mini

I recently purchased a [Sonoff Mini](https://www.itead.cc/sonoff-mini.html) to control an outdoor flood light  with a PIR sensor that doesn't have a swtich. I chose the Mini because of it's physical size, available 3rd party firmware, uses an ESP82?? chip, and that it has a *DIY mode* where it **does not require any external cloud or service**.

## The Problem(s)

There were some problems getting the Mini set up correctly. For example, once you've got it DIY mode *and* it's running the access point there is a limited amount of time before the Mini will reset and turn off the access point. So attempting the set up via a phone or tablet is cumbersome, but on a PC or laptop it's a lot easier.

The **biggest** problem was encountered while trying to create a simple web page that would communicate *directly* with the Mini. Simply put, it's not going to happen! 

And the reason is simple. The web server that runs on the Mini does not provide the appropriate HTTP header. There's a thing called **CORS**. Basically is a security rule built into all browsers that prohibits the browser from getting the page from one server and *resources* from a completely different server. For example, the host for the web page is one server and the Mini is the other server.

I tried a number of solutions that failed. Including an attempt at wrapping the Mini API calls in PHP endpoints on the web server. But the solution that does work for me is here in this repository, hopefully it will work for you to!

## The Solution(s)

The CORS solution was a bit more involved than I wanted. But it wasn't too bad, the total size of all the code is less than 10k. And putting it together wasn't difficult. 

**Features :**
* Very small footprint - < 10k for server and client
* No third party Node packages
* The client is just basic HTML/CSS/JavaScript and some jQuery
* The client is mobile friendly

### Architecture

#### Node Application

#### Web Client




## To Do

* Add a "timed off" feature. This would allow the Mini to be turned off for a preset amount of time. Since I use this with an outdoor PIR controlled light it's likely that I don't want the Mini to be left off.
* Display a spinner while waiting for the Mini respond, after a timeout cancel the request and refresh with a new `/info` call.
* Display the Mini's WiFi signal strength, may aid in trouble shooting potential connection issues.
* **Alexa** - modify the Node application so that Alexa can be used to operate it.



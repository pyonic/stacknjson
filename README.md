# In memory DB

Some global object is used by Express.

**In-memory stack (LIFO):**
Implemented as json, where the key is the ip address and the value is the stack. IP address - in order for each user to have their own stack and not mix with other people's stacks.

**In-memory key-value store with TTL:**
Also implemented as **{ip: data}** where **data** is a json object of type {key1: {value, ttl}, key2: {value2, ttl2}}.
There is no TTL by default, but when it is passed in the request body, via the ttl field, an asynchronous code is sent to the background via setTimeout which will delete the key data after a specified time.

Autotests were written using Jest and Supertest.

Install dependencies: **_npm install_**

Run: **_npm run start_**

Run tests: **_npm run test_**

Since the functionality is simple, I didn’t do much to destructure the project into controllers, models, etc...

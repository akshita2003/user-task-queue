Overview

This project implements a Node.js API with rate limiting and task queuing. The API handles tasks with specific rate limits per user ID and processes tasks according to the defined limits. It includes a queueing system to manage tasks when the rate limit is exceeded and logs task completions to a file.

Requirements

->Node.js (v14 or later)
->Redis (for queue management)
->Postman (for testing)

Setup and Installation

1.congigure redis
open docker in your system and run the following commands in your project terminal:
1.docker pull redis
2.docker run --name my-redis -p 6379:6379 -d redis
noe run
node index.js

now test the application on postman

Testing with Postman
1. Open Postman
Launch Postman.

2. Create a New Request
Click New and select Request.
Name your request (e.g., Submit Task) and save it to a collection.

3. Configure the Request
Set Method to POST.
Enter URL: http://localhost:3000/task.

Set Body:
Choose raw and select JSON format.
Enter the request body, e.g.:
json
Copy code
{
  "user_id": "123"
}

4. Test Rate Limiting and Queuing
Send Requests:

Use the Send button to send a request.
Send multiple requests quickly to test rate limiting and queuing.
Verify responses for rate limit errors (e.g., status code 429) and check if requests are processed according to the limits.
Verify Logs:

Check the task_logs.txt file for task completion logs.
Ensure the logs contain the user_id and timestamp as expected.

5. Using Collection Runner (Optional)
Create a Collection:

Save your request to a collection.
Run the Collection:

Click on the collection name.
Click Run to open the Collection Runner.
Set the number of iterations and optionally use a data file to simulate multiple user IDs.
Click Run and monitor the results.
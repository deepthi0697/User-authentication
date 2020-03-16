const jwt = require('jsonwebtoken')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTQ4MjAyMmY0MDRjMDExZWM1ZmJlZjkiLCJjcmVhdGVkQXQiOjE1ODE3ODUxNDY0ODIsImlhdCI6MTU4MTc4NTE0Nn0.eh5UuBZRCQnglk4sjWR1LBOoV_5E0txWwwyLpLYDD78'

console.log(jwt.verify(token, 'jwt@123'))
This is a social network.
that is being designed to connect techies from all around the world.
It is MERN app.
It comprises of 2 stages

Stage 1[Backend]-

We will call api's
We will use postman to hit the endpoint
We will use mongoose to interact with the database
we will deal with NODE EXPRESS

Stage 2[FRONTEND]-

We will use redux for state management
Tools needed -
Redux devtools
React developer tools
Bracket pair colorizer
Prettier
Gitbash VsCode
Install mongoose

NPM express - validator
bcryptJs[for password encryption]
JSON webtoken[token for validation]
Nodemon[constantly watch server without us refreshing]
Create user.model
Send name, email, password to register the user -
Init middleware -> App.use();
Handle validation and responses if the user does not sand the right stuff ->
express validator
Install validator
Note -> there is no check middleware in the Documentation so express-validator/"checks"
"checks" might not work because it is not part of the documentation requirement but you still use it
res.send(400) -> 400 to show that something is wrong
(200) -> 200 to show everything is ok

to Register user -

- See if user exists
- Get users gravatar
- Encrypt password
- Return jsonwebtoken
  For encrypting password, create a salt to do the hashing with-
  await bcrypt.gensalt(10)-10 is the default
  await bcrypt.hash(password, salt)

To make sure that there is not an existing user -
Let user = await User.findOne({ email});
If there is not an existing user-
user = new User({
name,
email,
avatar,
password
});

use " await user.save(); " to save to MongoDB ATLAS
Install jsonwebtoken
Const jwt = require('jsonwebtoken')
Create middleware folder-
auth.js
reequire jsonwebtoken
require config
module.export = function(){}

Inside the func-
Get token from header
Check if no token
Verify token

Authenticate user & token
-Make sure email exists
-Make sure password matches
-Use same error messages for both to prevent security risks/leaks

Create the profile model
Create the ProfileSchema = new mongoose.Schema
Include-
user, company, website, location, status, skills, bio, githubusername
Experiences - title, company, location, from, to, current, description
Education- title, company, location, from, to, current, description
Socials- youtube, x, facebook, linkedin, instagram
Date
Access the routes/api/profile/ and import both profile and user model
Create & Update profile routes
router.post('/', auth, [], async(req, res) =>{});
Build proffile object
Build social object

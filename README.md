# CSC337FinalProject

This project uses node.js and express.js.
To run it, both need to be installed.
This also uses MongoDB for databases and that needs to be installed.
Ensure that MongoDB is running and the proper address is entered into line #7 of server.js.
Currently, it is set to run on localhost.

The home page will just be localhost:8080/. From there, you have the option
to browse guitars and add guitars to cart. When you check out, you will need to add 
shipping information. The order will be added to the queue but none of the info will be
saved after the order is fulfilled. 

If you click on login/sign up, it will bring you to a login page. There is a link under
the form to take you to a sign up page if you don't have an account. For this section,
we'll select user for the sign up option which will create a user account. Once you are logged in,
you can browse and buy the same way as if you were not logged in but you now have the option
of seeing account details. On that page, you can view your details and add shippping info. The server
will remember it and automatically fill it in when you go to order your guitars. You can also view
previous orders ascociated with your account and reorder them in case there was a guitar you liked
so much that you need a second one.

If we create an admin account, 

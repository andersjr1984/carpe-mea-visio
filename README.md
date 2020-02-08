# Carpe Mea Visio

I have spent countless hours working on this project in order to help me get a job. Well, I now have a job and am releasing this project to the world to see what kind of monster you can create.

This is a project with lots of awesome things! It includes:
- Firebase Functions, Firestore, Extensions, and Hosting
- React Hooks and Code Splitting
- React Router
- HTML5 Image Resizing (client-side image resizing is the best)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To get this project started, do the following:
- Install the [Firebase CLI](https://firebase.google.com/docs/cli) on your machine
- Install all front-end dependencies `npm install`
- Install all functional dependencies: `cd functions; npm install;`
- Create a Firebase account and new project. Once you get to the page with your new projects Keys, Domains, URLs, etc, stay there. You will need this information for your .env file
- Create a .env file in your projects directory: `touch .env`
- Add the following Firebase keys to your .env file
```
REACT_APP_FB_KEY=''
REACT_APP_FB_DOMAIN=''
REACT_APP_FB_DB_URL=''
REACT_APP_FB_PID=''
REACT_APP_FB_STORAGEBUCKET=''
REACT_APP_FB_MESSAGING_ID=''
REACT_APP_FB_APP_ID=''
REACT_APP_FB_MEASUREMENT_ID=''
```  
- Once all this information is set up, go into your Firebase app and set up Auth, with providers, Firestore, Functions, and the email extension.
- Update the package.json file with your information
- Deploy your functions using the custom script `npm run deploy-functions`
- Start the app with `npm start`

Then you can play around to your hearts content to improve this general to-do app!

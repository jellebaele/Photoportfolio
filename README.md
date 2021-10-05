# Photoportfolio

## General info

Website to store and display images. A REST API is implemented to handle incoming calls. The stack used is nodejs with express.js, mongodb as database and EJS as template engine. No additional framework such as e.g. React on the client side is used except for '' to animate pages. In the backend to store images, Multer is used. Upon upload, these images are resized with Sharp. 

## Features

* Loading animations
* Popups
* Upload, adjust and delete images
* Create, delete, change categories
* Responsive design
* Authorization

## Progress
 * [ ] Basic backend implementation
    * [x] Upload images using Multer
    * [x] Resize images using Sharp
    * [x] GET, POST, DELETE, PATCH images
    * [x] GET, POST, DELETE, PATCH categories
    * [ ] Authorization using OAuth
 * [ ] Client side basic implementation
    * [x] Home page with overview of different categories
    * [x] Loading animation
    * [ ] Animated landing page
    * [x] Generic modal
    * [x] Generic alert
    * [ ] Implement predefined categories
    * [ ] Carousel
    * [ ] Drag and drop images to change their order
 
 * [ ] CI/CD Heroku
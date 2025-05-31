import * as Carousel from "./Carousel.js";

// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");

// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "";

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */


let breeds = []; // so i can access in both blocks
async function initialLoad() {
 // replaced using axios default. 
 axios.defaults.headers.common["x-api-key"] = "live_jIVoInXIA85XRcKWHBjfLtSNz7Yca26ZkJBLt4AZCrE2i7eBn9BdJOfgbxlOwDE5";// should set the headers globally. had to sign up for key ...
 axios.defaults.headers.common["Content-Type"] = "application/json";

//console.log(progressBar)
axios.interceptors.request.use(function(config){// from axios documentation 
progressBar.style.width = "0%"
document.body.style.cursor = "progress" // gives me a spinning wheel 
 config.startTime = Date.now(); // creating a new key value pair in config that stores the start time  
 console.log(`The requests begin at ${config.startTime}.`)
  return config;

});

axios.interceptors.response.use(function (response){
const timeTaken = Date.now() - response.config.startTime // gives the time it took
document.body.style.cursor = "default "
console.log(`The time taken was ${timeTaken}`)
  return response;
})

  // var requestOptions = {
  //   //
  //   method: "GET",      no longer needed because axios should handle this ...?
  //   headers: headers,
  //   // redirect: "follow",
  // };

  let res = await axios.get("https://api.thecatapi.com/v1/breeds?limit=10&page=0"); //axios get
  breeds = res.data;// axios converts to json automatically 

 
  for (let cat of breeds) {
    let breedsOptionEl = document.createElement("option");
    breedsOptionEl.textContent = cat.name;
    breedsOptionEl.value = cat.id; // value attribute equal to the id of the breed
    breedSelect.appendChild(breedsOptionEl);
  }
}

initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

breedSelect.addEventListener("change", () => {

  // need to access breedSelect.value. change is for when the value of a form element changes
  // console.log(breedSelect.value); // value returned after breed chosen.
  let chosenId = breedSelect.value; // grabs the id from the block above

  async function getImages() {
    let res = await axios.get("https://api.thecatapi.com/v1/images/search?limit=10",{ 
   onDownloadProgress:updateProgress // took me a  LONG time to see, but this is object syntax so it has to be in curly braces.
    }); // from documentation on how to filter by breed.
    let images = res.data; 
 

    let carouselContainer = document.querySelector("#carouselExampleControls .carousel-inner");// reloads the images by clearing out inner html.
  carouselContainer.innerHTML = ""; // This removes all previous images

    for (let image of images) {
      let imgDisplay = Carousel.createCarouselItem(
        image.url,
        image.id,
        image.id
      );
      Carousel.appendCarousel(imgDisplay);
     
      let selectedBreed = Array.from(breedSelect.options).find(
        (option) => option.value === chosenId
      ); 
    }
  }

   getImages(); //  returns id of the selected breed. 

  //infoDump step for 2:
  let selectedBreed = breeds.find((breed) => breed.id === chosenId); 
  if (selectedBreed) {
    let infoSection = document.getElementById("infoDump");
    infoSection.textContent = "";
    
    infoSection.textContent = `Cat: ${selectedBreed.name}. ${selectedBreed.description} They are  ${selectedBreed.temperament}`;
  }

});
function updateProgress(ProgressEvent){

console.log(ProgressEvent.loaded) // returns an object will need to access the progress.
ProgressEvent.total = 1000 // this is a placeholder because its actually undefined.
let percentage = Math.floor((ProgressEvent.loaded / ProgressEvent.total)* 100)
console.log(percentage)// is a whole number now
progressBar.style.width = percentage + "%" //ok ...
}



/** 
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."                     "done?"  made new folder 
 */ 
/**
 * 4. Change all of your fetch() functions to axios!                                               done 
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.             done 
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.    // I definetly referenced the lesson material and axios documentation
 */

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.                    done 
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.                                            done...
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  const response = await axios.post("https://api.thecatapi.com/v1/favourites",{
image_id: imgId, });
console.log(response)
console.log(`${imgId} added to favorites!`)

 const response1 = await axios.get("https://api.thecatapi.com/v1/favourites", { //gets all the favorites( has a long history)
  });

console.log(response1)
console.log(response1.data)
response1.data.forEach((item, index)=>{
  console.log(`${index} ${item.image_id}`); //goes through all the favorites 
})

let favorited =  response1.data.filter(item => item.image_id === imgId )//  matches the image ids from inages to the ids stored.
if (favorited){// if they match up 
await axios.delete("https://api.thecatapi.com/v1/favourites/${favorited.id}")// tried this lind of like how i do in file explorer.
console.log("image deleted")
}
}// this doesnt  seem to work at all ...

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

getFavouritesBtn.addEventListener("click",getFavorites); // yes i reused code 
export async function getFavorites(){
let carouselContainer = document.querySelector("#carouselExampleControls .carousel-inner");// reloads the images by clearing out inner html.
const getAll = await axios.get("https://api.thecatapi.com/v1/favourites")
carouselContainer.innerHTML = ""; // This removes all previous images
console.log(getAll)
for (let image of getAll.data) {
      let imgDisplay = Carousel.createCarouselItem(
        image.image.url,
        image.id,
        image.id
      );
      Carousel.appendCarousel(imgDisplay);
}

}
  


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */

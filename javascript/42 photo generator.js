const imageWrapper = document.querySelector(".images");
const loadbut = document.querySelector(".load-more");
const searchInput = document.querySelector(".input-text");
const lightBox = document.querySelector(".lightbox");
const closeButton = document.querySelector(".fa-circle-xmark");
const downloadButton=document.querySelector(".fa-cloud-arrow-down");
const dotenv=require("dotenv").config();


const perPage = 15;   //Number of results per page
let currentPage = 1;  //page number
let SearchTerm = null;

let url = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
const apikey = process.env.MY_API_TOKEN;


window.addEventListener('load', () => fetchPhotoes(url));

async function fetchPhotoes(querry) {

    //construct API request URl-

    loadbut.innerHTML = "Loading....";
    loadbut.classList.add(".disabled");

    //fetch data from the pexels website-
    const response = await fetch(querry, {
        headers: {
            Authorization: apikey
        }
    });

    //Parse the json response-
    const data = await response.json();
    console.log(data);

    //binding each and every 15 photoes from the pexels website
    bindPhotoes(data.photos);

    loadbut.innerHTML = "Load More";
    loadbut.classList.remove(".disabled")
}

function bindPhotoes(photoes) {

    imageWrapper.innerHTML += photoes.map((image) => {
        return ` <li class="cards" onclick="showLightBox('${image.src.large2x}','${image.photographer}')">
        <img src="${image.src.large2x}" alt="img-4">
        <div class="details">
            <div class="photographer">
                <span><i class="fa-solid fa-camera-retro" id="cam"></i>${image.photographer}</span>
                <i onclick="downloadImg('${image.src.large2x}');event.stopPropagation();" class="fa-solid fa-cloud-arrow-down"></i>
            </div>
        </div>
    </li>`;
    }).join('');

    //The map function returns the new array of strings of photoes while foreach() cant return any value,
    //So thats why foreach() function is not used, the map() function returns the array of
    //strings and join() function concatenate those strings
}


loadbut.addEventListener('click', () => {
    currentPage++;  //current page is incremented by 1 

    if (SearchTerm) {
        url = `https://api.pexels.com/v1/search?query=${SearchTerm}&per_page=${perPage}&page=${currentPage}`;
        fetchPhotoes(url);
    }
    else {
        let url = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
        fetchPhotoes(url);
    }
})

searchInput.addEventListener('keyup', (e) => {
    //If pressed key is "Enter" then update the current page,search term and call the fetchPhotes function for fetching
    if (e.key === "Enter") {

        if (searchInput.value === "") {
            return SearchTerm = null;
        }

        SearchTerm = searchInput.value;
        currentPage = 1;
        imageWrapper.innerHTML = "";
        url = `https://api.pexels.com/v1/search?query=${SearchTerm}&per_page=${perPage}&page=${currentPage}`;
        fetchPhotoes(url);
    }
})

// event.stopPropagation();-When you have nested elements with event listeners, and you only 
// want the event to trigger on the specific inner element, you can use event.stopPropagation()
//  to prevent the event from reaching the outer elements.

//for downloading the images-
function downloadImg(imgUrl) {
    fetch(imgUrl)
        //converting the received image in to blob,creating its download link and then downloading it
        .then(response => response.blob())
        .then(blob => {
            // Create a temporary link element
            let link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            //setting the download attribute to give the file name as "downloaded_Image.jpg"
            link.download = "downloaded_Image.jpg";

            // Simulate a click on the link to trigger download
            link.click();
        })
        .catch(error => {
            console.log('Error downloading image:', error);
        });

    // When you make an API call to get data (like an image) from a server, the data is often 
    // returned in a format called a Blob. Think of a Blob as a special container that holds
    //whatever data you've requested from the server. It could be an image, a video, or any
    //other type of file. Now, when you receive this Blob of data from the API call, you
    //need to do something with it. If it's an image, for example, you might want to display
    //it on your website or allow users to download it.
}

function showLightBox(image, name) {
    lightBox.querySelector("img").src = image;
    lightBox.querySelector(".photographer_name").innerText = name;
    downloadButton.setAttribute("data-img",image);
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}

closeButton.addEventListener('click', () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
})

downloadButton.addEventListener('click',(e)=>{
    downloadImg(e.target.dataset.img);
// dataset.img accesses the value of the img attribute in the dataset of the downloadButton element.
})
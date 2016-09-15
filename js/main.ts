var age: float;
var faceAttributes;
// Get elements from DOM
var pageheader = $("#page-header")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var pagecontainer = $("#page-container")[0];
// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector : HTMLInputElement = <HTMLInputElement> $("#my-file-selector")[0];

imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Just a sec while we guess your age :)";
    processImage(function (file) {
        // Get emotions based on image
        sendAgeRequest(file, function (faceAttributes) {
            // Find out most dominant emotion
            age = getAge(faceAttributes); //this is where we send out scores to find out the predominant emotion
            changeUI(); //time to update the web app, with their emotion!
            //Done!!
        });
    });
});
function processImage(callback) : void {
    var file = imgSelector.files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}
function changeUI() : void {
    pageheader.innerHTML = "Your age is: " + age; 
    pagecontainer.style.marginTop = "20px";
    setTimeout(swal("Congrats", "You are the perfect age!"), 6000);
}
// Refer to http://stackoverflow.com/questions/35565732/implementing-microsofts-project-oxford-emotion-api-and-file-upload

function sendAgeRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age&returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "172fed16c08e49598603401009d2fc0c");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            // Get faceAttributes data
            var faceAttributes = data[0].faceAttributes;
            callback(faceAttributes);
        }
        else {
            pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another photo?";
        }
    })
        .fail(function (error) {
        pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}

function getAge(faceAttributes) {
    estimated_age = faceAttributes.age;
    return estimated_age;
}

$('.automatic-slider').unslider({
autoplay: true 
});
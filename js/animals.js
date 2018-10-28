var urls = [
  {url: "https://aws.random.cat/meow", type: "cat", key:"file"},
  {url: "https://random.dog/woof.json", type: "dog", key:"url"},
  {url: "https://randomfox.ca/floof", type: "fox", key:"image"}
];
var animalType;
var timing;
var loading = false;
var selectedOption;

function httpRequestAsync(theUrl, type ,callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
            callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open(type, theUrl, true);
    xmlHttp.send(null);
}

function changeLoading(val) {
	loading = val;
	if (val) {
		if (document.getElementsByClassName("spinner").length === 0) {
			var spinner = document.createElement("DIV");
			spinner.className = "spinner";
			document.getElementsByClassName('pageContainer')[0].appendChild(spinner);
		}
	} else {
		document.getElementsByClassName('pageContainer')[0].querySelector(".spinner").parentElement.removeChild(document.getElementsByClassName('pageContainer')[0].querySelector(".spinner"));
	}
}

function getTiming() {
	if (tizen.preference.exists('timing')) {
		return tizen.preference.getValue('timing');
	} else {
		return -1;
	}
}

function checkImage(imageSrc, callback) {
    var img = new Image();
    img.onload = function() {
    		callback(true, img);
    }; 
    img.onerror = function() {
    		callback(false, null);
    };
    img.src = imageSrc;
}

function handleHWAction(type) {
	if (!loading) {
		document.removeEventListener("click", function() {handleHWAction(type);}.bind(this));
		document.removeEventListener('rotarydetent', function() {handleHWAction(type);}.bind(this), false);
		getAnimal(type);
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getObjFromType(type) {
	for (var i=0; i < urls.length; i++) {
        if (urls[i].type === type) {
        		return(urls[i]);
        }
    }
}

function displayAnimal(result) {
	var url = JSON.parse(result)[getObjFromType(animalType).key];
	checkImage(url, function(val, img) {
		if (val) {
			changeLoading(false);
			document.getElementsByClassName('pageContainer')[0].innerHTML ="";
			document.getElementsByClassName('pageContainer')[0].appendChild(img);
			img = document.getElementsByClassName('pageContainer')[0].querySelector('img');
			img.style.position = "absolute";
			img.style.top = "50%";
			img.style.transform = "translateY(-50%)";
			img.style.width = "100%";
			if (timing > 0) {
				setTimeout(function(){
					getAnimal(selectedOption);
				}, timing);
			} else {
				document.removeEventListener("click", function() {handleHWAction(selectedOption);}.bind(this));
				document.removeEventListener('rotarydetent', function() {handleHWAction(selectedOption);}.bind(this), false);
				document.addEventListener('rotarydetent', function() {handleHWAction(selectedOption);}.bind(this), false);
				document.addEventListener("click", function(){handleHWAction(selectedOption);}.bind(this));
				return;
			}
		} else {
			getAnimal(selectedOption);
			return;
		}
	}.bind(this));
}

function getAnimal(type) {
	changeLoading(true);
	var url;
	animalType = type;
	selectedOption = type;
	timing = getTiming();
	if (timing > 0) {
		timing = timing * 1000;
	}
	document.getElementsByClassName('pageContainer')[0].style.position = "relative" ;
	if (animalType !== "random") {
		url = getObjFromType(type).url;
	}else if (type === "random") {
		var rand = getRandomInt(0,urls.length - 1);
		url = urls[rand].url;
		animalType = urls[rand].type;
	}
	httpRequestAsync(url, "GET" , displayAnimal);
}
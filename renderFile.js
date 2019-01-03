window.$ = window.jQuery = require('jquery');

// -----START SLIDERS----- //
var widthSlider = document.getElementById("labelwidth");
var widthValue = document.getElementById("width-value");
widthValue.innerHTML = widthSlider.value + "\""; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
widthSlider.oninput = function() {
  widthValue.innerHTML = this.value + "\"";
}

var heightSlider = document.getElementById("labelheight");
var heightValue = document.getElementById("height-value");
heightValue.innerHTML = heightSlider.value + "\""; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
heightSlider.oninput = function() {
  heightValue.innerHTML = this.value + "\"";
}
// -----END SLIDERS----- //

const { remote, ipcRenderer } = require('electron');
const { handleForm} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

//SAVE ELEMENT ID'S TO VARIABLES
const submitFormButton 			= document.querySelector("#ipcForm");
const labelSizeResponse 		= document.getElementById('per-sheet-response');
const xsQuantityResponse 		= document.getElementById('xs-final-response');
const smQuantityResponse 		= document.getElementById('sm-final-response');
const mdQuantityResponse 		= document.getElementById('md-final-response');
const lgQuantityResponse 		= document.getElementById('lg-final-response');
const xlQuantityResponse 		= document.getElementById('xl-final-response');
const twoxQuantityResponse 		= document.getElementById('twox-final-response');
const threexQuantityResponse 	= document.getElementById('threex-final-response');
const fourxQuantityResponse 	= document.getElementById('fourx-final-response');
const sheetsToPrintResponse 	= document.getElementById('sheets-to-print');



submitFormButton.addEventListener("submit", function(event){
    event.preventDefault();   // stop the form from submitting
    let labelwidth = document.getElementById("labelwidth").value;
    let labelheight = document.getElementById("labelheight").value;
    let xsresponse = document.getElementById("xs").value;
    let smresponse = document.getElementById("sm").value;
    let mdresponse = document.getElementById("md").value;
    let lgresponse = document.getElementById("lg").value;
    let xlresponse = document.getElementById("xl").value;
    let twoxresponse = document.getElementById("twox").value;
    let threexresponse = document.getElementById("threex").value;
    let fourxresponse = document.getElementById("fourx").value;
    handleForm(currentWindow, labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse)
});

ipcRenderer.on('form-received', function(event, labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse){

	//START LABELS PER SHEET LOGIC
	if (labelwidth >= 2.7 && labelwidth <= 3.7) {
		labelwidth = 3;
	} else if (labelwidth >= 2.1 && labelwidth <= 2.6) {
		labelwidth = 4;
	} else if (labelwidth >= 1.7 && labelwidth <= 2.0) {
		labelwidth = 5;
	} else if (labelwidth >= 1.4 && labelwidth <= 1.6) {
		labelwidth = 6;
	} else if (labelwidth >= 1.2 && labelwidth <= 1.3) {
		labelwidth = 7;
	} else if (labelwidth >= 1 && labelwidth <= 1.1) {
		labelwidth = 8;
	} else labelwidth = 0;

	if (labelheight >= 2.7 && labelheight <= 3.7) {
		labelheight = 3;
	} else if (labelheight >= 2.1 && labelheight <= 2.6) {
		labelheight = 4;
	} else if (labelheight >= 1.7 && labelheight <= 2.0) {
		labelheight = 5;
	} else if (labelheight >= 1.4 && labelheight <= 1.6) {
		labelheight = 6;
	} else if (labelheight >= 1.2 && labelheight <= 1.3) {
		labelheight = 7;
	} else if (labelheight >= 1 && labelheight <= 1.1) {
		labelheight = 8;
	} else labelheight = 0;
	//END LABELS PER SHEET LOGIC

	// GET LABELS PER SHEET (FROM ABOVE LOGIC)
	var labelsPerSheet = parseInt(labelwidth) * parseInt(labelheight);

	// GET ARRAY FROM ALL SIZES SUBMITTED
	var allSizesArr = [parseInt(xsresponse), parseInt(smresponse), parseInt(mdresponse), parseInt(lgresponse), parseInt(xlresponse), parseInt(twoxresponse), parseInt(threexresponse), parseInt(fourxresponse)];

	// ADD ALL SIZES
	function getSum(total, num) {
    	return total + num;
	}
	var totalLabelQuantity = allSizesArr.reduce(getSum);

	//GET PERCENTAGE BREAKDOWN FOR EACH SIZE
	var actualPercentageArr = []
	allSizesArr.forEach(function(size) {
  		actualPercentageArr.push(((size / totalLabelQuantity) * 100) || 0);
	});

	//GET RATIO FOR SIZES PER SHEET
	var ratioBreakdownArr = []
	allSizesArr.forEach(function(size) {
  		ratioBreakdownArr.push(((size / totalLabelQuantity) * labelsPerSheet) || 0);
	});
	
	//ROUND RATIO TO WHOLE NUMBER
	var ratioBreakdownRoundedArr = []
	ratioBreakdownArr.forEach(function(percentage) {
		if (percentage > 0 && percentage < 1) {
			percentage = 1
		};
		ratioBreakdownRoundedArr.push(Math.round(percentage));
	});


   //if ratioSum is greater than labelsPerSheet 
   //get biggest number in ratioBreakdownRoundedArr
   //replace with biggest number in ratioBreakdownRoundedArr minus ratioSum - labelsPerSheet

	//START KEEP RATIO EQUAL TO LABELS PER SHEET
    var ratioSum = parseInt(ratioBreakdownRoundedArr[0])
					+ parseInt(ratioBreakdownRoundedArr[1])
					+ parseInt(ratioBreakdownRoundedArr[2])
					+ parseInt(ratioBreakdownRoundedArr[3])
					+ parseInt(ratioBreakdownRoundedArr[4])
					+ parseInt(ratioBreakdownRoundedArr[5])
					+ parseInt(ratioBreakdownRoundedArr[6])
					+ parseInt(ratioBreakdownRoundedArr[7]); //get sum of all numbers in ratio5

	var extra = ratioSum - labelsPerSheet; //get leftover if ratio total is greater than labels per sheet
    var biggest = Math.max(...ratioBreakdownRoundedArr); //get biggest number from ratio array
   	var newNumber = biggest - extra; //subtract extra from biggest number from ratio
   	var indexOfMaxValue = ratioBreakdownRoundedArr.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0); //get index of biggest number in array

    if (labelsPerSheet < ratioSum) {
    	ratioBreakdownRoundedArr.splice(indexOfMaxValue, 1, newNumber); //replace biggest number in ratio array with newNumber
    }

	var sheetsToPrintArr = [];
	for(var i = 0; i < allSizesArr.length; i++) {
    	sheetsToPrintArr.push((allSizesArr[i] / ratioBreakdownRoundedArr[i]) || 0); //divide all numbers in allSizesArr by all numbers in ratio
	}

	//get greatest number from sheetsToPrintArr
	var sheetsToPrint = Math.max(...sheetsToPrintArr);
	if (sheetsToPrint < 1 && sheetsToPrint > 0) { 
		sheetsToPrint = 1; //if between 0 & 1, change to 1
	} else {
		sheetsToPrint = Math.ceil(sheetsToPrint); //round up
	};
	//END KEEP RATIO EQUAL TO LABELS PER SHEET

	//PUT DATA INTO RESPONSE FIELDS
	labelSizeResponse.innerHTML = labelsPerSheet;
    xsQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[0]);
    smQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[1]);
    mdQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[2]);
    lgQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[3]);
    xlQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[4]);
    twoxQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[5]);
    threexQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[6]);
    fourxQuantityResponse.innerHTML = parseInt(ratioBreakdownRoundedArr[7]);
    sheetsToPrintResponse.innerHTML = sheetsToPrint;

	console.log("Labels per sheet: " + labelsPerSheet);
	console.log("All sizes: " + allSizesArr);
	console.log("Total from all sizes: " + totalLabelQuantity);
	console.log("Actual Percentage: " + actualPercentageArr);
	console.log("Ratio breakdown: " + ratioBreakdownArr);
	console.log("Ratio breakdown rounded: " + ratioBreakdownRoundedArr);
	console.log("sheetsToPrintArr: " + sheetsToPrintArr);
	console.log("sheets to print: " + sheetsToPrint);  
});

//SCROLL DOWN TO RESULTS ON SUBMIT BUTTON CLICK
$("#submitbtn").click(function() {
    $("html, body").animate({ scrollTop: $(document).height() }, 400);
}); 

//RESET ON RESET BUTTON CLICK
// $("#resetbtn").click(function() {
// 	location.reload();
// }); 

$("#resetbtn").click(function() {
	$('#ipcForm').trigger("reset");
	$('.dimension-box').text('2.4"');
	$("html, body").animate({ scrollTop: 0 }, 400);
});



///////// DISPROPORTIONATE DISPLACEMENT FIX ////////////////
//breakdown var biggest into array of 1's (3 = [1, 1, 1])
//subtract each item in new array from var biggest 


///////// SHEETS TO PRINT //////////////
//For all sizes in allSizesArr
//divide number by corresponding size in ratioBreakdownRoundedArr
//create new array
//get largest number in array 







//////////GENERAL LOGIC TO FIND OUT RATIO ///////////
	// total number of labels that can fit on sheet = x 	(labelsPerSheet)
	// size = n 											
	// total of all sizes = l								(totalLabelQuantity)
	// each size percentage of sum of all sizes = p		
	// total number of each size per sheet = t				
	// (n / l) * x = t	

	// (n / totalLabelQuantity) * labelsPerSheet = 

 
/////// ERROR LINE////////////
 // errorLine.innerHTML = "Disproportionate size quantities. Adjust size breakdown to fit " + labelsPerSheet + " labels on sheet."
        

///////// RATIO PERCENTAGES ////////////////
// const xsPercentage 		= document.getElementById('xs-percentage');
// const smPercentage 		= document.getElementById('sm-percentage');
// const mdPercentage 		= document.getElementById('md-percentage');
// const lgPercentage 		= document.getElementById('lg-percentage');
// const xlPercentage 		= document.getElementById('xl-percentage');
// const twoxPercentage 	= document.getElementById('twox-percentage');
// const threexPercentage 	= document.getElementById('threex-percentage');
// xsPercentage.innerHTML 	= parseFloat(Math.round(actualPercentageArr[0] * 100) / 100).toFixed(1) + "%";
// smPercentage.innerHTML 	= parseFloat(Math.round(actualPercentageArr[1] * 100) / 100).toFixed(1) + "%";
// mdPercentage.innerHTML 	= parseFloat(Math.round(actualPercentageArr[2] * 100) / 100).toFixed(1) + "%";
// lgPercentage.innerHTML 	= parseFloat(Math.round(actualPercentageArr[3] * 100) / 100).toFixed(1) + "%";
// xlPercentage.innerHTML 	= parseFloat(Math.round(actualPercentageArr[4] * 100) / 100).toFixed(1) + "%";
// twoxPercentage.innerHTML = parseFloat(Math.round(actualPercentageArr[5] * 100) / 100).toFixed(1) + "%";
// threexPercentage.innerHTML = parseFloat(Math.round(actualPercentageArr[6] * 100) / 100).toFixed(1) + "%";



/*************************************************************************************
 * validate.js
 * 8/30/2019
 * Charles Massey Griffin
 *************************************************************************************
 * This script was written for the Maret Web Online Assessment website. 
 * Any or all of this script may be used or modified freely, however, I request that 
 *  my name remain as the original author or, if modified, contributing author.
 ************************************************************************************* 
 * GENERAL FUNCTIONALITY
 * This script disables the submission button until all questions have been answered
 * by the user.
 *  1. Disables the 'Continue'/'Submit' button on page load.
 *  2. Assigns click actions to each radio button loaded on the page.
 *  3. Click actions run the overall validation routing.
 *  4. Validation Routine
 *  	i.   Retrieves all radio button groups
 *  	ii.  Checks to see if each group has a selected item
 *  		a. If Criteria is true, 'Continue'/'Submit' button is enabled
 *  		b. If Criteria is false, 'Continue'/'Submit' button remains disabled
 *************************************************************************************/


/**
 * Master validator method. Gets all answer groups and makes sure that each has a
 * selection before enabling the 'Submit/Continue' button. 
 * @returns void
 */
function validate(){
	var radioGroups = getRadioGroups();
	var inputvalid = true;
	for(var i = 0; i < radioGroups.length; i++){
		var rg = radioGroups[i];
		inputvalid = validateRadios(rg);
	}
	enableSubmit(inputvalid);
}

/**
 * Simply determines if a selection has been made in a group of radio buttons.
 * @param radioGroup Array of radio buttons in the same group (same name)
 * @returns boolean. True if a button is checked, false if none are checked.
 */
function validateRadios(radioGroup){
	for(var i = 0; i < radioGroup.length; i++){
		
		if(radioGroup[i].checked){
			return true; //Question has been answered, return validity of true
		}
	}
	//Return false if no selection has been made
	return false;	
}


/**
 * Function not inherent to javascript, but would be useful. Returns
 * Page elements by tagname and typename.
 * @param tagname ex. form, table, p, input, etc.
 * @param typename ex. submit, radio, checkbox, etc.
 * @returns
 */
function getElementsByTagAndType(tagname, typename){
	var tagElements = document.getElementsByTagName(tagname);
	var tagAndTypeElements = [];
	for(var i = 0; i < tagElements.length; i++){
		if(tagElements[i].type == typename)
			tagAndTypeElements.push(tagElements[i]);
	}
	return tagAndTypeElements;
}

/**
 * Gets the radio buttons, separates then by name into arrays.
 * Then the arrays themselves are stored in another array.
 * @returns 2D Array radioGroups[i][j] where i represents the question, 
 * 			j represents the radio buttons representing the answers
 */
function getRadioGroups(){
	//Get all radio buttons
	var allRadios = getElementsByTagAndType("INPUT","radio");
	//Get the names of all radio buttons (radio button group names)
	var radioNames = getUniqueNames(allRadios);
	//Create an empty array to store the radio buttons by group
	var radioGroups = [];
	for(var i = 0; i < radioNames.length; i++){
		var rName = radioNames[i];
		//Create an empty array for the radio button group
		var rGroup = [];
		//Populate the radio button group array
		for(j = 0; j < allRadios.length; j++){
			if(allRadios[j].name == rName){
				rGroup.push(allRadios[j]);
			}
		}
		//Only add the radio button group array to the parent if it is populated
		if(rGroup.length > 0){
			radioGroups.push(rGroup);
		}
	}//End Radio Names Iteration
	return radioGroups;
}

/**
 * Enables, disables the continue button.
 * @param boolean enabled - True Enables, False Disables
 * @returns void
 */
function enableSubmit(enabled){
	var submitButtons = getElementsByTagAndType("input", "submit");
	for(var i = 0; i < submitButtons.length; i++){
		submitButtons[i].disabled = !enabled;
		if(submitButtons[i].disabled){
			submitButtons[i].title = "Please answer all questions before continuing.";
		}
		else{
			submitButtons[i].title = "";
		}
	}
}

/**
 * Adds an onclick listener to all radio buttons. Following this,
 * Click any radio buttons will force the validate().
 * @returns void
 */
function addValidateToRadioButtons(){
	var allRadios = getElementsByTagAndType("INPUT","radio");
	for(var i = 0; i < allRadios.length; i++){
		allRadios[i].onclick = function() {validate();};
	}
}

/**
 * Returns An array of the unique name attributes after 
 * @param Array of HTML elements.
 * @returns array of strings
 */
function getUniqueNames(elements){
	var names = []
	for(var i=0; i < elements.length; i++){
		if(!names.includes(elements[i].name))
		{
			names.push(elements[i].name);
		}
	}
	return names;
}


//Page load instructions. Add validate to radio buttons only if radio button groups exist.
if(getRadioGroups().length > 0){
	addValidateToRadioButtons();
	enableSubmit(false);
}

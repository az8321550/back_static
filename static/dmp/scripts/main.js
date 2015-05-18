//Get parent object.
var parentWindow = window.parent;

// Reload main window, set main frame window.
function setWindowLocation(url) {
	parentWindow.testIframe.parent.location=url;
}
// Reload current window, set dialog window.
function setCurrentWindowLocation(url) {
	window.location.href = url;
}
// Get a element by id
function $get(objectId) {
	if (document.getElementById && document.getElementById(objectId)) {
		return document.getElementById(objectId);
	} else if (document.all && document.all(objectId)) {
		return document.all(objectId);
	} else if (document.layers && document.layers[objectId]) {
		return document.layers[objectId];
	} else {
		return false;
	}
}
// Get text input value
function $value(id) {
	return $get(id).value;
}
// Show a dialog.
function showDialog(width, height, isModel, title, link, resizable) {
	return parentWindow.showModelDialog(width, height, isModel, title, link,
			resizable);
}
// Hidden a dialog.
function hideDialog() {
	parentWindow.hideModelDialog();
}
// Validate is null?
function validateNotNull(id, error) {
	if (id == null)
		return false;
	if (error == null)
		error = "Can not be null!";

	var obj = $get(id);

	if (obj.value == null || obj.value == "") {
		alert(error);
		return false;
	}
	return true;
}
// Validate is number format.
function validateIsNumber(id, error) {
	if (id == null)
		return false;
	if (error == null)
		error = "Invalid number format!";

	var obj = $get(id);

	if (obj.value == null || obj.value == "" || !isNumber(obj.value)) {
		alert(error);
		return false;
	}
	return true;
}
function isNumber(num) {
	// 判断是否为数字
	if (num == null || num == "")
		return false;

	for ( var i = 0; i < num.length; i++) {
		var oneNum = num.substring(i, i + 1);
		if (isNaN(oneNum))
			return false;
	}
	return true;
}
function getCheckItem(name) {
	if (name == null)
		return;

	var ids = document.getElementsByName(name);
	var out = new Array();

	if (ids) {
		for ( var i = 0; i < ids.length; i++) {
			if (ids[i].checked) {
				out.push(ids[i].value);
			}
		}
	}
	return out;
}
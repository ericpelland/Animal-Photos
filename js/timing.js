function changeTiming(minutes) {
	tizen.preference.setValue('timing', minutes);
	window.history.back();
}
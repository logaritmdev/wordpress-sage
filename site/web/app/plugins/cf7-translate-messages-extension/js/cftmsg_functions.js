var messages = [
['wpcf7-message-mail-sent-ok' , 'Thank you for your message. It has been sent.'],
['wpcf7-message-mail-sent-ng' , 'There was an error trying to send your message. Please try again later.'],
['wpcf7-message-validation-error' , 'One or more fields have an error. Please check and try again.'],
['wpcf7-message-spam' , 'There was an error trying to send your message. Please try again later.'],
['wpcf7-message-accept-terms' , 'You must accept the terms and conditions before sending your message.'],
['wpcf7-message-invalid-required' , 'The field is required.'],
['wpcf7-message-invalid-too-long' , 'The field is too long.'],
['wpcf7-message-invalid-too-short' , 'The field is too short.'],
['wpcf7-message-invalid-date' , 'The date format is incorrect.'],
['wpcf7-message-date-too-early' , 'The date is before the earliest one allowed.'],
['wpcf7-message-date-too-late' , 'The date is after the latest one allowed.'],
['wpcf7-message-upload-failed' , 'There was an unknown error uploading the file.'],
['wpcf7-message-upload-file-type-invalid' , 'You are not allowed to upload files of this type.'],
['wpcf7-message-upload-file-too-large' , 'The file is too big.'],
['wpcf7-message-upload-failed-php-error' , 'There was an error uploading the file.'],
['wpcf7-message-invalid-number' , 'The number format is invalid.'],
['wpcf7-message-number-too-small' , 'The number is smaller than the minimum allowed.'],
['wpcf7-message-number-too-large' , 'The number is larger than the maximum allowed.'],
['wpcf7-message-quiz-answer-not-correct' , 'The answer to the quiz is incorrect.'],
['wpcf7-message-invalid-email' , 'The e-mail address entered is invalid.'],
['wpcf7-message-invalid-url' , 'The URL is invalid.'],
['wpcf7-message-invalid-tel' , 'The telephone number is invalid.']
];

jQuery(document).ready(function(){
	jQuery(".single-lang").on("click", function(){
		var lang_selected = jQuery(this).data("lang");
		var confirm = window.confirm("Are you sure you want to translate messages to " + lang_selected.toUpperCase() + "?");
		if (confirm == true){
			var translating = jQuery(".lang-wrapper-translating");
			var translated = jQuery(".lang-wrapper-translated");
			var loading = jQuery("#lang-wrapper-loading");
			var json_file = decodeURIComponent( jQuery(this).data("url") );

			translated.hide();
			translating.show();
			loading.addClass("active");

			jQuery.ajax({
				url: json_file,
				type: "POST",
				dataType: "JSON",
				success: function(data){
					for(i = 0; i < messages.length; i++){
						element = document.getElementById(messages[i][0]);
						msg = data[messages[i][1]];
						jQuery(element).val(msg);
					}
					translating.hide();
					translated.show();
					setTimeout(function(){
						loading.fadeOut('300', function(){
							loading.removeClass("active");
						});
					}, 1500);
				}
			});
		}
	});
});

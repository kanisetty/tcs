// To prevent cross-frame scripting attacks in IE, make sure this code is not enclosed in a frame
if (top != self)
{
	top.location=self.location; 
};

function e(id)
{
	return document.getElementById(id);
}

function trim(text) {
	return text.replace(/(^\s*)|(\s*$)/g, "");
}

function validate(form)
{
	var spinner_top = '';
	var spinner_left = '';
	
	var submit = true;
	
	var err_msg_element = e('form-err-msg');
	err_msg_element.innerHTML = '&nbsp;';
	
	if(form.id === 'signupvalidation')
	{
		spinner_top = "-62px";
		spinner_left = "545px";
		
		form.firstname.value = trim(form.firstname.value.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
		form.lastname.value = trim(form.lastname.value.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
		if(form.firstname.value.length === 0
			||	form.lastname.value.length === 0)
		{
			err_msg_element.innerHTML = 'Please fill in all fields.';
			submit = false;			
		}
		
		form.password.value = trim(form.password.value);
		form.password_confirm.value = trim(form.password_confirm.value);
		if(form.password.value !== form.password_confirm.value)
		{
			err_msg_element.innerHTML = 'Please ensure the passwords match.';
			submit = false;
		}
		if(form.password.value.length < 6 )
		{
			err_msg_element.innerHTML = 'Please fill in all fields. Password must be at least 6 characters long.';
			submit = false;			
		}
	}else if(form.id === 'signupexistinguser')
	{
		spinner_top = "-62px";
		spinner_left = "547px";
		form.username.value = trim(form.username.value);
		form.password.value = trim(form.password.value);
		if(form.password.value.length === 0
			||	form.username.value.length === 0 )
		{
			err_msg_element.innerHTML = 'Please fill in all fields.';
			submit = false;			
		}
	} else if (form.id === 'forgotpasswordform')
	{
		spinner_top = "-62px";
		spinner_left = "579px";
		
		form.username.value = trim(form.username.value);
		if (form.username.value.length === 0) {
			err_msg_element.innerHTML = 'Please fill in all required fields.';
			submit = false;			
		}
	}else if(form.id === 'pwresetvalidation')
	{
		spinner_top = "-62px";
		spinner_left = "545px";
		
		form.password.value = trim(form.password.value);
		form.password_confirm.value = trim(form.password_confirm.value);
		if(form.password.value !== form.password_confirm.value)
		{
			err_msg_element.innerHTML = 'Please ensure the passwords match.';
			submit = false;
		}
		if(form.password.value.length < 5)
		{
			err_msg_element.innerHTML = 'Please fill in all fields. Password must be at least 6 characters long.';
			submit = false;			
		}
	}
	if(submit)
	{
		var btn_spinner = e('action-btn-spinner');
		if (btn_spinner) {
			btn_spinner.style.visibility = 'visible';
			btn_spinner.style.top = spinner_top;
			btn_spinner.style.left = spinner_left;
		}
		var btn_label = e('action-btn-label');
		if (btn_label) {
			btn_label.style.color = '#aaa';
		}
		form.submit();
	}
}
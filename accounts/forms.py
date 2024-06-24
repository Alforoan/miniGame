from django import forms

class LoginForm(forms.Form):
  username = forms.CharField(max_length=150)
  password = forms.CharField(max_length=150, widget=forms.PasswordInput)

class SignupForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(max_length=150, widget=forms.PasswordInput)
    password_confirmation = forms.CharField(max_length=150, widget=forms.PasswordInput)

class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(max_length=150, widget=forms.PasswordInput)
    new_password = forms.CharField(max_length=150, widget=forms.PasswordInput)
    confirm_password = forms.CharField(max_length=150, widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_new_password = cleaned_data.get('confirm_new_password')

        if new_password and confirm_new_password:
            if new_password != confirm_new_password:
                raise forms.ValidationError("The new passwords do not match.")

        return cleaned_data
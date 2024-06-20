from django import forms

class LoginForm(forms.Form):
  username = forms.CharField(max_length=150)
  password = forms.CharField(max_length=150, widget=forms.PasswordInput)

from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column

class SignupForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(max_length=150, widget=forms.PasswordInput)
    password_confirmation = forms.CharField(max_length=150, widget=forms.PasswordInput)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('username', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('password', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Row(
                Column('password_confirmation', css_class='form-group col-md-6 mb-0'),
                css_class='form-row'
            ),
            Submit('submit', 'Signup')
        )

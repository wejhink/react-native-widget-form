'use strict';

import React, {
  AppRegistry,
} from 'react-native';


import ExNavigator from '@exponent/react-native-navigator';
var {WidgetForm, WidgetFormManager} = require('react-native-widget-form');


class Example extends React.Component {
  render() {
    return (
      <ExNavigator
        initialRoute={this.getRoute()}
        style={{ flex: 1 }}
        sceneStyle={{ paddingTop: 64 }}
      />
    );
  }

  getRoute() {
    return {
      renderScene(navigator) {
        return (
          <WidgetForm
            formName='signupForm' // WidgetForm instances that use the same name will also share the same states

            openModal={(route) => {
              navigator.push(route); // The ModalWidget will be opened using this method. Tested with ExNavigator
            }}

            clearOnClose={false} // delete the values of the form when unmounted

            defaults={{
              /*
              username: 'iraycd',
              'gender{M}': true,
              password: 'abcdefg',
              country: 'FR',
              birthday: new Date(((new Date()).getFullYear() - 18)+''),
              */
            }}

            validators={{
              fullName: {
                title: 'Full name',
                validate: [{
                  validator: 'isLength',
                  arguments: [1, 23],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              username: {
                title: 'Username',
                validate: [{
                  validator: 'isLength',
                  arguments: [3, 16],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                },{
                  validator: 'matches',
                  arguments: /^[a-zA-Z0-9]*$/,
                  message: '{TITLE} can contains only alphanumeric characters'
                }]
              },
              password: {
                title: 'Password',
                validate: [{
                  validator: 'isLength',
                  arguments: [6, 16],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              emailAddress: {
                title: 'Email address',
                validate: [{
                  validator: 'isLength',
                  arguments: [6, 255],
                },{
                  validator: 'isEmail',
                }]
              },
              bio: {
                title: 'Biography',
                validate: [{
                  validator: 'isLength',
                  arguments: [0, 512],
                  message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
                }]
              },
              gender: {
                title: 'Gender',
                validate: [{
                  validator: (...args) => {
                    if (args[0] === undefined) {
                      return false;
                    }
                    return true;
                  },
                  message: '{TITLE} is required',
                }]
              },
              birthday: {
                title: 'Birthday',
                validate: [{
                  validator: 'isBefore',
                  arguments: [moment().utc().subtract(18, 'years').format('YYYY-MM-DD')],
                  message: 'You must be at least 18 years old'
                }, {
                  validator: 'isAfter',
                  arguments: [moment().utc().subtract(100, 'years').format('YYYY-MM-DD')],
                  message: '{TITLE} is not valid'
                }]
              },
              country: {
                title: 'Country',
                validate: [{
                  validator: 'isLength',
                  arguments: [2],
                  message: '{TITLE} is required'
                }]
              },
            }}
          >

            <WidgetForm.SeparatorWidget />
            <WidgetForm.TextInputWidget
              name='fullName' // mandatory
              title='Full name'

              image={require('./icons/color/user.png')}

              placeholder='Marco Polo'
              clearButtonMode='while-editing'
            />


            <WidgetForm.TextInputWidget
              name='username'
              title='Username'
              image={require('./icons/color/contact_card.png')}

              placeholder='MarcoPolo'
              clearButtonMode='while-editing'

              onTextInputFocus={(currentText = '') => {
                if (!currentText) {
                  let fullName = WidgetFormManager.getValue('signupForm', 'fullName');
                  if (fullName) {
                    return fullName.replace(/[^a-zA-Z0-9-_]/g, '');
                  }
                }
                return currentText;
              }}
            />

            <WidgetForm.TextInputWidget
              name='password' // mandatory
              title='Password'

              placeholder='******'


              clearButtonMode='while-editing'
              secureTextEntry={true}
              image={require('./icons/color/lock.png')}
            />

            <WidgetForm.TextInputWidget
              name='emailAddress' // mandatory
              title='Email address'
              placeholder='example@nomads.ly'

              keyboardType='email-address'

              clearButtonMode='while-editing'

              image={require('./icons/color/email.png')}
            />

            <WidgetForm.SeparatorWidget />

            <WidgetForm.ModalWidget
              title='Gender'
              displayValue='gender'
              image={require('./icons/color/gender.png')}
            >
              <WidgetForm.SeparatorWidget />

              <WidgetForm.SelectWidget name='gender' title='Gender' multiple={false}>
                <WidgetForm.OptionWidget image={require('./icons/color/female.png')} title='Female' value='F'/>
                <WidgetForm.OptionWidget image={require('./icons/color/male.png')} title='Male' value='M'/>
              </WidgetForm.SelectWidget>
            </WidgetForm.ModalWidget>

            <WidgetForm.ModalWidget
              title='Birthday'
              displayValue='birthday'
              image={require('./icons/color/birthday.png')}

              scrollEnabled={false}
            >
              <WidgetForm.SeparatorWidget/>
              <WidgetForm.DatePickerIOSWidget
                name='birthday'
                mode='date'

                getDefaultDate={() => {
                  return new Date(((new Date()).getFullYear() - 18)+'');
                }}
              />
            </WidgetForm.ModalWidget>
            <WidgetForm.ModalWidget
              title='Country'
              displayValue='country'
              image={require('./icons/color/passport.png')}
              scrollEnabled={false}

            >
              <WidgetForm.SelectCountryWidget
                code='alpha2'
                name='country'
                title='Country'
                autoFocus={true}
              />
            </WidgetForm.ModalWidget>


            <WidgetForm.ModalWidget
              title='Biography'
              displayValue='bio'

              image={require('./icons/color/book.png')}

              scrollEnabled={true} // true by default
            >
              <WidgetForm.SeparatorWidget/>
              <WidgetForm.TextAreaWidget
                name='bio'

                autoFocus={true}

                placeholder='Something interesting about yourself'
              />
            </WidgetForm.ModalWidget>



            <WidgetForm.SubmitWidget
              title='Sign up'
              widgetStyles={{
                submitButton: {
                  backgroundColor: themes.mainColor,
                }
              }}
              onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                if (isValid === true) {
                  // prepare object
                  values.gender = values.gender[0];
                  values.birthday = moment(values.birthday).format('YYYY-MM-DD');

                  /* Implement the request to your server using values variable
                  ** then you can do:
                  ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                  ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                  ** WidgetFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                  */

                  postSubmit();
                }
              }}

            />

            <WidgetForm.NoticeWidget
              title='By signing up, you agree to the Terms of Service and Privacy Policity.'
            />

            <WidgetForm.HiddenWidget name='tos' value={true} />

          </WidgetForm>
        );
      }
    }
  }
}


module.exports = Example;

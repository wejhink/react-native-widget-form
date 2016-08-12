# Widget Form
Form component for React-Native


![](https://raw.githubusercontent.com/wejhink/react-native-widget-form/master/capture/signup.gif)

### Changelog

#### 0.0.7
- SelectDayWidget, CellWidget and DayPickerWidget are now deprecated and will be replaced by DatePickerWidget


### Example

```js
var {WidgetForm, WidgetFormManager} = require('react-native-widget-form');

var Component = React.createClass({
  render() {
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

          image={require('../../assets/icons/color/user.png')}

          placeholder='Marco Polo'
          clearButtonMode='while-editing'
        />


        <WidgetForm.TextInputWidget
          name='username'
          title='Username'
          image={require('../../assets/icons/color/contact_card.png')}

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
          image={require('../../assets/icons/color/lock.png')}
        />

        <WidgetForm.TextInputWidget
          name='emailAddress' // mandatory
          title='Email address'
          placeholder='example@nomads.ly'

          keyboardType='email-address'

          clearButtonMode='while-editing'

          image={require('../../assets/icons/color/email.png')}
        />

        <WidgetForm.SeparatorWidget />

        <WidgetForm.ModalWidget
          title='Gender'
          displayValue='gender'
          image={require('../../assets/icons/color/gender.png')}
        >
          <WidgetForm.SeparatorWidget />

          <WidgetForm.SelectWidget name='gender' title='Gender' multiple={false}>
            <WidgetForm.OptionWidget image={require('../../assets/icons/color/female.png')} title='Female' value='F'/>
            <WidgetForm.OptionWidget image={require('../../assets/icons/color/male.png')} title='Male' value='M'/>
          </WidgetForm.SelectWidget>
        </WidgetForm.ModalWidget>

        <WidgetForm.ModalWidget
          title='Birthday'
          displayValue='birthday'
          image={require('../../assets/icons/color/birthday.png')}

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
          image={require('../../assets/icons/color/passport.png')}
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

          image={require('../../assets/icons/color/book.png')}

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
              ** postSubmit(); // disable the loader
              ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
              ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
              ** WidgetFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
              */
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
});
```

### Storing form's state elsewhere (could be used with Redux) - Beta feature

Pass `value` prop to your widgets and `onValueChange` to your WidgetForm to store your state outside of WidgetFormManager's store.

IMPORTANT: currently only TextInputWidget and HiddenWidget support this feature. PR's are welcome for the other widgets ;)

```js
import React, { AppRegistry, Component } from 'react-native'
import { WidgetForm, WidgetFormManager } from 'react-native-widget-form'

class Form extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      form: {
        fullName: 'Marco Polo',
        tos: false,
      }
    }
  }

  handleValueChange(values) {
    console.log('handleValueChange', values)
    this.setState({ form: values })
  }

  render() {
    const { fullName, tos, gender } = this.state.form
    console.log('render', this.state.form)
    return (
      <WidgetForm
        formName='signupForm'
        openModal={(route) => { this.props.navigator.push(route) }}
        onValueChange={this.handleValueChange.bind(this)}
      >
        <WidgetForm.TextInputWidget
          name='fullName'
          title='Full name'
          placeholder='Marco Polo'
          clearButtonMode='while-editing'
          value={fullName}
        />
        <WidgetForm.HiddenWidget name='tos' value={tos} />
      </WidgetForm>
    )
  }
}

AppRegistry.registerComponent('Form', () => Form)
```

### Installation

`npm install react-native-widget-form --save`


### Available widgets
- TextInputWidget - A text input
- TextAreaWidget - A text area
- GooglePlacesWidget - A Google Places picker based on react-native-google-places-autocomplete
- ModalWidget - A route opener for nested forms
- GroupWidget - A widgets container with a title
- HiddenWidget - A non-displayed widget. The value will be passed to SubmitWidget
- LoadingWidget - A loader
- RowWidget - A touchable row with title/image
- SelectCountryWidget - A country picker. Flags made by www.IconDrawer.com
- SelectWidget - A select menu
- SeparatorWidget - A 10px widgets separator
- SubmitWidget - A submit button that trigger form validators and error displaying
- SwitchWidget - A switch
- DatePickerIOSWidget - Date picker for iOS
- NoticeWidget - A notice information - PR wanted for onPress handler


See the sources for props details


### Your own widget
Widgets must implement the mixin WidgetForm.WidgetMixin - See /widgets/TextAreaWidget.js for example


### Contributing
Pull requests are welcome


### License

[MIT](LICENSE)

Feel free to ask me questions on Twitter [@wejhink](https://www.twitter.com/wejhink) !

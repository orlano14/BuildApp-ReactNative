import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Image, TouchableOpacity,NativeModules, AsyncStorage, I18nManager } from 'react-native';
import StaticC from '../Components/StaticC';
import * as Facebook from 'expo-facebook';
import { Input, Button, Icon, CheckBox, Overlay } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import User from '../Classes/User';
import MyAlert from '../Components/MyAlert';
import PreloaderC from '../Components/PreloaderC';
import { Notifications } from 'expo';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import registerForPushNotificationsAsync from '../Servises/registerForPushNotificationsAsync';
import serverURL from '../assets/serverURL';





export default class Login extends Component {
  constructor(props) {
    super(props);
    this.malePic = 'https://cdn.clipart.email/a2726be5294f5d841506af45a17f96c6_cool-facebook-profile-picture-silhouette-at-getdrawingscom-free-_1008-1008.jpeg';
    this.femalePic = 'https://i0.wp.com/thaneyan.com.sa/wp-content/uploads/2016/06/facebook-default-no-profile-pic-girl.jpg';
    this.apiUrl = serverURL+'/api/';

    this.state = {
      firstName: '',
      lastName: '',
      birthday: '',
      userName: '',
      password: '',
      password2: '',
      gender: '',
      picUrl: '',
      signUp: false,
      showDPikcker: false,
      isGenderVerify: { isV: false, message: 'Gender - field is required' },
      overlayIsVisible: false,
      preloader: false,
      notification: {},
    }
  }
  // signInWithGoogleAsync=async()=> {
  //     try {
  //       const result = await Google.logInAsync({
  //         androidClientId: 'buildapp-271214',
  //         iosClientId: 'buildapp-271214',
  //         scopes: ['profile', 'email'],
  //       });

  //       if (result.type === 'success') {
  //         console.log(result.accessToken);

  //       } else {
  //         console.log('cancelled');
  //       }
  //     } catch (e) {
  //         console.log('error');
  //     }
  //   }
  componentDidMount = async () => {
    let r=parseInt(await AsyncStorage.getItem('reload'));
    if (I18nManager.isRTL&&r!==1) {
      I18nManager.forceRTL(false)
      await AsyncStorage.setItem('reload','1');
      NativeModules.DevSettings.reload();
    }
    try {
      // await AsyncStorage.clear();

      let s = await AsyncStorage.getItem('Settings');
      if (s !== null) {
        this.notificationHandelr();
        this.props.navigation.navigate('MainApp')
      }
      else {
        try {
          let u = await AsyncStorage.getItem('MyUser');
          // u=null
          if (u !== null) {
            this.notificationHandelr();
            // this.FetchIsSettingsExist(u);
            this.props.navigation.navigate('Settings')
          }
        } catch (error) {
          console.log("Error geting AsyncStorege");
        }
      }
    } catch (error) {
      console.log("Error geting AsyncStorege");
    }
  }
  notificationHandelr = async () => {
    registerForPushNotificationsAsync()
      .then((token) => {
        this.FetchSendToken(token);
      });
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  _handleNotification = (notification) => {
    this.setState({ notification: notification });
    notification.origin === "selected" && this.props.navigation.navigate('Home', { notification })

  };
  SetUserToAsyncStorege = async (u) => {
    try {
      await AsyncStorage.setItem('MyUser', JSON.stringify(u));
    } catch (error) {
      console.log('Error saving data AsyncStorege');
    }
    return true;
  }
  // FetchIsSettingsExist = (userName) =>{
  //   fetch("http://proj.ruppin.ac.il/bgroup9/BuildApp/api/Settings/IsSettingsExist/" + userName, {
  //     method: 'GET',
  //     headers: new Headers({
  //       'Content-Type': 'application/json; charset=UTF-8',
  //     })
  //   })
  //     .then(res => {
  //       return res.json()
  //     })
  //     .then(
  //       (result) => {
  //           if (result) {
  //             this.props.navigation.navigate('MainApp')
  //           }
  //           else{
  //             this.props.navigation.navigate('Settings')
  //           }
  //       },
  //       (error) => {
  //         console.log("err post=", error);
  //       });
  // }

  GetSelfUserName = async () => {
    try {
      let u = JSON.parse(await AsyncStorage.getItem('MyUser'));

      if (u !== null) {
        return u.userName;
      }
    } catch (error) {
      return Promise.reject("Error geting AsyncStorege");
    }

  }

  FetchSendToken = (token) => {
    this.GetSelfUserName().then((un) => {

      fetch(this.apiUrl + `SendToken/SendToken/${un}/${token}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        })
      })
        .then(res => {
          return res.json()
        })
        .then(
          (result) => {
            console.log('token saved '+result);
          },
          (error) => {
            console.log("err post=", error);
          });

    })
  }
  FetchIsUserNameExist = (userName, mode) => {
    fetch(this.apiUrl + "Login/isUNexist/" + userName, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          if (mode === 'signUp') {
            let isEx = result
            this.setState({
              isUserNameVerify: { isV: !isEx, message: 'That User Name is taken. Try another.' }
            })
          }
          else {
            if (mode === 'StorageCleaned') {
              !result && this.FetchAddUser(this.user)
            }
          }

        },
        (error) => {
          console.log("err post=", error);
        });
  }
  FetchSignIn = (userName, password) => {
    this.setState({ preloader: true })
    let signInUrl = `${this.apiUrl}Login/signIn/${userName}/${password}`
    fetch(signInUrl, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        async (result) => {
          this.setState({ preloader: true })
          if (result !== null && result.Message === undefined) {
            let u = new User(result.UserName, result.FirstName, result.LastName, result.Birthday, result.Gender, result.Password, result.PicUrl)
            await this.SetUserToAsyncStorege(u);
            // this.FetchIsSettingsExist(user.userName)
            this.notificationHandelr();
            this.props.navigation.navigate('Settings')
          }
          this.setState({ preloader: false })
        },
        (error) => {
          console.log("err post=", error);
          this.setState({ preloader: false })
        });
  }
  FetchAddUser = (u) => {
    this.setState({ preloader: true })
    fetch(this.apiUrl + "Login/addUser", {
      method: 'POST',
      body: JSON.stringify(u),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })

    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log("fetch POST= ", result);
          this.setState({ preloader: false })
        },
        (error) => {
          console.log("err post=", error);
          this.setState({ preloader: false })
        });
  }
  FacebookLogin = async () => {
    try {
      await Facebook.initializeAsync('623190955080038');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'user_birthday', 'user_gender'],
      });

      if (type === 'success') {
        let response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,gender,birthday,picture.type(large)`);
        let fbUser = await response.json();
        let bDay = new Date(fbUser.birthday);
        bDay.setDate(bDay.getDate() + 1)
        this.user = new User(
          fbUser.id,
          fbUser.name.split(' ')[0],
          fbUser.name.substring(fbUser.name.indexOf(' ') + 1, fbUser.name.length),
          bDay,
          fbUser.gender,
          fbUser.id,
          fbUser.picture.data.url
        )
        console.log(fbUser.picture.data.url);
        //fetch
        await this.SetUserToAsyncStorege(this.user)
        this.FetchIsUserNameExist(this.user.userName, 'StorageCleaned')
        // this.FetchIsSettingsExist(this.user.userName)
        this.notificationHandelr();
        this.props.navigation.navigate('Settings')
      } else {
        console.log('cancel');

        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }
  toogleGender = (gender) => {

    this.setState({
      gender: gender,
      picUrl: gender === 'male' ? this.malePic : this.femalePic,
      isGenderVerify: { isV: true }

    })
  }
  SignUpMode = () => {
    this.setState({
      signUp: true,
    })
  }
  // btnOpenGalery = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync();
  //   console.log(result);

  //   if (!result.cancelled) {
  //     this.setState({ picUrl: result.uri });
  //   }
  // };
  birthdayPicked = (event, date) => {
    event.type === 'set' ? this.setState({
      birthday: date,
      showDPikcker: false,
      isBirthdayVerify: { isV: true }
    }) : this.setState({
      isBirthdayVerify: this.state.birthday !== '' ? { isV: true } : { isV: false, message: 'Birthday - field is required' },
      showDPikcker: false,
    })
  }
  verifyPass = (p) => {
    if (p.length < 5) {
      this.setState({
        isPassVerify: { isV: false, message: 'Password - 5 charachters or longer' }
      })
    }
    else {
      this.setState({
        isPassVerify: { isV: true }
      })
    }
  }
  verifyPassMatch = (p1, p2) => {
    if (p1 !== p2) {
      this.setState({
        isPassMatchVerify: { isV: false, message: 'Password do not match' }
      })
    }
    else {
      this.setState({
        isPassMatchVerify: { isV: true }
      })
    }
  }
  verifyUserName = async () => {
    this.state.userName.length < 4 ?
      this.setState({
        isUserNameVerify: { isV: false, message: 'UserName - 4 charachters or longer' }
      })
      : this.FetchIsUserNameExist(this.state.userName, 'signUp')



  }
  verifyFirstName = () => {
    this.setState({
      isFirstNameVerify: this.state.firstName.length < 2 ? { isV: false, message: 'First Name - 2 charachters or longer' } : { isV: true }
    })
  }
  verifyLastName = () => {
    this.setState({
      isLastNameVerify: this.state.lastName.length < 2 ? { isV: false, message: 'Last Name - 2 charachters or longer' } : { isV: true }
    })
  }
  verifyBirthday = () => {
    this.setState({
      isBirthdayVerify: this.state.birthday === '' ? { isV: false, message: 'Birthday - field is required' } : { isV: true }
    })
  }
  signUp = async () => {
    await this.verifyUserName();
    await this.verifyFirstName();
    await this.verifyLastName();
    await this.verifyPass(this.state.password);
    await this.verifyPassMatch(this.state.password, this.state.password2);
    await this.verifyBirthday();

    let m = ''
    let isV = true;
    m += this.state.isUserNameVerify.isV ? '' : this.state.isUserNameVerify.message + '\n';
    this.state.isUserNameVerify.isV ? null : isV = false;
    m += this.state.isFirstNameVerify.isV ? '' : this.state.isFirstNameVerify.message + '\n';
    this.state.isFirstNameVerify.isV ? null : isV = false;
    m += this.state.isLastNameVerify.isV ? '' : this.state.isLastNameVerify.message + '\n';
    this.state.isLastNameVerify.isV ? null : isV = false;
    m += this.state.isBirthdayVerify.isV ? '' : this.state.isBirthdayVerify.message + '\n';
    this.state.isBirthdayVerify.isV ? null : isV = false;
    m += this.state.isPassVerify.isV ? '' : this.state.isPassVerify.message + '\n';
    this.state.isPassVerify.isV ? null : isV = false;
    m += this.state.isPassMatchVerify.isV ? '' : this.state.isPassMatchVerify.message + '\n';
    this.state.isPassMatchVerify.isV ? null : isV = false;
    m += this.state.isGenderVerify.isV ? '' : this.state.isGenderVerify.message + '\n';
    this.state.isGenderVerify.isV ? null : isV = false;

    isV ? this.signUpVerified() : this.setState({
      overlayIsVisible: true,
      currentMessage: m
    })
  }
  signUpVerified = async () => {
    let user = new User(
      this.state.userName,
      this.state.firstName,
      this.state.lastName,
      this.state.birthday,
      this.state.gender,
      this.state.password,
      this.state.picUrl
    )
    this.FetchAddUser(user)
    await this.SetUserToAsyncStorege(user)
    this.setState({
      userName: '',
      firstName: '',
      lastName: '',
      birthday: '',
      gender: '',
      password: '',
      password2: '',
      picUrl: '',
      signUp: false,
      isUserNameVerify: undefined,
      isFirstNameVerify: undefined,
      isLastNameVerify: undefined,
      isBirthdayVerify: undefined,
      isPassVerify: undefined,
      isPassMatchVerify: undefined,
      isGenderVerify: { isV: false, message: 'Gender - field is required' }

    })
    this.notificationHandelr();
    this.props.navigation.navigate('Settings');
  }
  signUpCancle = () => {
    this.setState({
      userName: '',
      firstName: '',
      lastName: '',
      birthday: '',
      gender: '',
      password: '',
      password2: '',
      picUrl: '',
      signUp: false,
      isUserNameVerify: undefined,
      isFirstNameVerify: undefined,
      isLastNameVerify: undefined,
      isBirthdayVerify: undefined,
      isPassVerify: undefined,
      isPassMatchVerify: undefined,
      isGenderVerify: { isV: false, message: 'Gender - field is required' }
    })
  }
  SingInClicked = () => {
    this.FetchSignIn(this.state.userName, this.state.password)
    //this.props.navigation.navigate('Settings');
  }
  overlayFalse = () => {
    this.setState({ overlayIsVisible: false })
  }

  render() {

    return (
      <StaticC>
        {this.state.preloader && <PreloaderC />}
        {this.state.signUp === false ?
          <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20 }}>
            <Input label='User Name'
              placeholder='User Name'
              value={this.state.userName}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={{ type: 'feather', name: 'user', color: '#fff' }}
              onChangeText={userName => this.setState({ userName })}
            />
            <Input label='Password'
              placeholder='Password'
              value={this.state.password}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.4, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={{ type: 'feather', name: 'lock', color: '#fff' }}
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
            />
            <Button title='Sign In' type='solid' onPress={this.SingInClicked} />
            <Button title='Sign Up' type='clear' onPress={this.SignUpMode} />

          </View> :
          <View style={{ flex: 1, height: 500, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 20, paddingBottom: 20 }}>
            <Input label='User Name'
              placeholder='User Name'
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={this.state.isUserNameVerify === undefined ? { type: 'feather', name: 'user', color: '#fff' } : this.state.isUserNameVerify.isV ? { type: 'feather', name: 'user', color: '#31F049' } : { type: 'feather', name: 'user', color: '#FA2F12', onPress: () => this.setState({ overlayIsVisible: true, currentMessage: this.state.isUserNameVerify.message }) }}
              onChangeText={userName => this.setState({ userName })}
              onEndEditing={this.verifyUserName}
            />
            <Input label='First Name'
              placeholder='First Name'
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={this.state.isFirstNameVerify === undefined ? { type: 'feather', name: 'user', color: '#fff' } : this.state.isFirstNameVerify.isV ? { type: 'feather', name: 'user', color: '#31F049' } : { type: 'feather', name: 'user', color: '#FA2F12', onPress: () => this.setState({ overlayIsVisible: true, currentMessage: this.state.isFirstNameVerify.message }) }}
              onChangeText={firstName => this.setState({ firstName })}
              onEndEditing={this.verifyFirstName}

            />
            <Input label='Last Name'
              placeholder='Last Name'
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={this.state.isLastNameVerify === undefined ? { type: 'feather', name: 'user', color: '#fff' } : this.state.isLastNameVerify.isV ? { type: 'feather', name: 'user', color: '#31F049' } : { type: 'feather', name: 'user', color: '#FA2F12', onPress: () => this.setState({ overlayIsVisible: true, currentMessage: this.state.isLastNameVerify.message }) }}
              onChangeText={lastName => this.setState({ lastName })}
              onEndEditing={this.verifyLastName}
            />
            <Input label='Date of birth'
              placeholder='DD/MM/YYYY'
              value={this.state.birthday !== '' ? Moment(this.state.birthday).format('DD/MM/YYYY') : null}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={{ type: 'materialIcons', name: 'today', color: this.state.isBirthdayVerify === undefined ? '#fff' : this.state.isBirthdayVerify.isV ? '#31F049' : '#FA2F12', onPress: () => this.state.isBirthdayVerify.isV === false && this.setState({ overlayIsVisible: true, currentMessage: this.state.isBirthdayVerify.message }) }}
              onFocus={() => { this.setState({ showDPikcker: true }) }}
              onChange={() => { this.setState({ showDPikcker: true }) }}
            // onEndEditing={this.verifyLastName}
            />
            {this.state.showDPikcker && <DateTimePicker
              testID="dateTimePicker"
              value={this.state.birthday === '' ? new Date() : this.state.birthday}
              timeZoneOffsetInMinutes={0}
              maximumDate={new Date()}
              mode='date'
              is24Hour={true}
              display="spinner"
              onChange={this.birthdayPicked}
            />}
            <Input label='Password'
              placeholder='Password'
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              leftIcon={this.state.isPassVerify === undefined ? { type: 'feather', name: 'lock', color: '#fff' } : this.state.isPassVerify.isV ? { type: 'feather', name: 'lock', color: '#31F049' } : { type: 'feather', name: 'lock', color: '#FA2F12', onPress: () => this.setState({ overlayIsVisible: true, currentMessage: this.state.isPassVerify.message }) }}
              secureTextEntry={true}
              onChangeText={password => { this.setState({ password }); this.verifyPass(password); this.state.password2 !== "" ? this.verifyPassMatch(password, this.state.password2) : null }}
            />
            <BarPasswordStrengthDisplay
              password={this.state.password}
            />
            <Input label='Verify Password'
              placeholder='Verify Password'
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: '#fff' }}
              containerStyle={{ flex: 0.2, width: '95%', marginTop: 15 }}
              inputStyle={{ color: '#fff' }}
              leftIcon={this.state.isPassMatchVerify === undefined || this.state.password2 === '' ? { type: 'feather', name: 'unlock', color: '#fff' } : this.state.isPassMatchVerify.isV ? { type: 'feather', name: 'unlock', color: '#31F049' } : { type: 'feather', name: 'unlock', color: '#FA2F12', onPress: () => this.setState({ overlayIsVisible: true, currentMessage: this.state.isPassMatchVerify.message }) }}
              secureTextEntry={true}
              onChangeText={password2 => {
                this.setState({ password2 }); this.verifyPassMatch(this.state.password, password2)
              }}
            />
            <View style={{ flex: 0.15, flexDirection: 'row' }}>
              <CheckBox
                title='female'
                iconRight={I18nManager.isRTL ? true : false}
                checked={this.state.gender === 'female'}
                onPress={() => this.toogleGender('female')}
                containerStyle={{ backgroundColor: '#434343' }}
                textStyle={{ color: 'white' }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='pink'

              />

              <CheckBox
                title='male'
                iconRight={I18nManager.isRTL ? true : false}
                checked={this.state.gender === 'male'}
                onPress={() => this.toogleGender('male')}
                containerStyle={{ backgroundColor: '#434343' }}
                textStyle={{ color: 'white' }}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor='lightblue'
              />
            </View>
            {/* {this.state.picUrl !== '' ? <Image
              style={{ width: 120, height: 120, borderRadius: 120 / 2 }}
              source={{ uri: this.state.picUrl }}
            /> : <View style={{ width: 120, height: 120 }} />} */}
            <View style={{ width: 120, height: 120 }} />
            <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 15 }}>
              <Button title='Sign Up' type='solid' onPress={this.signUp} />
              <Button title='Cancle' type='clear' onPress={this.signUpCancle} />
            </View>
          </View>
        }
        {this.state.signUp ? null :
          <View style={{ flex: 0.5, width: '95%', alignSelf: 'center', borderTopColor: 'lightgrey', justifyContent: 'center', borderTopWidth: 1 }} >

            <Button title='Login with Facebook' containerStyle={{ width: 200, alignSelf: 'center' }} icon={{ type: 'antdesign', name: 'facebook-square', color: '#fff' }} type='solid' onPress={this.FacebookLogin} />

          </View>}
        {/* <Button onPress={this.signInWithGoogleAsync} title='g'/> */}
        <MyAlert title='Oops!' body={this.state.currentMessage} overlayFalse={this.overlayFalse} overlayIsVisible={this.state.overlayIsVisible} />

      </StaticC>

    );
  }
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#434343',
//     },
//   });
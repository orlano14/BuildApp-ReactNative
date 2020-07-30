import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, AsyncStorage, Picker } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, CheckBox, Icon, Button } from 'react-native-elements';
import Moment from 'moment';
import SimpleReactValidator from 'simple-react-validator';
import RequestToPush from '../Classes/RequestToPush';
import PreloaderC from './PreloaderC';
import serverURL from '../assets/serverURL';




class NewRequestC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: this.props.type,
      showDPikckerfrom: false,
      showTPikckerfrom: false,
      forPay: false,
      preloader: false
    }
    this.validator = new SimpleReactValidator();
    this.apiUrl = serverURL+'/api/';

  }
  componentDidUpdate = () => {
    this.state.currentType !== this.props.type && this.ClearState()
  }
  componentDidMount = () => {
    this.fetchGetSkills();

  }
  ClearState = () => {
    this.setState({
      currentType: this.props.type,
      fromD: undefined,
      fromT: undefined,
      long: undefined,
      note: undefined,
      showDPikckerfrom: false,
      showTPikckerfrom: false,
      forPay: false
    })
    this.validator.hideMessages()
  }
  GetSelfUserName = async () => {
    try {
      let u = JSON.parse(await AsyncStorage.getItem('MyUser'));
      console.log(u);
      if (u !== null) {
        return u.userName;
      }
    } catch (error) {
      console.log("Error geting AsyncStorege");
    }

  }
  RequestsUpdatedAsyncStorage = async () => {
    await AsyncStorage.setItem("requestsUpdated", '1');
  }
  fetchGetSkills = () => {
    fetch(this.apiUrl + "skill", {
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
          this.setState({
            skillsArr: result,
            selectedSkill: result[0]
          })
        },
        (error) => {
          console.log("err post=", error);
        });
  }
  FetchAddRequest = (r) => {
    this.setState({ preloader: true })
    fetch(this.apiUrl + "Request/AddRequest", {
      method: 'POST',
      body: JSON.stringify(r),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      })

    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          if (result === "ok") {
            this.setState({ preloader: true })
            this.RequestsUpdatedAsyncStorage().then(() => { this.props.navigateHome() })
            this.setState({ preloader: false })
          }
        },
        (error) => {
          console.log("err post=", error);
        });

  }
  ValidateRequest = async () => {

    if (this.validator.allValid()) {
      let r = new RequestToPush(
        (await this.GetSelfUserName()),
        this.props.type,
        Moment(this.state.fromD).format('YYYY-MM-DD') + 'T' + Moment(this.state.fromT).format('HH:mm') + ':00.000Z',
        this.state.note ? this.state.note : '',
        this.state.forPay,
        this.state.long ? this.state.long : 0,
        this.props.type === 'skill' ? this.state.selectedSkill.SkillName : null);

      console.log(r);

      this.ClearState();
      this.FetchAddRequest(r);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    return (
      this.state.preloader ?
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
          <PreloaderC />
        </View> :
        <View style={styles.container}>
          <Text style={{ flex: 0.15, fontSize: 20, fontWeight: 'bold', color: "#fff" }}>{this.props.type}</Text>
          {this.props.type === 'skill' &&
            <View style={styles.skillView}>
              <Text style={{ flex: 0.3, fontSize: 16, fontWeight: 'bold', color: "#fff" }}>Which?</Text>
              <View style={styles.pikerView}>
                <Picker
                  selectedValue={this.state.selectedSkill}
                  style={{
                    height: 50,
                    width: '70%',
                    color: '#fff'
                  }}
                  mode='dropdown'
                  onValueChange={(itemValue, itemIndex) => this.setState({ selectedSkill: itemValue })}
                >
                  {this.state.skillsArr && this.state.skillsArr.map(s => <Picker.Item label={s.SkillName} key={s.SkillNum} value={s} />)}
                </Picker>
                <Icon type='ionicon' name='ios-arrow-down' color='#fff' containerStyle={{ padding: 10 }} />
              </View></View>}
          <View style={styles.dateView}>
            <Input label='When?'
              placeholder=' DD/MM/YYYY'
              value={this.state.fromD !== undefined ? Moment(this.state.fromD).format('DD/MM/YYYY') : null}
              labelStyle={{ color: '#fff' }}
              inputStyle={{ color: '#fff' }}
              containerStyle={{ flex: 0.5, justifyContent: 'center' }}
              leftIcon={{ type: 'materialIcons', name: 'today', color: '#fff' }}
              onFocus={() => { this.setState({ showDPikckerfrom: true }) }}
              onChange={() => { this.setState({ showDPikckerfrom: true }) }}
              errorMessage={this.validator.message('date', this.state.fromD, 'required')}
            />
            {this.state.showDPikckerfrom && <DateTimePicker
              testID="dateTimePicker"
              value={new Date()}
              timeZoneOffsetInMinutes={0}
              minimumDate={new Date()}
              mode='date'
              is24Hour={true}
              display="spinner"
              onChange={(event, date) => {
                event.type === 'set' ? this.setState({
                  fromD: Moment(date).startOf('day'),
                  showDPikckerfrom: false
                }) :
                  this.setState({
                    showDPikckerfrom: false
                  })
              }}
            />}
            <Input
              placeholder=' HH:MM'
              value={this.state.fromT !== undefined ? Moment(this.state.fromT).format('HH:mm') : null}
              inputStyle={{ color: '#fff' }}
              containerStyle={{ flex: 0.5, justifyContent: 'center' }}
              leftIcon={{ type: 'feather', name: 'clock', color: '#fff' }}
              onFocus={() => { this.setState({ showTPikckerfrom: true }) }}
              onChange={() => { this.setState({ showTPikckerfrom: true }) }}
              errorMessage={this.validator.message('time', this.state.fromT, 'required')}
            />
            {this.state.showTPikckerfrom && <DateTimePicker
              testID="dateTimePicker"
              value={this.state.fromT === undefined ? new Date() : this.state.fromT}
              timeZoneOffsetInMinutes={0}
              minimumDate={this.state.fromD === undefined ? new Date() : this.state.fromD}
              mode='time'
              is24Hour={true}
              display="spinner"
              onChange={(event, date) => {
                event.type === 'set' ? this.setState({
                  fromT: date,
                  showTPikckerfrom: false
                }) :
                  this.setState({
                    showTPikckerfrom: false
                  })
              }}
            />}
          </View>
          {this.props.type !== 'carpool' && <Input label='For how long?'
            placeholder=' hours'
            value={this.state.long}
            labelStyle={{ color: '#fff' }}
            inputStyle={{ color: '#fff' }}
            containerStyle={{ flex: 0.2, justifyContent: 'center' }}
            onChangeText={long => this.setState({ long })}
            leftIcon={{ type: 'ionicon', name: 'ios-timer', color: '#fff' }}
          />}
          <Input label={this.props.type === 'carpool' ? 'To' : 'Note'}
            placeholder=' ...'
            value={this.state.note}
            labelStyle={{ color: '#fff' }}
            inputStyle={{ color: '#fff' }}
            onChangeText={note => this.setState({ note })}
            leftIcon={{ type: 'simple-line-icon', name: 'note', color: '#fff' }}
          />
          <CheckBox
            title='Ready to pay'
            checked={this.state.forPay}
            onPress={() => this.setState({ forPay: !this.state.forPay })}
            containerStyle={{ backgroundColor: 'transparent' }}
            textStyle={{ color: '#fff' }}
            checkedIcon={<Icon type='foundation' name='dollar' color='#31F049' />}

          />
          <Button title='Send' type='solid' onPress={this.ValidateRequest} />

        </View>
    );
  }

}
const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  dateView: { flex: 0.3, width: '100%', flexDirection: 'column', justifyContent: 'space-evenly', paddingVertical: 20 },
  skillView: { flex: 0.2, width: '90%', flexDirection: 'column', justifyContent: 'space-evenly' },
  pikerView: { flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: '#fff', borderRadius: 5 }
});

export default NewRequestC;
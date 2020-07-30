import React, { Component } from 'react';
import StaticC from '../Components/StaticC';
import { View, StyleSheet, Text, Alert, TextInput, Image, AsyncStorage, SafeAreaView, ScrollView, I18nManager } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import MyAlert from '../Components/MyAlert';
import AddBuildingC from '../Components/AddBuildingC';
import SettingsC from '../Components/SettingsC';
import ButtonGroupC from '../Components/ButtonGroupC';
import UserSettings from '../Classes/UserSettings';
import serverURL from '../assets/serverURL';



export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addBuildingMode: false,
            myAlert: { overlayIsVisible: false },
            babysitter: false,
            dogwalker: false,
            carpool: false,
            groceries: false,
            availability: false,
            skills: [],
            buildingCodeVal: null,
            addSkillMode: false
        }
        this.apiUrl = serverURL+'/api/';

    }
    componentDidMount = async () => {
        this.fetchGetSkills()
        try {
            let s = JSON.parse(await AsyncStorage.getItem('Settings'));
            if (s !== null) {
                let uia = JSON.parse(await AsyncStorage.getItem('UserInAddress'));
                let bC = JSON.parse(await AsyncStorage.getItem('BuildingCode'));
                s.skills.forEach((sk)=>{this.SkillSelected(sk.SkillNum)})
                this.setState({
                    buildingCodeVal: bC,
                    floorNum: uia.floor,
                    apartmentNum: uia.apartment,
                    phoneNum: uia.phoneNum,
                    babysitter: s.babysitter,
                    dogwalker: s.dogwalker,
                    carpool: s.carpool,
                    groceries: s.groceries,
                    availability: s.availability,
                })
                this.fetchIsBuildingCodeExist()
            }
        } catch (error) {
            console.log("Error geting AsyncStorege");
        }

    }
    GetSelfUserName = async () => {
        try {
            let u = JSON.parse(await AsyncStorage.getItem('MyUser'));            
            if (u !== null) {
                return u.userName;
            }
        } catch (error) {
            console.log("Error geting AsyncStorege");
        }

    }
    SetSettingsToAsyncStorege = async (s) => {
        
        try {
            await AsyncStorage.setItem('Settings', JSON.stringify(s));
        } catch (error) {
            console.log('Error saving data AsyncStorege');
        }
    }
    SetUserInAddressToAsyncStorege = async (uia) => {
        try {
            await AsyncStorage.setItem('UserInAddress', JSON.stringify(uia));
            await AsyncStorage.setItem('BuildingCode', JSON.stringify(this.state.buildingCodeVal));
        } catch (error) {
            console.log('Error saving data AsyncStorege');
        }
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
                        skillsArr: result
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    fetchAddUserInAddress = async () => {
        let uia = { userName: (await this.GetSelfUserName()), floor: this.state.floorNum, apartment: this.state.apartmentNum, phoneNum: this.state.phoneNum }
        this.SetUserInAddressToAsyncStorege(uia)
        fetch(this.apiUrl + "UserInAddress/AddUserInAddress/" + this.state.buildingCodeVal, {
            method: 'POST',
            body: JSON.stringify(uia),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })

        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log("uia= ", result);

                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    fetchAddUserSettings = async (s) => {
        this.SetSettingsToAsyncStorege(s);
        fetch(this.apiUrl + "Settings/addSettings", {
            method: 'POST',
            body: JSON.stringify(s),
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            })

        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log('s - ', result);

                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    fetchIsBuildingCodeExist = () => {
        fetch(this.apiUrl + "Address/IsAddressIdExist/" + this.state.buildingCodeVal, {
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
                    result ? this.setState({
                        buildingCode: { isV: true }
                    })
                        :
                        this.setState({
                            buildingCode: { isV: false, message: 'Building code does not exist. try again or add your building' }
                        })
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    overlayFalse = () => {
        this.setState({ myAlert: { overlayIsVisible: false } })
    }
    AddBuildingModeChange = () => {
        this.setState({
            addBuildingMode: this.state.addBuildingMode ? false : true
        })
    }
    BuildingAdded = (addressCode) => {
        this.setState({
            buildingCodeVal: addressCode,
            buildingCode: { isV: true }
        })
        this.AddBuildingModeChange();

    }
    BuildingAddCancled = () => {
        console.log('cancled');
        this.AddBuildingModeChange();
    }
    IsBuildingCodeExist = () => {
        this.fetchIsBuildingCodeExist()

    }

    SkillSelected = (e) => {
        let s = this.state.skills
        let { skillsArr } = this.state
        skillsArr.forEach(element => {

            if (element.SkillNum === e) {
                e = element;
            }

        });
        s.push(e)
        skillsArr = skillsArr.filter(s => s.SkillNum !== e.SkillNum);
        this.setState({
            skills: s,
            skillsArr: skillsArr
        })

        // this.props.changeStateForSetting(skillsArr.filter(s=>s.))



    }
    IndexRemoved = (e) => {
        let s = this.state.skills
        let { skillsArr } = this.state
        s.forEach(element => {

            if (element.SkillNum === e) {
                e = element;
            }

        });
        skillsArr.push(e)
        s = s.filter(s => s.SkillNum !== e.SkillNum);
        this.setState({
            skills: s,
            skillsArr: skillsArr
        })

    }
    SaveSettings = () => {
        let m = '';
        let isV = true
        m += this.state.buildingCode !== undefined ? !this.state.buildingCode.isV ? this.state.buildingCode.message + '\n' : '' : 'Building Code - field is required' + '\n'
        this.state.buildingCode === undefined ? (isV = false) : !this.state.buildingCode.isV && (isV = false)
        m += this.state.floorNum === undefined ? 'Floor Number - field is required\n' : this.state.floorNum === '' ? 'Floor Number - Not an integer! Try again.\n' : ''
        this.state.floorNum === undefined ? (isV = false) : !this.state.floorNum === '' && (isV = false)
        m += this.state.apartmentNum === undefined ? 'Apartment Number - field is required\n' : this.state.apartmentNum === '' ? 'Apartment Number - Not an integer! Try again.' + '\n' : ''
        this.state.apartmentNum === undefined ? (isV = false) : !this.state.apartmentNum === '' && (isV = false)
        m += this.state.phoneNum === undefined ? 'Phone Number - field is required\n' : this.state.phoneNum.length < 9 ? 'Phone Number - minimum 9 digits.\n' : this.state.phoneNum.length > 10 ? 'Phone Number - maximun 10 digits.\n' : ''
        this.state.phoneNum === undefined ? (isV = false) : this.state.phoneNum.length < 9 ? (isV = false) : this.state.phoneNum.length > 10 && (isV = false)

        isV ?
            this.SaveConfirmedSettings()
            : this.setState({ myAlert: { overlayIsVisible: true, message: m } })
    }
    SaveConfirmedSettings = async() => {
        this.fetchAddUserInAddress()
        let s = new UserSettings((await this.GetSelfUserName()), this.state.babysitter, this.state.dogwalker, this.state.carpool, this.state.groceries, this.state.availability, this.state.skills)
        this.fetchAddUserSettings(s)
        this.SetSettingsToAsyncStorege(s)
        this.props.navigation.navigate('MainApp')
    }
    render() {
        return (
            <StaticC>
                <MyAlert title={this.state.myAlert.title === undefined ? 'Oops!' : this.state.myAlert.title} body={this.state.myAlert.message} overlayFalse={this.overlayFalse} overlayIsVisible={this.state.myAlert.overlayIsVisible} />
                {this.state.addBuildingMode ?
                    <AddBuildingC buildingAdded={(code) => this.BuildingAdded(code)} buildingAddCancled={this.BuildingAddCancled} />
                    :
                    <SafeAreaView style={styles.safeAreaView}>
                        <ScrollView style={styles.scrollView} ref="scrollView" onContentSizeChange={(width, height) => this.state.addSkillMode && this.refs.scrollView.scrollTo({ y: height })}>
                            <View style={{ height: 200, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Input label='Building Code'
                                    placeholder='B1234'
                                    value={this.state.buildingCodeVal}
                                    labelStyle={{ color: '#fff' }}
                                    inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
                                    placeholderTextColor='grey'
                                    containerStyle={{ flex: 0.1, width: '95%' }}
                                    inputStyle={{ color: '#fff' }}
                                    leftIcon={{ type: 'material-community', name: 'barcode', color: this.state.buildingCode === undefined ? '#fff' : this.state.buildingCode.isV ? '#31F049' : '#FA2F12', onPress: () => this.state.buildingCode !== undefined && !this.state.buildingCode.isV && this.setState({ myAlert: { overlayIsVisible: true, message: this.state.buildingCode.message } }) }}
                                    rightIcon={this.state.buildingCode !== undefined && this.state.buildingCode.isV && { type: 'material-community', name: 'check', color: '#31F049' }}
                                    onChangeText={buildingCodeVal => this.setState({ buildingCodeVal })}
                                    onEndEditing={this.IsBuildingCodeExist}
                                />
                                <View>
                                    <Text style={{ color: '#fff', alignSelf: "center" }}>Don't have code yet? </Text>
                                    <Button containerStyle={{ alignSelf: "center" }} title='Add new Building' type='clear' onPress={this.AddBuildingModeChange} />
                                </View>
                            </View>
                            <Input label='Floor Number'
                                placeholder='number of your floor'
                                value={this.state.floorNum}
                                labelStyle={{ color: '#fff' }}
                                inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
                                placeholderTextColor='grey'
                                containerStyle={{ flex: 0.1, width: '95%', alignSelf: "center" }}
                                inputStyle={{ color: '#fff' }}
                                leftIcon={{ type: 'material-community', name: 'office-building', color: this.state.floorNum === undefined ? '#fff' : this.state.floorNum.length > 0 ? '#31F049' : '#FA2F12', onPress: () => this.state.floorNum !== undefined && this.state.floorNum.length === 0 && this.setState({ myAlert: { overlayIsVisible: true, message: 'Not an integer! Try again.' } }) }}
                                rightIcon={this.state.floorNum !== undefined && this.state.floorNum.length > 0 && { type: 'material-community', name: 'check', color: '#31F049' }}
                                onChangeText={floorNum => { !isNaN(floorNum) ? this.setState({ floorNum }) : this.setState({ floorNum: '' }) }}
                            />
                            <Input label='Apartment Number'
                                placeholder='number of your apartment'
                                value={this.state.apartmentNum}
                                labelStyle={{ color: '#fff' }}
                                inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
                                placeholderTextColor='grey'
                                containerStyle={{ flex: 0.1, width: '95%', alignSelf: "center" }}
                                inputStyle={{ color: '#fff' }}
                                leftIcon={{ type: 'material-community', name: 'home-floor-a', color: this.state.apartmentNum === undefined ? '#fff' : this.state.apartmentNum.length > 0 ? '#31F049' : '#FA2F12', onPress: () => this.state.apartmentNum !== undefined && this.state.apartmentNum.length === 0 && this.setState({ myAlert: { overlayIsVisible: true, message: 'Not an integer! Try again.' } }) }}
                                rightIcon={this.state.apartmentNum !== undefined && this.state.apartmentNum.length > 0 && { type: 'material-community', name: 'check', color: '#31F049' }}
                                onChangeText={apartmentNum => !isNaN(apartmentNum) ? this.setState({ apartmentNum }) : this.setState({ apartmentNum: '' })}
                            />
                            <Input label='Phone Number'
                                placeholder='phone number'
                                value={this.state.phoneNum}
                                labelStyle={{ color: '#fff' }}
                                inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
                                placeholderTextColor='grey'
                                containerStyle={{ flex: 0.1, width: '95%', alignSelf: "center" }}
                                inputStyle={{ color: '#fff' }}
                                leftIcon={{ type: 'material-community', name: 'phone', color: this.state.phoneNum === undefined ? '#fff' : this.state.phoneNum.length <= 8 ? '#fff' : this.state.phoneNum.length < 11 ? '#31F049' : '#FA2F12', onPress: () => this.setState({ myAlert: { overlayIsVisible: true, message: 'too long.\nfor example: 0541234567', title: 'Info' } }) }}
                                rightIcon={this.state.phoneNum !== undefined && this.state.phoneNum.length > 8 && this.state.phoneNum.length < 11 && { type: 'material-community', name: 'check', color: '#31F049' }}
                                onChangeText={phoneNum => { !isNaN(phoneNum) ? this.setState({ phoneNum: phoneNum }) : this.setState({ phoneNum: this.state.phoneNum === undefined ? '' : this.state.phoneNum }) }}
                            />
                            <View style={{ flex: 1, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignSelf: "center", paddingTop: 20 }}>
                                <Text style={{ flex: 0.2, paddingTop: 9, color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Services</Text>
                                <View style={{ flex: 0.75, height: 5, borderBottomWidth: 0.3, borderBottomColor: 'lightgrey', paddingTop: 20 }}></View>
                            </View>
                            <SettingsC title='Babysitter' body='Would you like to help your neighbors with babysitting' iconSource={require('../assets/babysitter.png')} value={this.state.babysitter} changeStateForSetting={v => this.setState({ babysitter: v })} />
                            <SettingsC title='Dogwalker' body='Would you like to help your neighbors with dog walking' iconSource={require('../assets/dogwalker.png')} value={this.state.dogwalker} changeStateForSetting={v => this.setState({ dogwalker: v })} />
                            <SettingsC title='Carpool' body='Would you like to help your neighbors with carpool' iconSource={require('../assets/carpool.png')} value={this.state.carpool} changeStateForSetting={v => this.setState({ carpool: v })} />
                            <SettingsC title='Groceries' body='Would you like to help your neighbors if they need some groceries' iconSource={require('../assets/groceries.png')} value={this.state.groceries} changeStateForSetting={v => this.setState({ groceries: v })} />
                            <SettingsC title='Availability' body='Would you like to help your neighbors with availability for example to delivery' iconSource={require('../assets/availability.png')} value={this.state.availability} changeStateForSetting={v => this.setState({ availability: v })} />
                            <SettingsC title='Skills' body='Choose the skills you would like to share with your neighbors' addSkillModeChange={() => this.setState({ addSkillMode: this.state.addSkillMode ? false : true })} iconSource={require('../assets/skills.png')} indexRemoved={e => { this.IndexRemoved(e) }} indexSelected={e => { this.SkillSelected(e) }} skills={this.state.skills} skillsArr={this.state.skillsArr} />

                            <View style={{ width: '50%', alignSelf: 'center', marginTop: 20, marginBottom: 70 }}>

                                <Button title='Save' type='solid' onPress={this.SaveSettings} />
                            </View>


                        </ScrollView>
                    </SafeAreaView>
                }
            </StaticC>
        );
    }
}
const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: '100%',
        alignSelf: 'center'

        //marginTop: Constants.statusBarHeight,
    },
    scrollView: {


    },
});


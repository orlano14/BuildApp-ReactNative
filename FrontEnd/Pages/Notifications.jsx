import React, { Component } from 'react';
import { Button, Overlay, Avatar, Icon } from 'react-native-elements';
import StaticC from '../Components/StaticC';
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView,RefreshControl,AsyncStorage} from 'react-native';
import { Dimensions } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import Constants from 'expo-constants';
import serverURL from '../assets/serverURL';


export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSections: [],
            refreshing:false
        }
        this.apiUrl = serverURL+'/api/';
        this.notifications=[]
    }
    componentDidMount=()=>{
        this.FetchGetSkills()
        this.FetchGetNotifications()
    }
    componentDidUpdate=()=>{
        
        this.notifications.length===0&&this.FetchGetNotifications()
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
    FetchGetSkills = () => {
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
                    this.skillsArr= result            
                },
                (error) => {
                    console.log("err post=", error);
                });
    }
    FetchGetNotifications=async()=>{
        let selfUserName = (await this.GetSelfUserName());
        fetch(this.apiUrl + 'Notification/GetNotifications/' + selfUserName, {
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
                    result=result.map((n,i)=>{i===0?n.isTop=true:n.isTop=false;
                    return n});                                  
                    this.notifications = result
                    this.forceUpdate();
                },
                (error) => {
                    console.log("err post=", error);
                });


    }
    FetchSawAllNotification = async() => {
        let selfUserName = (await this.GetSelfUserName());
        fetch(this.apiUrl + 'Status/SawAllNotification/' + selfUserName, {
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
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });


    }
    FetchAcceptRequest=async(requestSerialNum)=>{
        let selfUserName = (await this.GetSelfUserName());
        fetch(this.apiUrl + 'Status/AcceptRequest/' + selfUserName+'/'+requestSerialNum, {
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
                    console.log(result);
                },
                (error) => {
                    console.log("err post=", error);
                });

    }
    GetSkillNameByNum=(num)=>{
        let name;
        this.skillsArr.forEach(s => {
            s.SkillNum===num&&(name= s.SkillName)
        });        
        return name
    }
    GetRequestIcon = (type) => {

        let icon;
        switch (type) {
            case 'babysitter':
                icon = require('../assets/babysitter.png')
                break;
            case 'dogwalker':
                icon = require('../assets/dogwalker.png')
                break;
            case 'carpool':
                icon = require('../assets/carpool.png')
                break;
            case 'groceries':
                icon = require('../assets/groceries.png')
                break;
            case 'availability':
                icon = require('../assets/availability.png')
                break;
            case 'skill':
                icon = require('../assets/skills.png')
                break;
        }
        return icon
    }
    GetAge = (DOB) => {
        var today = new Date();
        var birthDate = new Date(DOB);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age = age - 1;
        }

        return age;
    }
    UpdateSeen=(activeSections)=>{
        let n=this.notifications
        if(n[activeSections].Seen===2){
            n[activeSections].Seen=1;
        }    
        this.notifications=n;
    }
    onRefresh = async() => {
        this.setState({refreshing: true});
        await this.FetchGetNotifications();
        this.setState({refreshing: false});
      }
    _renderHeader = (section) => {

          return (
              <View style={[styles.row,section.Seen===2?{backgroundColor:'#aaa'}:section.Seen===3&&{backgroundColor:"rgba(190, 220, 190, 1)"}]}>
                <View style={styles.requestD}>
                    <Image source={this.GetRequestIcon(section.Req.Type)} style={{ height: 40, width: 40, alignSelf: 'center', borderRadius: 40 / 4.5, marginRight: 15 }} />
                    <Text style={styles.headerText}>{moment(section.Req.DueDate).format('HH:mm DD/MM/YYYY')}</Text>
                </View>
                {section.IsTop&&<Icon name='crown' type='material-community' color={'#FFB718'} size={25} containerStyle={{top:'-2%',right:'34%',position:'absolute'}}/>}
                <Icon type='antdesign' name='plus' size={10} containerStyle={{flex:0.05,alignSelf:'flex-end',top:5,right:5}}/>
                <View style={styles.userToShowD}>

                        <View style={styles.Uleft}>
                            <Avatar
                                rounded
                                size="medium"
                                source={{
                                    uri: section.Uts.PicUrl
                                }}
                            />                        
                            </View>
                        <View style={styles.Uright}>
                            <Text style={{  fontSize: 13, fontWeight: 'bold' }}>{section.Uts.FirstName + ' ' + section.Uts.LastName}</Text>
                            <Text style={{ fontSize: 11 }}>{section.Uts.Gender} , {this.GetAge(section.Uts.Birthday)}</Text>
                        </View>
                </View>

            </View>
        );
    };

    _renderContent = (section) => {
        let s='';
        s+=`${section.Uts.FirstName} ${section.Uts.LastName} is looking for ${section.Req.Type==='skill'?this.GetSkillNameByNum(section.Req.SkillNum):section.Req.Type} services `;
        s+=moment(section.Req.DueDate).subtract(-(new Date()).getTimezoneOffset() / 60, 'hours').fromNow()+' from now'
        section.Req.Type==='carpool'&&(s+=' to '+section.Req.Note)
        s+=section.Req.RequestLong>0?` for ${section.Req.RequestLong} hours.`:'.'
        section.Req.IsItPaid&&(s+=` ${section.Uts.Gender==='male'?'He':'She'} is ready to pay for this service.`)       
        section.Req.Note!==''&&section.Req.Type!=='carpool'&&(s+='\n\nNote:\n'+section.Req.Note) 
        
        return (
            <View style={styles.content}>
                <Text>
                    {s}
                </Text>
                {section.Seen!==3&&<Button title="ACCEPT" type='solid' 
                buttonStyle={{ borderColor: '#00aa00',backgroundColor:'#00aa00' }} 
                containerStyle={{width:'50%',alignSelf:'center',marginTop:20}}
                onPress={async() => {
                    this.setState({ activeSections: [] });
                    this.props.off();
                    await this.FetchAcceptRequest(section.Req.SerialNum);
                    await this.FetchSawAllNotification()
                    this.FetchGetNotifications()
                    }} />}
            </View>
        );
    };

    _updateSections = (activeSections) => {
        activeSections.length>0&&this.UpdateSeen(activeSections[0])
        
        this.setState({ activeSections });
    };
    render() {        
        return (
            <Overlay
                isVisible={this.props.isNotificationMode}
                onBackdropPress={async() => {
                    this.setState({ activeSections: [] });
                    this.props.off();
                    await this.FetchSawAllNotification()
                    this.notifications=[]
                    
                }}
                windowBackgroundColor="rgba(100, 100, 100, 0.9)"
                overlayBackgroundColor="rgba(220, 220, 220, 1)"
                borderRadius={20}
                width="auto"
                height="70%"
            >
                <View style={styles.container}>
                    <SafeAreaView style={styles.safeAreaView}>
                        <ScrollView style={styles.scrollView} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
                            {this.notifications.length===0&&<Text style={{fontSize:20,fontWeight:'bold',padding:40,alignSelf:'center'}}>empty...</Text>}
                    <Accordion
                        sections={this.notifications}
                        activeSections={this.state.activeSections}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                        containerStyle={{ width: '100%', height: '100%' }}
                    />
                    </ScrollView>
                    </SafeAreaView>
                </View>
            </Overlay>
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
    container: {
        flex: 1, width: Dimensions.get('window').width - 50, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    },
    row: {
        width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10,padding:10, borderColor: '#ccc', borderWidth: 2,borderRadius:100/10
    },
    content: {
        width: '100%', alignSelf: 'center', padding: 20, borderBottomColor: '#ccc', borderBottomWidth: 2
    },
    requestD: {
        flex: 0.5, height: '100%', flexDirection: 'row', alignItems: 'center', paddingRight: 5,
    },
    userToShowD: {
        flex: 0.45, height: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 5

    },
    headerText: {
        fontSize: 12, fontWeight: 'bold'
    },
    Uheader: { flex: 0.7, flexDirection: 'row', justifyContent: 'flex-end' },
    Uright: { flex: 0.6, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    Uleft: { flex: 0.4, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center' },


});

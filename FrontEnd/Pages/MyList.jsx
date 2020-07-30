import React, { Component } from 'react';
import { Overlay, Avatar, Icon ,AirbnbRating, Button} from 'react-native-elements';
import { StyleSheet, View, Text, Image, SafeAreaView, ScrollView,RefreshControl,AsyncStorage} from 'react-native';
import { Dimensions } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import moment from 'moment';
import PhoneC from '../Components/PhoneC';
import { ThemeProvider } from '@react-navigation/native';
import serverURL from '../assets/serverURL';


export default class MyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSectionsT: [],
            activeSectionsR: [],
            activeSectionsH: [],
            copyNum:'',
            copyOverlay:false,
            refreshing:false
        }
        this.apiUrl = serverURL+'/api/';
    }
    componentDidMount=()=>{
        this.FetchGetSkills()
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
    saveRank=()=>{
        fetch(this.apiUrl + `Rank/PostRank/${this.state.rank.requestId}/${this.state.rank.rate}`, {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            })
          })
            .then(res => {
              return res.json()
            })
            .then(
              async(result) => {
                this.setState({activeSectionsH: []})
                await this.onRefresh();
                console.log('rank saved '+result);
              },
              (error) => {
                console.log("err post=", error);
              });
    }
    onRefresh = async() => {
        this.setState({refreshing: true});
        await this.props.updateMyList();
        this.setState({refreshing: false});
      }
      _renderHeader = (section,type) => {
          return (
              <View style={[styles.row,
                type==='T'?{backgroundColor:"rgba(220, 190, 190, 1)"}:
                type==='R'?section.Ud.UserName?{backgroundColor:"rgba(190, 220, 190, 1)"}:{backgroundColor:"rgba(190, 190, 220, 1)"}:
                type==='H'&&section.IsRequest?{backgroundColor:"rgba(190, 220, 190, 1)"}:{backgroundColor:"rgba(220, 190, 190, 1)"}]}>
                <View style={styles.requestD}>
                    <Image source={this.GetRequestIcon(section.Req.Type)} style={{ height: 40, width: 40, alignSelf: 'center', borderRadius: 40 / 4.5, marginRight: 15 }} />
                    <Text style={styles.headerText}>{moment(section.Req.DueDate).format('HH:mm DD/MM/YYYY')}</Text>
                </View>
                {type!='H'&&<Icon type='antdesign' name='plus' size={10} containerStyle={{flex:0.05,alignSelf:'flex-end',top:5,right:5}}/>}                
                {type==='H'&&section.IsRequest&&section.Ud.UserName&&section.IsRated===false&&<Icon type='ionicons' name='star' size={15} color='#FFB718' containerStyle={{flex:0.05,alignSelf:'flex-end',top:5,right:5}}/>}
                {section.Ud.UserName?<View style={styles.userToShowD}>
                        <View style={styles.Uleft}>
                            <Avatar
                                rounded
                                size="medium"
                                source={{
                                    uri: section.Ud.PicUrl
                                }}
                            />                        
                            </View>
                        <View style={styles.Uright}>
                            <Text style={{  fontSize: 13, fontWeight: 'bold' }}>{section.Ud.FirstName + ' ' + section.Ud.LastName}</Text>
                            <Text style={{ fontSize: 11 }}>{section.Ud.Gender} , {this.GetAge(section.Ud.Birthday)}</Text>
                        </View>
                </View>:
                type==='R'?
                <Text style={[styles.userToShowD,{textAlign:'center',height:'auto'}]}>Waiting for a neighbor..</Text>
                :
                <Text style={[styles.userToShowD,{textAlign:'center',height:'auto'}]}>Wasn't confirmed</Text>}

            </View>
        );
    }
    _renderContent = (section,type) => {
        let s='';
        switch (type) {
            case 'T':
                s+=`${section.Ud.FirstName} ${section.Ud.LastName} got your phone number and will contact you. \n`;
                s+=`You can also contact him: \n`;
                
                break;
            case 'R':
                if(section.Ud.UserName){
                s+=`${section.Ud.FirstName} ${section.Ud.LastName} confirmed your request. \n`;
                s+=`You can contact him: \n`;
            }else{
                s+='waiting...' 
            }
                break;
            case 'H':
                
                break;
            default:
                break;
        }
        return (
            <View style={styles.content}>
                {type !== 'H'&&<Text>
                    {s}
                </Text>}
                {type !== 'H'&&section.Ud.UserName &&
                <PhoneC phoneNum={section.Ud.PhoneNum}/>}
                {type === 'H'&&section.IsRequest&&section.Ud.UserName&&
                <AirbnbRating
                 count={5}
                 reviews={["Terrible", "Bad","OK", "Very Good", "Wow!"]}
                 defaultRating={5}
                 size={30}
                 onFinishRating={(r)=>this.setState({rank:{rate:r,requestId:section.Req.SerialNum}})}
                />
            }
            {type === 'H'&&section.IsRequest&&section.Ud.UserName&&
            <Button title="Save" type='solid' 
            buttonStyle={{ borderColor: '#00aa00',backgroundColor:'#00aa00' }} 
            containerStyle={{width:'50%',alignSelf:'center',marginTop:20}}
            onPress={() => {
                this.saveRank()
                }} />
            }
                
            </View>
        );
    };

    _updateSections = (activeSections,type) => {  
        switch (type) {
            case 'T':
                this.setState({ activeSectionsT: activeSections });
                break;
            case 'R':
                this.setState({ activeSectionsR: activeSections });
                break;
                case 'H':
                // console.log(this.props.myList.History[activeSections].IsRated);
                activeSections.length!==0&&this.setState({rank:{rate:5,requestId:this.props.myList.History[activeSections].Req.SerialNum}})
                activeSections.length===0?this.setState({ activeSectionsH: activeSections }):
                this.props.myList.History[activeSections].IsRequest&&this.props.myList.History[activeSections].Ud.UserName&&this.props.myList.History[activeSections].IsRated===false&&this.setState({ activeSectionsH: activeSections });
                break;
            default:
                break;
        }      
    };
    render() {        
        return (
            <Overlay
                isVisible={this.props.isMyListMode}
                onBackdropPress={async() => {
                    this.setState({ activeSections: [] });
                    this.props.off();
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
                            {this.props.myList && <View>
                                <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 20, fontWeight: 'bold' }}>Tasks</Text>
                                {this.props.myList.Tasks.length!==0?<Accordion
                                    sections={this.props.myList.Tasks}
                                    activeSections={this.state.activeSectionsT}
                                    renderHeader={(c)=>this._renderHeader(c,'T')}
                                    renderContent={(c)=>this._renderContent(c,'T')}
                                    onChange={(s) => this._updateSections(s, 'T')}
                                    containerStyle={{ width: '100%' }}
                                />:
                                <Text style={{width:'100%',textAlign:'center',fontSize:15,padding:20,borderColor:'#000',borderRadius:5,borderWidth:1}}>empty...</Text>
                                }
                                <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 20, fontWeight: 'bold' }}>Requests</Text>
                                {this.props.myList.Requests.length!==0?<Accordion
                                    sections={this.props.myList.Requests}
                                    activeSections={this.state.activeSectionsR}
                                    renderHeader={(c)=>this._renderHeader(c,'R')}
                                    renderContent={(c)=>this._renderContent(c,'R')}
                                    onChange={(s) => this._updateSections(s, 'R')}
                                    containerStyle={{ width: '100%'}}
                                />:
                                <Text style={{width:'100%',textAlign:'center',fontSize:15,padding:20,borderColor:'#000',borderRadius:5,borderWidth:1}}>empty...</Text>
                                }
                                <Text style={{ alignSelf: 'center', marginTop: 15, fontSize: 20, fontWeight: 'bold' }}>History</Text>
                                {this.props.myList.History.length!==0?<Accordion
                                    sections={this.props.myList.History}
                                    activeSections={this.state.activeSectionsH}
                                    renderHeader={(c)=>this._renderHeader(c,'H')}
                                    renderContent={(c)=>this._renderContent(c,'H')}
                                    onChange={(s) => (this._updateSections(s, 'H'))}
                                    containerStyle={{ width: '100%'}}
                                />:
                                <Text style={{width:'100%',textAlign:'center',fontSize:15,padding:20,borderColor:'#000',borderRadius:5,borderWidth:1}}>empty...</Text>
                                }
                            </View>}
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
        width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10,padding:10, borderBottomColor: '#ccc', borderBottomWidth: 2,borderRadius:100/10
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

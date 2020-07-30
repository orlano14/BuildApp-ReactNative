import React, { Component } from 'react';
import StaticC from '../Components/StaticC';
import { View, Text, I18nManager, Image, TouchableOpacity, StyleSheet, AsyncStorage, SafeAreaView, Dimensions, RefreshControl } from 'react-native';
import Moment from 'moment';
import { Icon, Overlay, Badge } from 'react-native-elements';
import StatusBuildingC from '../Components/StatusBuildingC';
import Request from '../Classes/Request';
import RequestsTypesC from '../Components/RequsetsTypesC';
import Notifications from './Notifications';
import { ScrollView } from 'react-native-gesture-handler';
import MyList from './MyList';
import PhoneC from '../Components/PhoneC';
import PreloaderC from '../Components/PreloaderC';
import serverURL from '../assets/serverURL';

const { height } = Dimensions.get('window')

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userDetailsMode: false,
            isAddMode: false,
            isNotificationMode: false,
            isMyListMode: false,
            badgeNotification: 0,
            refreshing: false,
            buildingPreloader: false,
        }
        this.currentRequestDueDate = null
        this.apiUrl = serverURL+'/api/';
    }
    componentDidMount = () => {
        this.props.navigation.addListener('focus', async () => {
            this.RequestsUpdate()
        });
        this.RequestsUpdatedFalseAsyncStorage()
this.FetchGetRequestsAndFirstBuildingStatus()
this.FetchGetMyList()
    }
componentDidUpdate = () => {
    if (this.props.route.params !== undefined && this.props.route.params.notification !== undefined) {
        let n = this.props.route.params.notification;
        n.data.Type === "newRequest" &&
            this.NotificationsMode();

        if(n.data.Type === "acceptRequest"){
            this.state.requests.forEach((r,i) => {
                console.log(r.requestSerialNum,n.data.RequestSerialNum);
                if (r.requestSerialNum===n.data.RequestSerialNum) {
                    this.setState({
                        reqIndexToShow:i,
                        icon: this.GetRequestIcon(this.state.requests[i].type),
                        buildingPreloader: true
                    })
                    this.FetchGetRequestStatusBuilding(this.state.requests[i].requestSerialNum)
                }
            });
        }
        this.props.navigation.setParams({ notification: undefined })
    }
}
RequestsUpdatedFalseAsyncStorage = async () => {
    await AsyncStorage.setItem("requestsUpdated", '0');
}
RequestsUpdate = async () => {
    try {
        let isU = (await AsyncStorage.getItem("requestsUpdated"))
        if (isU === '1') {
            this.setState({ requests: undefined })
            await AsyncStorage.setItem("requestsUpdated", '0');
            this.FetchGetRequestsAndFirstBuildingStatus()
            this.FetchGetMyList()
        }
    }
    catch (error) {
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
FetchGetRequestsAndFirstBuildingStatus = async () => {
    let selfUserName = (await this.GetSelfUserName());
    this.FetchGetNumOfNotifications(selfUserName)
    fetch(this.apiUrl + 'Request/GetActiveRequestsByUserName/' + selfUserName, {
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
                if (result.length === 0) {
                    this.setState({ isAddMode: true, requests: [], statusBuilding: undefined, reqIndexToShow: 0 })
                }
                else {
                    let requests = [];
                    result.forEach(element => {
                        requests.push(new Request(element.SerialNum, element.AddressId, element.FromUserName, element.Type, Moment(element.DueDate), element.IsItPaid, element.Note, element.ExecutingUser, element.IsActive, element.skill))
                    });


                    this.setState({
                        isAddMode: false,
                        reqIndexToShow: 0,
                        icon: this.GetRequestIcon(requests[0].type),
                        requests: requests,
                    })
                    this.FetchGetRequestStatusBuilding(requests[0].requestSerialNum)
                }
            },
            (error) => {
                console.log("err GetActiveRequestsByUserName post=", error);
            });


}
FetchGetRequestStatusBuilding = (requestSerialNum) => {
    fetch(this.apiUrl + 'Status/GetRequestStatusBuildingByRequestId/' + requestSerialNum, {
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
                    statusBuilding: result,
                    buildingPreloader: false
                })

            },
            (error) => {
                console.log("err FetchGetRequestStatusBuilding post=", error);
            });
}
FetchGetApproverUserDetais = (userName) => {
    fetch(this.apiUrl + 'User/GetUserDetails/' + userName, {
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
                let ud = {
                    birthday: Moment(result.Birthday),
                    firstName: result.FirstName,
                    gender: result.Gender,
                    lastName: result.LastName,
                    picUrl: result.PicUrl,
                    phoneNum: result.PhoneNum
                }
                this.setState({
                    approverUserDetails: ud,
                    userDetailsMode: true
                })
            },
            (error) => {
                console.log("err post=", error);
            });

}
FetchRequestConfirmAccepted = (requestId, userName) => {
    fetch(this.apiUrl + 'Request/UpdateExecutingUser/' + requestId + '/' + userName, {
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
                result === 'ok' && this.FetchGetRequestsAndFirstBuildingStatus()

            },
            (error) => {
                console.log("err post=", error);
            });


}
FetchGetNumOfNotifications = (userName) => {
    fetch(this.apiUrl + 'Status/GetNumOfNotification/' + userName, {
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
                this.setState({ badgeNotification: result })
            },
            (error) => {
                console.log("err post=", error);
            });


}
FetchGetMyList = async () => {
    let selfUserName = (await this.GetSelfUserName());
    fetch(this.apiUrl + 'MyList/GetMyList/' + selfUserName, {
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
                this.setState({ myList: result })
            },
            (error) => {
                console.log("err post=", error);
            });


}
NotificationsMode = () => {
    this.setState({ isNotificationMode: true })
}
onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.FetchGetRequestsAndFirstBuildingStatus();
    this.setState({ refreshing: false });
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
RequestForward = () => {
    this.setState({
        reqIndexToShow: this.state.reqIndexToShow + 1,
        icon: this.GetRequestIcon(this.state.requests[this.state.reqIndexToShow + 1].type),
        buildingPreloader: true
    })
    this.FetchGetRequestStatusBuilding(this.state.requests[this.state.reqIndexToShow + 1].requestSerialNum)

}
RequestBackward = () => {
    this.setState({
        reqIndexToShow: this.state.reqIndexToShow - 1,
        icon: this.GetRequestIcon(this.state.requests[this.state.reqIndexToShow - 1].type),
        buildingPreloader: true
    })
    this.FetchGetRequestStatusBuilding(this.state.requests[this.state.reqIndexToShow - 1].requestSerialNum)
}
RequestUserConfirmed = (UserName, requestId) => {
    this.FetchGetApproverUserDetais(UserName);
    this.FetchRequestConfirmAccepted(requestId, UserName)

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

render() {

    return (
        this.state.requests === undefined ? <StaticC><View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <PreloaderC />
        </View></StaticC > :

            <StaticC isTabWindow={true}>
                <Notifications isNotificationMode={this.state.isNotificationMode} notRender={this.state.render} off={() => {
                    this.setState({ isNotificationMode: false });
                    this.setState({ badgeNotification: 0 });
                }} />
                <MyList isMyListMode={this.state.isMyListMode} off={() => {
                    this.setState({ isMyListMode: false });
                }}
                    myList={this.state.myList}
                    updateMyList={() => { this.FetchGetMyList() }} />
                <SafeAreaView style={styles.containerView}>
                    <ScrollView style={styles.scrollView}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                            />
                        }>
                        {!this.state.isAddMode && <View style={{ flex: 0.1, marginTop: 20, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center' }}>
                            {this.state.reqIndexToShow === 0 ?
                                <View style={{ flex: 0.2 }} />
                                : <TouchableOpacity style={{ flex: 0.2 }} onPress={this.RequestBackward}>
                                    <Icon name='ios-arrow-back' type='ionicon' color='#fff' />
                                </TouchableOpacity>}
                            <View style={{ flex: 0.6, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Image source={this.state.icon} style={{ height: 30, width: 30, backgroundColor: 'lightgrey', borderRadius: 40 / 4.5 }} />
                                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{this.state.requests[this.state.reqIndexToShow].dueDate.format('HH:mm DD/MM/YYYY')}</Text>
                                    <Text style={{ color: '#ddd', fontSize: 10, textAlign: 'center' }}>{this.state.requests[this.state.reqIndexToShow].dueDate.fromNow()}</Text>
                                </View>
                                <View style={{ height: 30, width: 30 }} />
                            </View>

                            {this.state.reqIndexToShow === this.state.requests.length - 1 ?
                                <View style={{ flex: 0.2 }} />
                                : <TouchableOpacity style={{ flex: 0.2 }} onPress={this.RequestForward}>
                                    <Icon name='ios-arrow-forward' type='ionicon' color='#fff' />
                                </TouchableOpacity>}

                        </View>}

                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={() => this.NotificationsMode()}>
                                {this.state.badgeNotification > 0 && <Badge value={this.state.badgeNotification} status="error" containerStyle={{ position: 'absolute', top: -4, left: -4 }} />}
                                <Icon type='ionicon' name='ios-notifications' size={40} color='#eee' containerStyle={styles.iconButtonContainer} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ isMyListMode: true })}>
                                <Icon type='ionicon' name='ios-list' size={40} color='#eee' containerStyle={styles.iconButtonContainer} />
                            </TouchableOpacity>
                        </View>
                        {this.state.isAddMode &&
                            <TouchableOpacity style={{ marginTop: 150 }} onPress={() => this.props.navigation.navigate('Request')}>

                                <Icon
                                    name='ios-add-circle'
                                    type='ionicon'
                                    color='lightgrey'
                                    size={150}
                                />
                            </TouchableOpacity>
                        }
                        {this.state.buildingPreloader && <PreloaderC ImageStyle={{ top: -150 }} />}
                        {this.state.statusBuilding !== undefined & !this.state.isAddMode &&
                            !this.state.userDetailsMode ?
                            <StatusBuildingC statusBuilding={this.state.statusBuilding} requestUserConfirmed={this.RequestUserConfirmed} />
                            :
                            this.state.approverUserDetails !== undefined && <Overlay
                                isVisible={this.state.userDetailsMode}
                                onBackdropPress={() => this.setState({ userDetailsMode: false })}
                                windowBackgroundColor="rgba(100, 100, 100, 0.9)"
                                overlayBackgroundColor="rgba(220, 220, 220, 1)"
                                borderRadius={20}
                                width="auto"
                                height="auto"
                            >
                                <View style={styles.container}>
                                    <View style={styles.header}>
                                        <View style={styles.hleft}>
                                            <Image source={{ uri: this.state.approverUserDetails.picUrl }} style={styles.image} />
                                        </View>
                                        <View style={styles.hright}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{this.state.approverUserDetails.firstName + ' ' + this.state.approverUserDetails.lastName}</Text>
                                            <Text style={{ fontSize: 15 }}>{this.state.approverUserDetails.gender} , {this.GetAge(this.state.approverUserDetails.birthday)}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.footer}>
                                        <PhoneC phoneNum={this.state.approverUserDetails.phoneNum} />
                                        <Text style={{ fontSize: 15, direction: 'ltr' }}>{this.currentRequestDueDate}</Text>
                                    </View>
                                </View>
                            </Overlay>
                        }
                    </ScrollView>
                </SafeAreaView>
            </StaticC>
    );
}
}
const styles = StyleSheet.create({
    containerView: { height: Dimensions.get('window').height - 130 },
    scrollView: { height: '100%' },
    container: { width: 250, height: 150, flexDirection: 'column' },
    header: { flex: 0.7, flexDirection: 'row', justifyContent: 'flex-end' },
    footer: { flex: 0.3, flexDirection: 'column', alignItems: 'center' },
    hleft: { flex: 0.4, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center' },
    hright: { flex: 0.6, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    image: { height: 80, width: 80, borderRadius: 80 / 2 },
    buttonView: { flex: 0.1, flexDirection: 'row', justifyContent: 'space-between', padding: 30 },
    iconButtonContainer: { flexDirection: 'column', justifyContent: 'center', width: 50, height: 50, backgroundColor: '#666', borderRadius: 50 / 2, zIndex: -1 }
});
export default Home;
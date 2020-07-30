import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, Button, Badge } from 'react-native-elements';
import Moment from 'moment';
import serverURL from '../assets/serverURL';




class TooltipUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            positionToShow: 0,
            usersToShow: []
        }
        this.apiUrl = serverURL+'/api/';
    }
    fetchGetUserToShow = (userName) => {
        fetch(this.apiUrl + 'User/GetUserToShow/' + userName, {
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
                    let utc = {
                        birthday: Moment(result.Birthday),
                        firstName: result.FirstName,
                        gender: result.Gender,
                        lastName: result.LastName,
                        picUrl: result.PicUrl,
                    }
                    let usersToS = this.state.usersToShow
                    usersToS.push(utc)
                    this.setState({
                        usersToShow: usersToS
                    })
                },
                (error) => {
                    console.log("err post=", error);
                });



    }
    componentDidMount = () => {        
        this.props.choosenAprData.forEach(userInApr => {
            this.fetchGetUserToShow(userInApr.ReceiverUserName)
        });
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
    GetColorByStatus = (n) => {
        let c;
        switch (n) {
            case 0:
                c = 'warning'
                break;
            case 1:
                c = 'error'
                break;
            case 2:
                c = 'primary'
                break;
            case 3:
                c = 'success'
                break;
        }
        return c;
    }
    render() {

        return (this.state.usersToShow.length !== 0 ?
            <View style={styles.containerP}>
                <View style={styles.Pleft}>
                    {this.state.positionToShow !== 0 &&
                        <TouchableOpacity onPress={() => this.setState({ positionToShow: this.state.positionToShow - 1 })}>
                            <Icon name='ios-arrow-back' type='ionicon' color='#fff' />
                        </TouchableOpacity>}
                </View>
                <View style={styles.container}>
                    <View style={[styles.header, { flex: this.props.choosenAprData[this.state.positionToShow].RequestStatus === 3 ? 0.7 : 1 }]}>
                        <View style={styles.hleft}>
                            <Badge value="" status={this.GetColorByStatus(this.props.choosenAprData[this.state.positionToShow].RequestStatus)} />
                            <Image source={{ uri: this.state.usersToShow[this.state.positionToShow].picUrl }} style={styles.image} />
                        </View>
                        <View style={styles.hright}>
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{this.state.usersToShow[this.state.positionToShow].firstName + ' ' + this.state.usersToShow[this.state.positionToShow].lastName}</Text>
                            <Text style={{ color: '#ddd', fontSize: 15 }}>{this.state.usersToShow[this.state.positionToShow].gender} , {this.GetAge(this.state.usersToShow[this.state.positionToShow].birthday)}</Text>
                        </View>
                    </View>
                    <View style={[styles.footer, { flex: this.props.choosenAprData[this.state.positionToShow].RequestStatus === 3 ? 0.3 : 0 }]}>
                        {this.props.choosenAprData[this.state.positionToShow].RequestStatus === 3 && <Button title="ACCEPT" type='outline' buttonStyle={{ borderColor: '#31F049' }} titleStyle={{ color: '#31F049' }} onPress={() => this.props.requestUserConfirmed(this.props.choosenAprData[this.state.positionToShow].ReceiverUserName, this.props.choosenAprData[this.state.positionToShow].RequestSerialNum)} />}
                    </View>
                </View>
                <View style={styles.Pright}>
                    {this.state.usersToShow.length !== this.state.positionToShow + 1 && <TouchableOpacity onPress={() => this.setState({ positionToShow: this.state.positionToShow + 1 })}>
                        <Icon name='ios-arrow-forward' type='ionicon' color='#fff' />
                    </TouchableOpacity>}
                </View>
            </View>
            : <View></View>);
    }
}
const styles = StyleSheet.create({
    containerP: { flex: 1, width: 300, height: 200, flexDirection: 'row' },
    Pleft: { flex: 0.1, justifyContent: 'center' },
    Pright: { flex: 0.1, justifyContent: 'center' },
    container: { flex: 0.8, flexDirection: 'column' },
    header: { flex: 0.7, flexDirection: 'row', justifyContent: 'flex-end' },
    footer: { flex: 0.3, flexDirection: 'row', justifyContent: 'center' },
    hleft: { flex: 0.4, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center' },
    hright: { flex: 0.6, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    image: { height: 80, width: 80, borderRadius: 80 / 2 }
});

export default TooltipUsers;

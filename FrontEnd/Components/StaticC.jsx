import React, { Component } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image, Dimensions, I18nManager } from 'react-native';



export default class StaticC extends Component {
    constructor(props) {
        super(props);
        this.state = {}

    }

    render() {
        return (<View style={[styles.container,{height: Dimensions.get('window').height-(this.props.isTabWindow===true?50:0)}]}>
            <ImageBackground source={require('../assets/backGround.jpg')} style={{ flex: 1 }} resizeMode='cover'>
                <View style={styles.header}>
                    <View style={{ flex: 0.2 }}>
                        <Image source={require('../assets/greyLogo.png')} style={{ width: 45, height: 45, borderRadius: 4, marginTop: 35, alignSelf: 'center' }} />
                    </View>
                    <Text style={{ flex: 0.6, color: '#FFFFFF', fontWeight: 'bold', fontSize: 20, paddingTop: 35, textAlign: 'center', alignSelf: 'center' }}>BuildApp</Text>
                </View>
                {this.props.children}
            </ImageBackground>
        </View>);
    }
}

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        backgroundColor: '#434343',
        direction: 'rtl'
    },
    header: {
        height: 90,
        backgroundColor: '#666666',
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

});
import React from 'react';
import { View ,StyleSheet, Text} from 'react-native';


class InfoBuilding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    GetColorByStatus = (n) => {
        let c;
        switch (n) {
            case 0:
                c = '#666666'
                break;
            case 1:
                c = '#FA2F12'
                break;
            case 2:
                c = '#469EFF'
                break;
            case 3:
                c = '#31F049'
                break;
        }
        return c;
    }

    render() { 
        return (<View style={styles.container}>
            <View style={styles.row}>
                <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(0), borderRadius: 5, alignSelf: 'center' }}>
                </View>
                <Text style={{flex:0.8,alignSelf: 'center'}}>Doesn't exist in building / doesn't ready to do the service</Text>
            </View>
            <View style={styles.row}>
                <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(1), borderRadius: 5, alignSelf: 'center' }}>
                </View>
                <Text style={{flex:0.8,alignSelf: 'center'}}>Already saw your request and didn't accept</Text>
            </View>
            <View style={styles.row}>
                <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(2), borderRadius: 5, alignSelf: 'center' }}>
                </View>
                <Text style={{flex:0.8,alignSelf: 'center'}}>Your request doesn't seen yet</Text>
            </View>
            <View style={styles.row}>
                <View style={{ width: 17, height: 17, backgroundColor: this.GetColorByStatus(3), borderRadius: 5, alignSelf: 'center' }}>
                </View>
                <Text style={{flex:0.8,alignSelf: 'center'}}>Approved your request</Text>
            </View>
        </View>);
    }
}
 
const styles=StyleSheet.create({
    container:{
        flex:1
    },
    row:{
        flex:0.25,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-evenly',
    }
})

export default InfoBuilding;
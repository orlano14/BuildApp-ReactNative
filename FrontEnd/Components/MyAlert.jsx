import React, { Component } from 'react';
import { Overlay ,Button} from 'react-native-elements';
import { View,Text} from 'react-native';



class MyAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <Overlay
            isVisible={this.props.overlayIsVisible}
            onBackdropPress={() => this.props.overlayFalse()}
            windowBackgroundColor="rgba(100, 100, 100, 0.9)"
            overlayBackgroundColor="rgba(220, 220, 220, 1)"
            borderRadius={20}
            width="auto"
            height="auto"
          >
            <View>
        <Text style={{fontSize:20,fontWeight:'bold',alignSelf:'center'}}>{this.props.title}</Text>
            <Text style={{fontSize:18, borderBottomWidth:1,borderBottomColor:'lightgrey',alignSelf:'center'}}>{this.props.body}</Text>
            <Button title='OK' type='clear' onPress={() => this.props.overlayFalse()}/>
            </View>
          </Overlay> );
    }
}
 
export default MyAlert;
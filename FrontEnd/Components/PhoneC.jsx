import React from 'react';
import { Overlay ,Icon} from 'react-native-elements';
import { Clipboard,TouchableOpacity,Text,View,Linking } from 'react-native';

class PhoneC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            copy:'',
            copyOverlay:false
        }
    }
    render() { 
        return (<View style={{flexDirection:'row',justifyContent:'center',padding:10}}>
        <View style={{flexDirection:'column',justifyContent:'center'}}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center',marginEnd:10}}>
                {this.props.phoneNum}
            </Text>
            </View>
    <TouchableOpacity onPress={() => {
        Clipboard.setString(this.props.phoneNum);
        this.setState({copy:this.props.phoneNum});
        this.setState({copyOverlay:true});
        setInterval(() => {
            this.setState({copyOverlay:false});
           }, 1500);
           }}
           style={{paddingHorizontal:5}}>
            <Icon type='ionicon' name='ios-copy' size={30} color={this.state.copy===this.props.phoneNum?'#00aa00':'#000'}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {
           Linking.openURL(`tel:${this.props.phoneNum}`)
           }}
           style={{paddingHorizontal:5}}>
            <Icon type='ionicon' name='ios-call' size={30} />
    </TouchableOpacity>
    <Overlay
        isVisible={this.state.copyOverlay}
        onBackdropPress={() => this.setState({copyOverlay:false})}
        windowBackgroundColor="rgba(100, 100, 100, 0.1)"
        overlayBackgroundColor="rgba(220, 220, 220, 1)"
        borderRadius={20}
        width="auto"
        height="auto"
        >
            <Text style={{ fontSize: 25, alignSelf: 'center' }}>copied</Text>
    </Overlay>
        </View>);
    }
}
 
export default PhoneC;
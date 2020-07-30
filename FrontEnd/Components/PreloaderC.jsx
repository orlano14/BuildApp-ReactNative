import * as React from 'react';
import { Animated, Easing, View ,Image} from 'react-native';


class PreloaderC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.animation = new Animated.Value(0);

    }
    componentDidMount = () => {
        Animated.loop(
            Animated.timing(this.animation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();
    }
    render() {
        const rotation = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        return (
            <View style={[this.props.containerStyle&&this.props.containerStyle,{ width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}]}>
                <Animated.View
                    style={[this.props.ImageStyle&&this.props.ImageStyle,{
                        width: 80,
                        height: 80,
                        transform: [{ rotate: rotation }],
                    }]}
                >
                    <Image source={require('../assets/whiteLogo.png')}  style={{ width: 80, height: 80,borderRadius:80/2, alignSelf: 'center'}} />
                </Animated.View>
            </View>);
    }
}

export default PreloaderC;
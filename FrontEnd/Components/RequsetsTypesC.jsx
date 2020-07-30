import React, { Component } from 'react'; 
import { View ,StyleSheet, Dimensions,Image, TouchableOpacity} from 'react-native';
import StaticC from './StaticC';
import NewRequestC from './NewRequestC';

  
class RequestsTypesC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type:undefined
        }
    }
    render() { 
        var newRequesrC=this.state.type!==undefined?<NewRequestC type={this.state.type} navigateHome={()=>this.props.navigation.navigate('Home')}/>:null
        return (
            <StaticC isTabWindow={true}>
        <View style={styles.container}>
<View style={styles.left}>
        {newRequesrC}
</View>
        <View style={styles.right}>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='babysitter'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'babysitter'})}>
        <Image source={require('../assets/babysitter.png')} style={styles.tOpacity} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='dogwalker'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'dogwalker'})}>
        <Image source={require('../assets/dogwalker.png')} style={styles.tOpacity}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='carpool'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'carpool'})}>
        <Image source={require('../assets/carpool.png')} style={styles.tOpacity}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='groceries'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'groceries'})}>
        <Image source={require('../assets/groceries.png')} style={styles.tOpacity}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='availability'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'availability'})} >
        <Image source={require('../assets/availability.png')} style={styles.tOpacity}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tOpacity,this.state.type==='skill'&&{borderColor:'rgba(150, 150, 250, 1)',borderWidth:5}]} onPress={()=>this.setState({type:'skill'})}>
        <Image source={require('../assets/skills.png')} style={styles.tOpacity}/>
        </TouchableOpacity>
</View>
        </View>
        </StaticC>
        );
    }
    
}
const styles = StyleSheet.create({
    container: { flex:1, flexDirection: 'row',justifyContent:'flex-end' },
    right:{flex:0.4,height:'95%',borderLeftWidth:0.5,borderLeftColor:'lightgrey',alignSelf:'center',justifyContent:'space-around'},
    left:{flex:0.6,height:'95%'},
    tOpacity:{height:80,width:80,backgroundColor:'lightgrey',alignSelf:'center',borderRadius:80/4.5},
});
 
export default RequestsTypesC;
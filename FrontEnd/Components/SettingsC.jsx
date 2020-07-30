import React, { Component } from 'react';
import { View, StyleSheet, Text, Image,Switch,I18nManager,TouchableOpacity } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import ButtonGroupC from '../Components/ButtonGroupC';


class SettingsC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skills:[],
            addSkillMode:false
        }
        
    }
    AddSkillModeChange=()=>{
        this.props.addSkillModeChange()
        this.setState({
            addSkillMode:this.state.addSkillMode?false:true
        })
    }
    render() {
        return (
            <View>
            <View style={{flexDirection:I18nManager.isRTL?'row-reverse':'row',width:'95%',alignSelf:'center',marginTop:20,paddingTop:15,paddingBottom:15}}>
            <Image source={this.props.iconSource} style={{height:40,width:40,backgroundColor:'lightgrey',alignSelf:'center',borderRadius:40/4.5,marginRight:15}}/>
            <View style={{flex:1,flexDirection:"column",paddingRight:15}}>
        <Text style={{fontSize:15,fontWeight:'bold',color:"#fff"}}>{this.props.title}</Text>
            <Text style={{fontSize:10,color:"lightgrey"}}>{this.props.body}</Text>
            </View>
            {this.props.skillsArr===undefined?
            <Switch
        value={this.props.value}
        trackColor={{true:'#31F049',false:'grey'}}
        onValueChange={v => {

            this.props.changeStateForSetting(v)
        }}
      />:null}

        </View>
        {this.props.skillsArr!==undefined&&
        <View>
        {this.props.skills.map(element => 
            <View key={'V'+element.SkillNum} style={{width:'65%',alignSelf:'center',flexDirection:I18nManager.isRTL?'row-reverse':'row'}}>
        <Icon
        name='dot-single'
        type='entypo'
        color='#fff'
        key={'I'+element.SkillNum}
      />
        <Text key={'T'+element.SkillNum} style={{color:'#fff',fontSize:15}}>{element.SkillName}</Text>
        <TouchableOpacity style={{flex:1}} onPress={()=>this.props.indexRemoved(element.SkillNum)}>
    <Icon
      name="ios-remove-circle-outline"
      type='ionicon'
      color="#fff"
      size={20}
      containerStyle={{alignSelf:I18nManager.isRTL?'flex-start':'flex-end'}}
    />
    </TouchableOpacity>
        </View>
        
        )}
        {!this.state.addSkillMode&&<Button containerStyle={{alignSelf:"center"}} title='+Add skill' type='clear' onPress={this.AddSkillModeChange} />}

        {this.state.addSkillMode&&<ButtonGroupC indexSelected={e=>{this.AddSkillModeChange(); this.props.indexSelected(e)}} skillsArr={this.props.skillsArr}/>}
        </View>
    }   
        </View>
          );
    }
}
 
export default SettingsC;
import React, { Component } from 'react';
import { ButtonGroup } from 'react-native-elements';

class ButtonGroupC extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex:null
          }
          this.updateIndex = this.updateIndex.bind(this)
    }
    updateIndex (selectedIndex) {
        this.setState({selectedIndex})
        this.props.skillsArr.forEach(element => {
            element.SkillName===this.buttons[selectedIndex]&&this.props.indexSelected(element.SkillNum);
        });
        
      }
      
      render () {
        this.buttons = this.props.skillsArr.map(obj=>obj.SkillName)
        const { selectedIndex } = this.state
      
        return (
          <ButtonGroup
            onPress={this.updateIndex}
            buttons={this.buttons}
            containerStyle={{height:'auto',width:'65%',flexDirection:'column',alignSelf:'center',backgroundColor:'transparent'}}
            buttonStyle={{borderBottomColor:'lightgrey',borderBottomWidth:1,paddingTop:5,paddingBottom:5}}
            textStyle={{color:'#fff'}}
          />
        )
      }
}
 
export default ButtonGroupC;
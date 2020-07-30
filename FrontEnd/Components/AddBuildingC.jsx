import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, TextInput, Image, TouchableOpacity,AsyncStorage,I18nManager } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MyAlert from '../Components/MyAlert';
import Address from '../Classes/Address';
import serverURL from '../assets/serverURL';





export default class AddBuildingC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pickedA: { description: '' },
            myAlert:{overlayIsVisible: false},
            floorsNum:null
        }
        this.apiUrl = serverURL+'/api/Address';
    }
    GetSelfUserName=async()=>{
        try {
            let u = JSON.parse(await AsyncStorage.getItem('MyUser'));

            if (u !== null) {               
                return u.userName;
            }
          } catch (error) {
            console.log("Error geting AsyncStorege");
          }
          
    }
    fetchIsPlaceIdExist=(address)=>{
      
        fetch(this.apiUrl + "/IsPlaceIdExist/" + address.placeId, {
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
                  
                if(result==='false'){
                    this.fetchAddBuilding(address)
                }
                else{
                    this.props.buildingAdded(result);
                }
      
              },
              (error) => {
                console.log("err post=", error);
              });
    }
    fetchAddBuilding = (a) => {
        fetch(this.apiUrl + "/AddAddress", {
          method: 'POST',
          body: JSON.stringify(a),
          headers: new Headers({
            'Content-type': 'application/json; charset=UTF-8'
          })
    
        })
          .then(res => {
            return res.json()
          })
          .then(
            (result) => {
                this.props.buildingAdded(result);
            },
            (error) => {
              console.log("err post=", error);
            });
      }
    SaveBuilding=async()=>{
        
        if(this.state.pickedA.description!==''){
            if(this.state.floorsNum!==null){
            let addedUser=(await this.GetSelfUserName());
            let address=new Address(this.state.pickedA.id,this.state.pickedA.terms[3].value,this.state.pickedA.terms[2].value,this.state.pickedA.terms[0].value,parseInt(this.state.pickedA.terms[1].value),parseInt(this.state.floorsNum),addedUser)
            this.fetchIsPlaceIdExist(address)
            
            }
            else{
                this.setState({
                    myAlert:{overlayIsVisible:true,message:'Insert number of floors'}
                })
            }
        }
        else{
            this.setState({
                myAlert:{overlayIsVisible:true,message:'Pick an address'}
            })

        }
    }
    CancleBuilding=()=>{
        this.setState({
            pickedA: { description: '' },
            floorsNum:null
        })
        this.props.buildingAddCancled();
    }
    overlayFalse = () => {
        this.setState({myAlert:{overlayIsVisible: false}})
      }
    render() {
        
        return (
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center',justifyContent: 'flex-start', marginTop: 20 }}>
                    <GooglePlacesAutocomplete
                        placeholder='דוגמא: אלנבי 2 תל אביב'
                        minLength={7} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'done'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data) => { // 'details' is provided when fetchDetails = true
                            if(data.terms.length===4)
                            {
                                this.setState({
                                    pickedA:data
                                })
                            }
                            else{
                                this.setState({
                                    myAlert:{overlayIsVisible:true,message:'The address is not accurate'}
                                })
                            }
                        }}
                        

                        getDefaultValue={() => ''}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyCm6PzY-nTz-hRXibPm3KdayAMqW-CdC-8',
                            language: 'he', // language of the results
                            types: 'address', // default: 'geocode'
                        }}

                        styles={{
                            textInputContainer: {
                                width: '100%',
                                backgroundColor:'transform',
                                borderTopWidth: 0,
                                borderBottomWidth:0,
                            },
                            container:{
                                flex:0.27,
                            },
                            row:{
                                direction:'rtl',
                                alignSelf:I18nManager.isRTL?'flex-start':'flex-end'

                            },
                            description: {
                                fontWeight: 'bold',
                                color:'#fff',
                                // alignSelf:'flex-end'
                            },
                            predefinedPlacesDescription: {
                                color: '#31F049'
                            },
                        }}

                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        

                        GooglePlacesDetailsQuery={{
                            fields: 'formatted_address',
                        }}

                        predefinedPlaces={[this.state.pickedA]}

                        debounce={1000} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                        renderRightButton={() => <Icon
                            name='office-building'
                            type='material-community'
                            color={this.state.pickedA.description===''?'white':'#31F049'}
                            size={40}
                          />}
                    />
                    <Input label='Coutry'
              placeholder='Coutry'
              value={this.state.pickedA.description!==''?this.state.pickedA.terms[3].value:''}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
              containerStyle={{ flex: 0.1, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              disabled
            />
            <Input label='Locality'
              placeholder='Locality'
              value={this.state.pickedA.description!==''?this.state.pickedA.terms[2].value:''}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
              containerStyle={{ flex: 0.1, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              disabled
            />
            <Input label='Street'
              placeholder='Street'
              value={this.state.pickedA.description!==''?this.state.pickedA.terms[0].value:''}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
              containerStyle={{ flex: 0.1, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              disabled
            />
            <Input label='House Number'
              placeholder='House Number'
              value={this.state.pickedA.description!==''?this.state.pickedA.terms[1].value:''}
              labelStyle={{ color: '#fff' }}
              inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
              containerStyle={{ flex: 0.1, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              disabled
            />
            <Input label='Number of floors'
              placeholder='Insert number of floors'
              labelStyle={{ color: '#fff' }}
              placeholderTextColor='#fff'
              inputContainerStyle={{ borderBottomColor: 'lightgrey' }}
              containerStyle={{ flex: 0.1, width: '95%' }}
              inputStyle={{ color: '#fff' }}
              onChangeText={floorsNum => this.setState({ floorsNum })}
            />
            <View style={{ width: '95%', alignSelf:'center',flexDirection: I18nManager.isRTL?'row-reverse':'row', justifyContent: 'space-evenly', paddingTop: 20 }}>
            <Button title='Save' type='solid' onPress={this.SaveBuilding} />
              <Button title='Cancle' type='clear' onPress={this.CancleBuilding} />
            </View>
        <MyAlert title='Oops!' body={this.state.myAlert.message} overlayFalse={this.overlayFalse} overlayIsVisible={this.state.myAlert.overlayIsVisible} />

                </View>

        );
    }
}

